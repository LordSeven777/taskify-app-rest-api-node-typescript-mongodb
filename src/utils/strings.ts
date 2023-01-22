export function lowerFirstLetter(word: string): string {
  return word.charAt(0).toLowerCase().concat(word.substring(1));
}

export function firstLetterIsUpperCase(word: string): boolean {
  const flCharCode = word.charCodeAt(0);
  return flCharCode >= 97 && flCharCode <= 122;
}
