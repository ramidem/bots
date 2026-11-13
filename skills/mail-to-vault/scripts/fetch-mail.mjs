#!/usr/bin/env node
// Copy a mailbox into the vault as one markdown digest per day (text only, read-only on Gmail).
//
// Usage:
//   node fetch-mail.mjs --out <dir> [--account <email>] [--days N | --from YYYY-MM-DD [--to YYYY-MM-DD]] [--label <name>]
//
// --out      folder that receives YYYY-MM-DD-mail.md files (created if missing)
// --account  Gmail address to read (needed only when several accounts are signed in to calma)
// --days     refresh today and the N-1 days before it (default 2)
// --from/--to  backfill an inclusive range of dates in the user's local time zone
// --label    label written to the front matter (default: folder name)
// Env: CALMA_PATH (default $HOME/Code/<owner>/calma/src/calma.ts)
//
// Days are dates in the user's local time zone. Each run rebuilds the whole day file, so reruns are safe.
// Prints one JSON summary line. Attachments are never downloaded; their names are reported.

import { execFile } from "node:child_process";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { basename, join, resolve } from "node:path";

const CALMA = process.env.CALMA_PATH || join(homedir(), "Code/<owner>/calma/src/calma.ts");
const TZ = "Asia/Manila";
const OFFSET_MS = 8 * 3600 * 1000;
const BODY_CAP = 20_000; // calma truncates bodies at this many characters

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const outDir = opt("out") ? resolve(opt("out")) : null;
const account = opt("account");
const label = opt("label") || (outDir ? basename(outDir) : "mail");
if (!outDir) fail("bad_args", "--out <dir> is required");

function fail(error, message) {
  console.log(JSON.stringify({ ok: false, error, message }));
  process.exit(1);
}

const manilaDate = (ms) => new Date(ms + OFFSET_MS).toISOString().slice(0, 10);
const dayStartSec = (d) => Math.floor(Date.parse(`${d}T00:00:00+08:00`) / 1000);
const addDays = (d, n) => manilaDate(Date.parse(`${d}T00:00:00+08:00`) + n * 86400_000);

function dayList() {
  const from = opt("from");
  const today = manilaDate(Date.now());
  if (from) {
    const to = opt("to") || today;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) fail("bad_args", "dates must be YYYY-MM-DD");
    const days = [];
    for (let d = from; d <= to; d = addDays(d, 1)) days.push(d);
    return days;
  }
  const n = Number(opt("days") || 2);
  if (!Number.isInteger(n) || n < 1 || n > 400) fail("bad_args", "--days must be 1 to 400");
  return Array.from({ length: n }, (_, i) => addDays(today, -(n - 1) + i));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Retry transient Google/network errors (rate limits answer 403/429) with a growing pause.
async function runCalma(cmdArgs) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await runCalmaOnce(cmdArgs);
    } catch (e) {
      const transient = /google_error|timeout|network|calma failed/i.test(e.message) && !/reauth_needed|bad_args/i.test(e.message);
      if (!transient || attempt >= 5) throw e;
      await sleep(2000 * 2 ** attempt);
    }
  }
}

function runCalmaOnce(cmdArgs) {
  const full = [CALMA, ...cmdArgs, ...(account ? ["--account", account] : [])];
  return new Promise((res, rej) => {
    execFile("node", full, { maxBuffer: 128 * 1024 * 1024, timeout: 180_000 }, (err, stdout) => {
      let json;
      try {
        json = JSON.parse(stdout);
      } catch {
        return rej(new Error(err ? `calma failed: ${err.code ?? err.message}` : "calma returned non-JSON"));
      }
      if (json.error) return rej(new Error(`calma ${json.error}: ${json.message ?? ""}`.trim()));
      res(json);
    });
  });
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i], i);
      }
    }),
  );
  return out;
}

// List every message whose time falls in [startSec, endSec). calma lists at most 20 per search, so split while "more".
async function listWindow(startSec, endSec, found, warnings) {
  const r = await runCalma(["mail-recent", `after:${startSec} before:${endSec}`]);
  for (const m of r.messages) found.set(m.id, m);
  if (r.more) {
    if (endSec - startSec <= 60) {
      warnings.push(`more than 20 messages in one minute starting ${new Date(startSec * 1000).toISOString()}; some may be missing`);
      return;
    }
    const mid = Math.floor((startSec + endSec) / 2);
    await listWindow(startSec, mid, found, warnings);
    await listWindow(mid, endSec, found, warnings);
  }
}

// Split "A <a@x>, B <b@y>" on commas outside quotes, and format each as: Name `<addr>`.
function splitAddresses(v) {
  if (!v) return [];
  const parts = [];
  let cur = "";
  let quoted = false;
  for (const ch of v) {
    if (ch === '"') quoted = !quoted;
    if (ch === "," && !quoted) {
      parts.push(cur);
      cur = "";
    } else cur += ch;
  }
  parts.push(cur);
  return parts.map((p) => p.trim()).filter(Boolean);
}
function fmtAddress(p) {
  const m = p.match(/^(.*?)\s*<([^>]+)>$/);
  if (m) {
    const name = m[1].replace(/^"|"$/g, "").trim();
    return name ? `${name} \`<${m[2]}>\`` : `\`<${m[2]}>\``;
  }
  return `\`${p}\``;
}
const fmtList = (v) => splitAddresses(v).map(fmtAddress).join(", ");

function timeOf(dateHeader, fallback) {
  const ms = Date.parse(dateHeader ?? "");
  if (Number.isNaN(ms)) return fallback ?? "??:??";
  return new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: true }).format(ms);
}
const sortKey = (m) => {
  const ms = Date.parse(m.date ?? "");
  return Number.isNaN(ms) ? 0 : ms;
};

function cleanBody(b) {
  return (b ?? "").replace(/\r\n?/g, "\n").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

function render(day, label, items) {
  const attachCount = items.filter((m) => m.attachments.length).length;
  const long = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(
    Date.parse(`${day}T12:00:00+08:00`),
  );
  const lines = [
    "---",
    `date: ${day}`,
    "type: daily-email-digest",
    `mailbox: ${label}`,
    `total_emails: ${items.length}`,
    `with_attachments: ${attachCount}`,
    "tags:",
    "  - daily-log",
    "  - inbox",
    "---",
    "",
    `# Emails for ${long}`,
    "",
    "---",
    "",
  ];
  for (const m of items) {
    const subject = (m.subject || "(no subject)").replace(/\s+/g, " ");
    lines.push(`## [${timeOf(m.date)}] ${subject}`);
    lines.push(`* **From:** ${fmtList(m.from) || "(unknown)"}`);
    lines.push(`* **To:** ${fmtList(m.to) || "(none)"}`);
    if (m.cc) lines.push(`* **Cc:** ${fmtList(m.cc)}`);
    lines.push(`* **Subject:** ${subject}`);
    lines.push(`* **Date:** ${m.date ?? "unknown"}`);
    lines.push(`* **Thread:** \`${m.threadId}\``);
    if (m.labels.length) lines.push(`* **Labels:** ${m.labels.join(", ")}`);
    if (m.attachments.length) {
      lines.push(`* **Attachments (not copied, check in Gmail):** ${m.attachments.map((a) => `${a.filename} (${a.mimeType}, ${a.size} bytes)`).join("; ")}`);
    }
    lines.push("");
    let body = cleanBody(m.body);
    if (!body) body = m.bodyMissing ? `(body could not be read; snippet: ${m.snippet ?? ""})` : "(no text body)";
    lines.push(body);
    if (m.truncated) lines.push("", `[body truncated at ${BODY_CAP} characters]`);
    lines.push("", "---", "");
  }
  return lines.join("\n");
}

async function writeIfChanged(path, text) {
  let old = null;
  try {
    old = await readFile(path, "utf8");
  } catch {}
  if (old === text) return false;
  const tmp = `${path}.tmp`;
  await writeFile(tmp, text, "utf8");
  await rename(tmp, path);
  return true;
}

async function main() {
  const days = dayList();
  await mkdir(outDir, { recursive: true });
  const summary = { ok: true, mailbox: label, days: days.length, written: [], unchanged: 0, emails: 0, attachments: [], warnings: [] };

  summary.failedDays = [];
  for (const day of days) {
    try {
      await copyDay(day, summary);
    } catch (e) {
      summary.failedDays.push(day);
      summary.warnings.push(`${day} failed: ${e.message}`);
    }
  }
  if (summary.failedDays.length) summary.ok = false;
  console.log(JSON.stringify(summary));
  if (!summary.ok) process.exit(1);
}

async function copyDay(day, summary) {
  {
    const found = new Map();
    const start = dayStartSec(day);
    await listWindow(start, start + 86400, found, summary.warnings);
    const listed = [...found.values()];
    const file = join(outDir, `${day}-mail.md`);

    // Fetch each thread once, keep only the messages that were listed for this day.
    const threadIds = [...new Set(listed.map((m) => m.threadId))];
    const threads = new Map();
    await mapLimit(threadIds, 3, async (id) => {
      try {
        const t = await runCalma(["mail-thread", id]);
        for (const m of t.messages) threads.set(m.id, m);
      } catch (e) {
        summary.warnings.push(`thread ${id} could not be read: ${e.message}`);
      }
    });

    const items = listed
      .map((l) => {
        const full = threads.get(l.id);
        return {
          ...l,
          cc: full?.cc ?? null,
          date: full?.date ?? l.date,
          body: full?.body ?? "",
          bodyMissing: !full,
          truncated: (full?.body ?? "").length >= BODY_CAP,
          attachments: full?.attachments ?? [],
        };
      })
      .sort((a, b) => sortKey(a) - sortKey(b));

    if (!items.length) {
      // No mail that day: write nothing.
      return;
    }
    summary.emails += items.length;
    for (const m of items) {
      if (m.attachments.length) summary.attachments.push({ day, time: timeOf(m.date), subject: m.subject, files: m.attachments.map((a) => a.filename) });
    }
    const changed = await writeIfChanged(file, render(day, label, items));
    if (changed) summary.written.push(`${day}-mail.md`);
    else summary.unchanged += 1;
  }
}

main().catch((e) => fail("run_failed", e.message));
