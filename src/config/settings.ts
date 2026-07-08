import * as vscode from "vscode";
import { BUILTIN_PHRASE_PACKS } from "../phrasePacks/registry";

export interface PhrasePackConfig {
  name: string;
  sourceFile: string;
}

export interface DotSettings {
  enabled: boolean;
  phrasePacks: PhrasePackConfig[];
  enabledPhrasePackNames: string[];
}

const SECTION = "dotdotdot";

export function getDotSettings(): DotSettings {
  const config = vscode.workspace.getConfiguration();

  const enabled = config.get<boolean>(`${SECTION}.enabled`, false);
  const enabledPhrasePackNames = BUILTIN_PHRASE_PACKS.filter((pack) => {
    return config.get<boolean>(pack.settingKey, pack.defaultEnabled);
  }).map((pack) => pack.name);

  return {
    enabled,
    phrasePacks: BUILTIN_PHRASE_PACKS.map((pack) => ({
      name: pack.name,
      sourceFile: pack.sourceFile,
    })),
    enabledPhrasePackNames,
  };
}

export async function updateDotSetting<T>(key: string, value: T): Promise<void> {
  await vscode.workspace.getConfiguration().update(`${SECTION}.${key}`, value, vscode.ConfigurationTarget.Global);
}
