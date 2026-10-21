/**
 * Türkçe ve Osmanlıca transkripsiyonlu metinler için kapsamlı normalizasyon.
 * Şapkalı harfleri (â, î, û), Türkçe karakterleri (ı, ğ, ü, ş, ö, ç) ve
 * noktalı/noktasız İ/ı harflerini aramaya uygun temiz ASCII küçük harfe çevirir.
 */
export function trNormalize(s: string): string {
  if (!s) return '';
  return s
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // şapka ve aksanları kaldır (â->a, î->i, û->u)
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
