import test from "node:test";
import assert from "node:assert/strict";
import { ensureSuffix } from "../src/messaging/phraseFormatter";

test("ensureSuffix appends the suffix when missing", () => {
  assert.equal(ensureSuffix("Reticulating splines", "●●●"), "Reticulating splines ●●●");
});

test("ensureSuffix does not duplicate an existing suffix", () => {
  assert.equal(ensureSuffix("Reticulating splines ●●●", "●●●"), "Reticulating splines ●●●");
});

test("ensureSuffix trims input and ignores empty phrases", () => {
  assert.equal(ensureSuffix("  Installing a morale problem   ", "●●●"), "Installing a morale problem ●●●");
  assert.equal(ensureSuffix("   ", "●●●"), "");
});
