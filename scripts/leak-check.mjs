#!/usr/bin/env node
// Scans a directory's text files for blocklist matches and built-in leak shapes.
// Usage: node scripts/leak-check.mjs <blocklist-file> [dir=.]
// Output: one "<path>:<line>:<rule>" per match. Never prints matched or rule text.
// Exit: 0 clean, 1 match found, 2 usage or IO error.
//
// Built-in patterns are assembled from pieces at run time so that this file
// (which is itself scanned) never contains the shapes it looks for.

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

class CheckError extends Error {}

const AT = String.fromCharCode(64);
const WORD = "[A-Za-z0-9]";
const OPEN = "(?<![A-Za-z0-9])";

// Addresses that are allowed to appear (assembled from pieces).
const OWNER_ADDRESS = ["im", "ramidem"].join(".") + AT + "gmail" + ".com";
const NOREPLY_SUFFIX = AT + ["users", "noreply", "github", "com"].join(".");

const EMAIL_RE = new RegExp(
  "[A-Za-z0-9._%+-]+" + AT + "[A-Za-z0-9-]+(?:\\.[A-Za-z0-9-]+)*\\.[A-Za-z]{2,}",
  "g",
);
const LONG_ID_RE = new RegExp("[A-Za-z0-9_-]{" + 40 + ",}");
const HOST_RE = new RegExp(
  "[A-Za-z0-9-]+(?:\\.[A-Za-z0-9-]+)*\\.(?:ts\\.net|" + "loc" + "al)(?![A-Za-z0-9-])",
  "i",
);
const KEY_RE = new RegExp(
  OPEN + "(?:" + ["sk", ""].join("-") + WORD + "|" + ["ghp", ""].join("_") + WORD +
    "|" + "xo" + "x[A-Za-z-]|" + "AK" + "IA[A-Z0-9]{12,})",
);
const IP_URL_RE = new RegExp(
  "[A-Za-z][A-Za-z0-9+.-]*:" + "//" + "(?:[^\\s/" + AT + "]*" + AT + ")?" +
    "[0-9]{1,3}(?:\\.[0-9]{1,3}){3}(?![0-9])",
);

function hasForeignEmail(line) {
  for (const m of line.matchAll(EMAIL_RE)) {
    const addr = m[0].toLowerCase();
    if (addr === OWNER_ADDRESS || addr.endsWith(NOREPLY_SUFFIX)) continue;
    return true;
  }
  return false;
}

const BUILTIN_RULES = [
  { id: "B1", test: hasForeignEmail },
  { id: "B2", test: (line) => LONG_ID_RE.test(line) },
  { id: "B3", test: (line) => HOST_RE.test(line) },
  { id: "B4", test: (line) => KEY_RE.test(line) },
  { id: "B5", test: (line) => IP_URL_RE.test(line) },
];

function isInside(parent, child) {
  const rel = path.relative(parent, child);
  return rel === "" || (rel !== ".." && !rel.startsWith(".." + path.sep) && !path.isAbsolute(rel));
}

function loadBlocklist(blocklistArg, dirArg) {
  let blReal;
  let dirReal;
  try {
    blReal = fs.realpathSync(blocklistArg);
  } catch {
    throw new CheckError("cannot read blocklist");
  }
  try {
    dirReal = fs.realpathSync(dirArg);
  } catch {
    throw new CheckError("cannot read directory");
  }
  if (isInside(dirReal, blReal)) {
    throw new CheckError("blocklist must live outside the scanned directory");
  }
  let raw;
  try {
    raw = fs.readFileSync(blReal, "utf8");
  } catch {
    throw new CheckError("cannot read blocklist");
  }
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
  const rules = [];
  raw.split("\n").forEach((rawLine, index) => {
    const lineNo = index + 1;
    const line = rawLine.endsWith("\r") ? rawLine.slice(0, -1) : rawLine;
    if (line.trim() === "" || line.trimStart().startsWith("#")) return;
    try {
      rules.push({ id: String(lineNo), re: new RegExp(line, "i") });
    } catch {
      throw new CheckError("invalid pattern on blocklist line " + lineNo);
    }
  });
  return rules;
}

function walk(root) {
  const out = [];
  const visit = (rel) => {
    let entries;
    try {
      entries = fs.readdirSync(path.join(root, rel), { withFileTypes: true });
    } catch {
      throw new CheckError("cannot read directory");
    }
    entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
    for (const entry of entries) {
      if (entry.name === ".git" || entry.name === "node_modules") continue;
      const childRel = rel === "" ? entry.name : rel + "/" + entry.name;
      if (entry.isDirectory()) visit(childRel);
      else if (entry.isFile()) out.push(childRel);
    }
  };
  visit("");
  return out;
}

function listFiles(dir) {
  const env = { ...process.env };
  for (const key of ["GIT_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE"]) delete env[key];
  const res = spawnSync("git", ["-C", dir, "ls-files", "-co", "--exclude-standard", "-z"], {
    env,
    maxBuffer: 256 * 1024 * 1024,
  });
  if (res.status === 0 && !res.error) {
    const names = res.stdout.toString("utf8").split("\0").filter((n) => n !== "");
    return [...new Set(names)].sort();
  }
  return walk(dir);
}

function readText(dir, rel) {
  let buf;
  try {
    const full = path.join(dir, rel);
    const st = fs.lstatSync(full);
    if (!st.isFile()) return null;
    buf = fs.readFileSync(full);
  } catch (err) {
    if (err && err.code === "ENOENT") return null;
    throw new CheckError("cannot read a file in the directory");
  }
  if (buf.subarray(0, 8192).includes(0)) return null;
  return buf.toString("utf8");
}

function main(argv) {
  if (argv.length < 1 || argv.length > 2) {
    throw new CheckError("usage: node scripts/leak-check.mjs <blocklist-file> [dir]");
  }
  const dir = argv[1] ?? ".";
  let st;
  try {
    st = fs.statSync(dir);
  } catch {
    throw new CheckError("cannot read directory");
  }
  if (!st.isDirectory()) throw new CheckError("not a directory");

  const blocklist = loadBlocklist(argv[0], dir);
  const rules = [
    ...blocklist.map((r) => ({ id: r.id, test: (line) => r.re.test(line) })),
    ...BUILTIN_RULES,
  ];

  const lines = [];
  for (const rel of listFiles(dir)) {
    const text = readText(dir, rel);
    if (text === null) continue;
    text.split("\n").forEach((line, index) => {
      for (const rule of rules) {
        if (rule.test(line)) lines.push(rel + ":" + (index + 1) + ":" + rule.id);
      }
    });
  }
  if (lines.length > 0) process.stdout.write(lines.join("\n") + "\n");
  process.stderr.write("matches: " + lines.length + "\n");
  return lines.length > 0 ? 1 : 0;
}

try {
  process.exitCode = main(process.argv.slice(2));
} catch (err) {
  if (err instanceof CheckError) {
    process.stderr.write("leak-check: " + err.message + "\n");
    process.exitCode = 2;
  } else {
    process.stderr.write("leak-check: unexpected error\n");
    process.exitCode = 2;
  }
}
