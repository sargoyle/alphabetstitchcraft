export const uppercaseCharacters = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
export const lowercaseCharacters = Array.from("abcdefghijklmnopqrstuvwxyz");
export const numberCharacters = Array.from("0123456789");
export const punctuationCharacters = [
  ".",
  ",",
  "!",
  "?",
  "'",
  "-",
  "&",
  "\"",
  "#",
  "$",
  "%",
  "(",
  ")",
  "*",
  "+",
  "/",
  ":",
  ";",
  "<",
  "=",
  ">",
  "@",
  "[",
  "\\",
  "]",
  "^",
  "_",
  "\`",
  "{",
  "|",
  "}",
  "~"
];

export const defaultEditableCharacterKeys = [
  ...uppercaseCharacters,
  ...lowercaseCharacters,
  ...numberCharacters,
  ...punctuationCharacters
];
