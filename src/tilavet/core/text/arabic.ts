/** Harekeleri, tatweel'i ve Kur'an işaretlerini kaldırır; elif/ya varyantlarını eşitler. */
export function normalizeArabic(s: string): string {
  return s
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u08D3-\u08FF]/g, '') // tashkeel + Kur'an işaretleri
    .replace(/\u0640/g, '')                                                       // tatweel
    .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627')                              // آ أ إ ٱ → ا
    .replace(/\u0649/g, '\u064A')                                                  // ى → ي
    .replace(/\u06CC/g, '\u064A')                                                  // ی → ي
    .replace(/\u06A9/g, '\u0643')                                                  // ک → ك
    .replace(/\s+/g, ' ')
    .trim();
}

export const wordsOf = (s: string) => normalizeArabic(s).split(' ').filter(Boolean);
