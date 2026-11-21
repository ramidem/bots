#!/usr/bin/env node
// Copies templates/*.md into each bot's own templates folder.
// Usage: node scripts/sync-templates.mjs <agents-dir> <map-file>
//   agents-dir: folder holding one workspace folder per bot (named by bot id).
//   map-file:   JSON { "<bot-slug>": "<bot-id>" }. Keep it out of git (name it *.local).
// A template's first line is `bots: all` or `bots: slug,slug`; a `---` line ends the header.
// Output: one line per copy ("new", "updated", "same"). Exit 0 ok, 2 usage or IO error.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "templates");

export function parseTemplate(text) {
  const [head, ...rest] = text.split("\n---\n");
  const match = /^bots:\s*(.+)$/m.exec(head);
  if (!match || rest.length === 0) throw new Error("missing `bots:` header or `---` line");
  const bots = match[1].trim() === "all" ? "all" : match[1].split(",").map((s) => s.trim());
  return { bots, body: rest.join("\n---\n") };
}

export function sync(agentsDir, map, sourceDir = SOURCE) {
  const results = [];
  for (const file of fs.readdirSync(sourceDir).filter((f) => f.endsWith(".md")).sort()) {
    const { bots, body } = parseTemplate(fs.readFileSync(path.join(sourceDir, file), "utf8"));
    const copy = `<!-- Source: bots/templates/${file}. Do not edit; send wording changes to Dr Egghead. -->\n${body}`;
    for (const [slug, id] of Object.entries(map)) {
      if (bots !== "all" && !bots.includes(slug)) continue;
      const dir = path.join(agentsDir, id, "templates");
      const target = path.join(dir, file);
      const before = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : null;
      fs.mkdirSync(dir, { recursive: true });
      if (before !== copy) fs.writeFileSync(target, copy);
      results.push(`${slug} ${file} ${before === null ? "new" : before === copy ? "same" : "updated"}`);
    }
  }
  return results;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [agentsDir, mapFile] = process.argv.slice(2);
  try {
    if (!agentsDir || !mapFile) throw new Error("usage: sync-templates <agents-dir> <map-file>");
    console.log(sync(agentsDir, JSON.parse(fs.readFileSync(mapFile, "utf8"))).join("\n"));
  } catch (err) {
    console.error(err.message);
    process.exit(2);
  }
}
