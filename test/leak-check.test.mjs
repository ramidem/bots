import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const SCRIPT = path.resolve(import.meta.dirname, "..", "scripts", "leak-check.mjs");
const REPO_ROOT = path.resolve(import.meta.dirname, "..");

// Everything that looks like a leak is assembled at run time so this file
// passes the check it tests.
const AT = String.fromCharCode(64);
const OWNER = ["im", "ramidem"].join(".") + AT + "gmail" + ".com";
const FOREIGN = "user" + AT + "example" + ".com";
const NOREPLY = "12345+someone" + AT + ["users", "noreply", "github", "com"].join(".");
const PLANTED = "zz" + "planted-term";

function cleanEnv() {
  const env = { ...process.env };
  for (const key of ["GIT_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE"]) delete env[key];
  return env;
}

function tmp(label) {
  return fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), "leakcheck-" + label + "-"));
}

function write(dir, rel, content) {
  const full = path.join(dir, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  return full;
}

function git(dir, ...args) {
  const res = spawnSync("git", ["-C", dir, ...args], { env: cleanEnv() });
  assert.equal(res.status, 0, "git " + args[0] + " failed");
}

function makeRepo(files = {}) {
  const dir = tmp("repo");
  git(dir, "init", "-q");
  for (const [rel, content] of Object.entries(files)) write(dir, rel, content);
  return dir;
}

function makeBlocklist(content) {
  const dir = tmp("list");
  return write(dir, "list.txt", content);
}

function run(blocklist, dir) {
  const args = [SCRIPT, blocklist];
  if (dir !== undefined) args.push(dir);
  const res = spawnSync(process.execPath, args, { env: cleanEnv(), encoding: "utf8" });
  return { code: res.status, out: res.stdout, err: res.stderr };
}

const EMPTY_LIST = () => makeBlocklist("");

function ids(out) {
  return out.split("\n").filter(Boolean);
}

test("clean directory exits 0 with no output", () => {
  const dir = makeRepo({ "a.txt": "hello world\nnothing here\n" });
  git(dir, "add", "a.txt");
  write(dir, "b.txt", "untracked and clean\n");
  const r = run(EMPTY_LIST(), dir);
  assert.equal(r.code, 0);
  assert.equal(r.out, "");
});

test("blocklist term matches, reports path:line:rule only", () => {
  const dir = makeRepo({ "notes/x.txt": "first\nsecond " + PLANTED + " here\n" });
  const regexText = PLANTED.replace("-", "[-]");
  const list = makeBlocklist(regexText + "\n");
  const r = run(list, dir);
  assert.equal(r.code, 1);
  assert.deepEqual(ids(r.out), ["notes/x.txt:2:1"]);
  for (const text of [r.out, r.err]) {
    assert.ok(!text.includes(PLANTED));
    assert.ok(!text.includes(regexText));
  }
});

test("blocklist matching is case-insensitive", () => {
  const dir = makeRepo({ "x.txt": PLANTED.toUpperCase() + "\n" });
  const r = run(makeBlocklist(PLANTED + "\n"), dir);
  assert.equal(r.code, 1);
  assert.deepEqual(ids(r.out), ["x.txt:1:1"]);
});

test("missing blocklist exits 2", () => {
  const dir = makeRepo({ "a.txt": "x\n" });
  const r = run(path.join(tmp("none"), "absent.txt"), dir);
  assert.equal(r.code, 2);
});

test("wrong arguments exit 2", () => {
  const res = spawnSync(process.execPath, [SCRIPT], { env: cleanEnv(), encoding: "utf8" });
  assert.equal(res.status, 2);
});

test("unreadable directory exits 2", () => {
  const r = run(EMPTY_LIST(), path.join(tmp("none"), "absent"));
  assert.equal(r.code, 2);
});

test("blocklist inside the scanned directory exits 2 without list content", () => {
  const dir = makeRepo({ "a.txt": "x\n" });
  const list = write(dir, "sub/list.txt", PLANTED + "\n");
  const r = run(list, dir);
  assert.equal(r.code, 2);
  assert.ok(!r.out.includes(PLANTED));
  assert.ok(!r.err.includes(PLANTED));
});

test("40-character id matches B2", () => {
  const id = "aB3_-".repeat(8);
  assert.equal(id.length, 40);
  const dir = makeRepo({ "ids.txt": "ok\nid: " + id + "\n" });
  const r = run(EMPTY_LIST(), dir);
  assert.equal(r.code, 1);
  assert.deepEqual(ids(r.out), ["ids.txt:2:B2"]);
  assert.ok(!r.out.includes(id));
});

test("39-character run does not match B2", () => {
  const dir = makeRepo({ "ids.txt": "abcdefghi".repeat(4) + "abc\n" });
  assert.equal(run(EMPTY_LIST(), dir).code, 0);
});

test("email rule: foreign flagged, owner and no-reply allowed", () => {
  const dir = makeRepo({
    "foreign.txt": "contact " + FOREIGN + "\n",
    "owner.txt": "by " + OWNER + "\n",
    "noreply.txt": "by " + NOREPLY + "\n",
  });
  const r = run(EMPTY_LIST(), dir);
  assert.equal(r.code, 1);
  assert.deepEqual(ids(r.out), ["foreign.txt:1:B1"]);
  assert.ok(!r.out.includes(FOREIGN));
});

test("host rule flags two internal hostname suffixes", () => {
  const tailnet = "box1.tail1234." + "ts" + ".net";
  const lan = "printer" + "." + "loc" + "al";
  const dir = makeRepo({ "h.txt": "a " + tailnet + "\nb " + lan + "\nc example.org\n" });
  const r = run(EMPTY_LIST(), dir);
  assert.equal(r.code, 1);
  assert.deepEqual(ids(r.out), ["h.txt:1:B3", "h.txt:2:B3"]);
  assert.ok(!r.out.includes(tailnet) && !r.out.includes(lan));
});

test("key prefix rule matches each prefix", () => {
  const samples = [
    ["sk", "-", "abcdef123456"].join(""),
    ["ghp", "_", "abcdef123456"].join(""),
    ["xo", "xb", "-123456"].join(""),
    ["AK", "IA", "ABCDEFGHIJKL"].join(""),
  ];
  const dir = makeRepo({ "k.txt": samples.map((s) => "v=" + s).join("\n") + "\n" });
  const r = run(EMPTY_LIST(), dir);
  assert.equal(r.code, 1);
  assert.deepEqual(ids(r.out), ["k.txt:1:B4", "k.txt:2:B4", "k.txt:3:B4", "k.txt:4:B4"]);
  for (const s of samples) assert.ok(!r.out.includes(s));
});

test("key prefix rule ignores the same letters inside ordinary words", () => {
  const dir = makeRepo({ "w.txt": "task-list and disk-usage\n" });
  assert.equal(run(EMPTY_LIST(), dir).code, 0);
});

test("URL with a dotted-quad host matches B5; hostname URL does not", () => {
  const ipUrl = "http" + ":" + "//" + [10, 0, 0, 5].join(".") + ":8080/x";
  const nameUrl = "https" + ":" + "//" + "example.org/x";
  const dir = makeRepo({ "u.txt": nameUrl + "\n" + ipUrl + "\n" });
  const r = run(EMPTY_LIST(), dir);
  assert.equal(r.code, 1);
  assert.deepEqual(ids(r.out), ["u.txt:2:B5"]);
  assert.ok(!r.out.includes(ipUrl));
});

test("gitignored and binary files are not scanned", () => {
  const dir = makeRepo({
    ".gitignore": "ignored.txt\nbuild/\n",
    "ignored.txt": FOREIGN + "\n",
    "build/out.txt": FOREIGN + "\n",
  });
  write(dir, "blob.bin", Buffer.concat([Buffer.from([0, 1, 2]), Buffer.from(FOREIGN)]));
  const r = run(EMPTY_LIST(), dir);
  assert.equal(r.code, 0);
  assert.equal(r.out, "");
});

test("non-git directory is walked, skipping .git and node_modules", () => {
  const dir = tmp("plain");
  write(dir, "src/a.txt", "fine\n" + FOREIGN + "\n");
  write(dir, "node_modules/p/i.txt", FOREIGN + "\n");
  write(dir, ".git/config", FOREIGN + "\n");
  const r = run(EMPTY_LIST(), dir);
  assert.equal(r.code, 1);
  assert.deepEqual(ids(r.out), ["src/a.txt:2:B1"]);
});

test("invalid regex line exits 2, reporting only the line number", () => {
  const dir = makeRepo({ "a.txt": "x\n" });
  const bad = "broken(" + "zzbadtext";
  const r = run(makeBlocklist("# c\n\n" + bad + "\n"), dir);
  assert.equal(r.code, 2);
  assert.ok(r.err.includes("3"));
  assert.ok(!r.out.includes("zzbadtext") && !r.err.includes("zzbadtext"));
  assert.ok(!r.err.includes("broken"));
});

test("comments and blank lines count toward rule numbers", () => {
  const dir = makeRepo({ "a.txt": "one\nthe " + PLANTED + "\n" });
  const list = makeBlocklist("# comment\n\n  # indented comment\n" + PLANTED + "\n");
  const r = run(list, dir);
  assert.equal(r.code, 1);
  assert.deepEqual(ids(r.out), ["a.txt:2:4"]);
});

test("CRLF blocklist works", () => {
  const dir = makeRepo({ "a.txt": PLANTED + "\n" });
  const r = run(makeBlocklist("# c\r\n" + PLANTED + "\r\n"), dir);
  assert.deepEqual(ids(r.out), ["a.txt:1:2"]);
});

test("this repo passes its own check with an empty blocklist", () => {
  const r = run(EMPTY_LIST(), REPO_ROOT);
  assert.equal(r.out, "");
  assert.equal(r.code, 0);
});
