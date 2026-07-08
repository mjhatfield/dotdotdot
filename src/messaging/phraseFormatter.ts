export function ensureSuffix(rawPhrase: string, suffix: string): string {
  const phrase = rawPhrase.trim();
  const normalizedSuffix = suffix.trim();

  if (!phrase) {
    return "";
  }

  if (!normalizedSuffix) {
    return phrase;
  }

  return phrase.endsWith(normalizedSuffix) ? phrase : `${phrase} ${normalizedSuffix}`;
}
