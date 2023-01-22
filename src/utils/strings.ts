export function lowerFirstLetter(word: string): string {
  return word.charAt(0).toLowerCase().concat(word.substring(1));
}
