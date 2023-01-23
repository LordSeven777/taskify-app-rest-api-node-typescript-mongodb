export function lowerFirstLetter(word: string): string {
  return word.charAt(0).toLowerCase().concat(word.substring(1));
}

export function firstLetterIsUpperCase(word: string): boolean {
  const firstLetter = word.charAt(0);
  return firstLetter === firstLetter.toUpperCase();
}
