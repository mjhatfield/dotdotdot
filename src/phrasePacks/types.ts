export interface LoadedPhrasePack {
  name: string;
  sourceFile: string;
  phraseCount: number;
  phrases: string[];
  error?: string;
}

export interface PhrasePackLoadResult {
  packs: LoadedPhrasePack[];
  activePhrases: string[];
  warnings: string[];
}
