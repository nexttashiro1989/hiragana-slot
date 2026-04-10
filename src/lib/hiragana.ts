export const SEION = ['あ','い','う','え','お','か','き','く','け','こ','さ','し','す','せ','そ','た','ち','つ','て','と','な','に','ぬ','ね','の','は','ひ','ふ','へ','ほ','ま','み','む','め','も','や','ゆ','よ','ら','り','る','れ','ろ','わ','を','ん'];
export const DAKUON = ['が','ぎ','ぐ','げ','ご','ざ','じ','ず','ぜ','ぞ','だ','ぢ','づ','で','ど','ば','び','ぶ','べ','ぼ'];
export const HANDAKUON = ['ぱ','ぴ','ぷ','ぺ','ぽ'];
export const CHOON = ['〜']; // ー is displayed as 〜
export const SOKUON_YOON = ['ゃ','ゅ','ょ','っ'];

export const ALL_CHARS = [
  ...SEION,
  ...DAKUON,
  ...HANDAKUON,
  ...CHOON,
  ...SOKUON_YOON
];

export const INVALID_FIRST_CHARS = ['ん', 'っ', '〜', 'ゃ', 'ゅ', 'ょ'];

// Helper to check if a character is SOKUON, YOON or CHOON
export const isContinuousRestricted = (char: string) => {
  return SOKUON_YOON.includes(char) || CHOON.includes(char);
};

// Generates a random character from ALL_CHARS
export const getRandomChar = (): string => {
  const index = Math.floor(Math.random() * ALL_CHARS.length);
  return ALL_CHARS[index];
};

// Validates the current generated character sequence
export const isValidSequence = (currentChars: string[]): boolean => {
  if (currentChars.length === 0) return true;

  // Rule 1: First char shouldn't be restricted
  if (INVALID_FIRST_CHARS.includes(currentChars[0])) {
    return false;
  }

  // Rule 2: No continuous Sokuon, Yoon, or Choon
  for (let i = 1; i < currentChars.length; i++) {
    if (isContinuousRestricted(currentChars[i]) && isContinuousRestricted(currentChars[i - 1])) {
      return false;
    }
  }

  return true;
};

// Generate an array of random characters of a given length ensuring the whole array is valid
export const generateRandomString = (length: number, lockedChars?: (string | null)[]): string[] => {
  let valid = false;
  let result: string[] = [];
  
  while (!valid) {
    result = [];
    for (let i = 0; i < length; i++) {
      if (lockedChars && lockedChars[i]) {
        result.push(lockedChars[i] as string);
      } else {
        result.push(getRandomChar());
      }
    }
    valid = isValidSequence(result);
  }
  
  return result;
};

// Generate an array of N random characters specifically for slot spinning animation (so they look random while spinning)
export const generateSpinningSequence = (length: number): string[] => {
  // doesn't need to be strictly valid, just needs to look random for the spinning effect
  const result: string[] = [];
  for (let i = 0; i < length; i++) {
    result.push(getRandomChar());
  }
  return result;
};
