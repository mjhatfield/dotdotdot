import * as fs from "fs/promises";
import * as path from "path";
import { DotSettings } from "../config/settings";
import { ensureSuffix } from "../messaging/phraseFormatter";
import { DOTDOTDOT_SUFFIX } from "./registry";
import { LoadedPhrasePack, PhrasePackLoadResult } from "./types";

function getExtensionRoot(): string {
  return path.resolve(__dirname, "..", "..");
}

function resolveSourcePath(sourceFile: string): string {
  if (path.isAbsolute(sourceFile)) {
    return sourceFile;
  }

  return path.resolve(getExtensionRoot(), sourceFile);
}

export function parsePhrasePackContent(content: string): string[] {
  return content
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));
}

async function readLines(filePath: string): Promise<string[]> {
  const content = await fs.readFile(filePath, "utf8");
  return parsePhrasePackContent(content);
}

export class PhrasePackService {
  public async load(settings: DotSettings): Promise<PhrasePackLoadResult> {
    const warnings: string[] = [];
    const packs: LoadedPhrasePack[] = [];

    const seenNames = new Set<string>();

    for (const pack of settings.phrasePacks) {
      if (seenNames.has(pack.name)) {
        warnings.push(`Duplicate phrase pack name: ${pack.name}`);
      }
      seenNames.add(pack.name);

      const resolved = resolveSourcePath(pack.sourceFile);

      try {
        const rawPhrases = await readLines(resolved);
        const phrases = rawPhrases
          .map((phrase) => ensureSuffix(phrase, DOTDOTDOT_SUFFIX))
          .filter((phrase) => phrase.length > 0);

        if (phrases.length === 0) {
          packs.push({
            name: pack.name,
            sourceFile: pack.sourceFile,
            phraseCount: 0,
            phrases: [],
            error: "No phrases found in file.",
          });
          continue;
        }

        packs.push({
          name: pack.name,
          sourceFile: pack.sourceFile,
          phraseCount: phrases.length,
          phrases,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown read error";
        packs.push({
          name: pack.name,
          sourceFile: pack.sourceFile,
          phraseCount: 0,
          phrases: [],
          error: `Unable to read source file: ${message}`,
        });
      }
    }

    const enabledSet = new Set(settings.enabledPhrasePackNames);
    const deduped = new Set<string>();
    const activePhrases: string[] = [];

    for (const pack of packs) {
      if (!enabledSet.has(pack.name)) {
        continue;
      }

      for (const phrase of pack.phrases) {
        if (!deduped.has(phrase)) {
          deduped.add(phrase);
          activePhrases.push(phrase);
        }
      }
    }

    return { packs, activePhrases, warnings };
  }
}
