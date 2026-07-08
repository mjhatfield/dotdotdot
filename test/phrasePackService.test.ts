import test from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { PhrasePackService, parsePhrasePackContent } from "../src/phrasePacks/phrasePackService";

test("parsePhrasePackContent ignores blank lines and comments", () => {
  const content = [
    "# comment",
    "",
    "Reticulating splines",
    "  Installing a data center  ",
  ].join("\n");

  assert.deepEqual(parsePhrasePackContent(content), ["Reticulating splines", "Installing a data center"]);
});

test("PhrasePackService applies suffixes and de-duplicates across enabled packs", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "dotdotdot-"));
  const firstPath = path.join(tempDir, "first.txt");
  const secondPath = path.join(tempDir, "second.txt");

  await fs.writeFile(firstPath, "First phrase\nShared phrase\n", "utf8");
  await fs.writeFile(secondPath, "Shared phrase\nSecond phrase\n", "utf8");

  const service = new PhrasePackService();
  const result = await service.load({
    enabled: true,
    phrasePacks: [
      { name: "One", sourceFile: firstPath },
      { name: "Two", sourceFile: secondPath },
    ],
    enabledPhrasePackNames: ["One", "Two"],
  });

  assert.deepEqual(result.activePhrases, [
    "First phrase ●●●",
    "Shared phrase ●●●",
    "Second phrase ●●●",
  ]);
});

test("PhrasePackService reports missing files without crashing", async () => {
  const service = new PhrasePackService();
  const result = await service.load({
    enabled: true,
    phrasePacks: [{ name: "Missing", sourceFile: "/definitely/missing.txt" }],
    enabledPhrasePackNames: ["Missing"],
  });

  assert.equal(result.activePhrases.length, 0);
  assert.equal(result.packs[0]?.phraseCount, 0);
  assert.match(result.packs[0]?.error ?? "", /Unable to read source file/);
});
