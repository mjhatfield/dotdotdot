import test from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { BUILTIN_PHRASE_PACKS } from "../src/phrasePacks/registry";

function slugFromSourceFile(sourceFile: string): string {
  return path.basename(sourceFile, ".txt");
}

test("builtin phrase packs use file-name slugs in setting keys", () => {
  for (const pack of BUILTIN_PHRASE_PACKS) {
    assert.equal(pack.settingKey, `dotdotdot.phrasePack.${slugFromSourceFile(pack.sourceFile)}`);
  }
});

test("builtin phrase packs point at existing files and include descriptions", async () => {
  for (const pack of BUILTIN_PHRASE_PACKS) {
    const filePath = path.resolve(process.cwd(), pack.sourceFile);
    await fs.access(filePath);
    assert.ok(pack.description.length > 0);
  }
});
