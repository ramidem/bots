import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseTemplate, sync } from "../scripts/sync-templates.mjs";

function setup() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "sync-"));
  const src = path.join(root, "src");
  fs.mkdirSync(src);
  fs.writeFileSync(path.join(src, "a.md"), "bots: all\n---\n# A\n");
  fs.writeFileSync(path.join(src, "b.md"), "bots: one\n---\n# B\n");
  return { root, src, map: { one: "id-1", two: "id-2" } };
}

test("parseTemplate reads the header and body", () => {
  assert.deepEqual(parseTemplate("bots: x, y\n---\nhi\n"), { bots: ["x", "y"], body: "hi\n" });
  assert.throws(() => parseTemplate("no header"));
});

test("sync copies by header, reports new, same and updated", () => {
  const { root, src, map } = setup();
  assert.deepEqual(sync(root, map, src), ["one a.md new", "two a.md new", "one b.md new"]);
  assert.ok(!fs.existsSync(path.join(root, "id-2", "templates", "b.md")));
  assert.deepEqual(sync(root, map, src), ["one a.md same", "two a.md same", "one b.md same"]);
  fs.writeFileSync(path.join(root, "id-1", "templates", "a.md"), "edited");
  assert.equal(sync(root, map, src)[0], "one a.md updated");
  assert.match(fs.readFileSync(path.join(root, "id-1", "templates", "a.md"), "utf8"), /^<!-- Source/);
});
