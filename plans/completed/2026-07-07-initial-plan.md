# dotdotdot Initial Implementation Plan (Completed)

Date: 2026-07-07
Status: Completed

## Goal
Deliver a VS Code extension that manages Copilot thinking phrases through built-in settings, using selectable phrase packs and applying them to `chat.agent.thinking.phrases` in `replace` mode with a fixed `●●●` suffix.

## What Was Implemented

1. Settings-first UX (no custom webview)
- Added user-facing enable setting:
  - `dotdotdot.enabled`
- Added per-pack checkbox settings keyed by file-name slug:
  - `dotdotdot.phrasePack.the-sims`
  - `dotdotdot.phrasePack.dwarf-fortress`

2. Phrase pack system
- Built-in registry in `src/phrasePacks/registry.ts` with:
  - name
  - source file
  - setting key
  - default enabled
  - description
- Pack files in `phrase-packs/`.
- Parsing rules in `src/phrasePacks/phrasePackService.ts`:
  - trim lines
  - ignore blanks
  - ignore `#` comments
  - suffix normalization
  - dedupe across enabled packs

3. Copilot setting apply/restore lifecycle
- Applies generated phrases to `chat.agent.thinking.phrases` in `replace` mode.
- Backs up previous value on first apply.
- Restores backup on disable.
- Tracks hash to detect external edits while managed.

4. Packaging and metadata
- MIT license added.
- Extension icon added (`assets/icon.png`).
- Repository metadata added for `vsce` link resolution.

5. Tests
- Added minimal unit test setup using Node test runner via `tsx`.
- Added focused tests for:
  - suffix behavior
  - phrase pack parsing/dedup/missing files
  - registry setting-key slug convention and pack file existence

## Final Architecture

- `src/extension.ts`: activation + command wiring + config-change reapply logic
- `src/config/settings.ts`: settings parsing and write helper
- `src/phrasePacks/registry.ts`: built-in pack definitions
- `src/phrasePacks/phrasePackService.ts`: file loading/parsing/aggregation
- `src/messaging/phraseFormatter.ts`: suffix normalization
- `src/copilot/thinkingPhrasesApplier.ts`: apply/restore to VS Code setting
- `src/copilot/stateStore.ts`: persisted backup/hash state

## Validation

- `npm run compile` passes.
- `npx @vscode/vsce package` passes.
- VSIX generation verified.

## Notes

- Pack setting key naming convention is enforced by tests:
  - `phrase-packs/<slug>.txt` -> `dotdotdot.phrasePack.<slug>`