export interface PhrasePackConfig {
  name: string;
  sourceFile: string;
}

export interface BuiltinPhrasePack extends PhrasePackConfig {
  settingKey: string;
  defaultEnabled: boolean;
  description: string;
}

export const DOTDOTDOT_SUFFIX = "●●●";

export const BUILTIN_PHRASE_PACKS: BuiltinPhrasePack[] = [
  {
    name: "Motherlode Pack (The Sims)",
    sourceFile: "phrase-packs/the-sims.txt",
    settingKey: "dotdotdot.phrasePack.the-sims",
    defaultEnabled: true,
    description: "Loading messages from various The Sims games. Worth at least 50,000 Simoleons.",
  },
  {
    name: "Hidden Fun Stuff (HFS) Pack (Dwarf Fortress)",
    sourceFile: "phrase-packs/dwarf-fortress.txt",
    settingKey: "dotdotdot.phrasePack.dwarf-fortress",
    defaultEnabled: false,
    description: "Phrases inspired by Dwarf Fortress patch notes and inside jokes.",
  },
];