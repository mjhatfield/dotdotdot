# Contributing Phrase Packs

This guide explains how to add new phrase packs for dotdotdot.

## Goal
A phrase pack is a plain text file that contains one phrase per line. The extension reads the file, applies suffix formatting, and includes those phrases when the pack is enabled.

## Steps

1. Create a new text file in the phrase-packs folder (or another path in the workspace).
2. Add one phrase per line.
3. Register the pack in the built-in registry.
4. Add a checkbox setting whose key slug matches the file name.

## Example File

File path example:

phrase-packs/my-pack.txt

Setting key pattern:

dotdotdot.phrasePack.my-pack

Example content:

Warming up context
Sorting through candidate fixes
Aligning output with your intent

## Register the Pack

Add an entry in [src/phrasePacks/registry.ts](src/phrasePacks/registry.ts):

```ts
{
	name: "My Pack",
	sourceFile: "phrase-packs/my-pack.txt",
	settingKey: "dotdotdot.phrasePack.my-pack",
	defaultEnabled: false,
	description: "Short user-facing description shown in Settings."
}
```

Then add a matching boolean setting key (for example `dotdotdot.phrasePack.my-pack`) in [package.json](package.json) with a description that includes both the pack title and the supporting line of text.

The convention is:

- file: `phrase-packs/dwarf-fortress.txt`
- setting key: `dotdotdot.phrasePack.dwarf-fortress`

Use the file name without `.txt` as the setting key suffix.

## Tips

- Keep phrases short and readable.
- Use one phrase per line.
- Empty lines are ignored.
- Lines that start with # are treated as comments and ignored.
- Duplicate phrases across packs are de-duplicated in the final applied list.
