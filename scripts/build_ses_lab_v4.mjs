import fs from 'fs';
import path from 'path';

const SECTIONS_DIR = path.resolve('docs/ses_lab_v4_sections');
const OUTPUT_FILE = path.resolve('ses lab v4 - güncelleme ve iyileştirme.md');

console.log('Ses Lab v4 Master Belgesi Derleniyor...');
console.log('Kaynak Dizin:', SECTIONS_DIR);
console.log('Hedef Dosya:', OUTPUT_FILE);

const files = fs.readdirSync(SECTIONS_DIR).filter(f => f.endsWith('.md')).sort();
console.log(`Bulunan Bölüm Dosyaları (${files.length} adet):`, files);

let fullContent = '';
let totalPlaceholders = 0;

for (const file of files) {
  const filePath = path.join(SECTIONS_DIR, file);
  const text = fs.readFileSync(filePath, 'utf8');

  // Placeholder kontrolü: 'TODO', 'kalanı benzer', '...' tek başına satır veya kod içinde
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (l === '...' || l.startsWith('// ...') || l.includes('TODO') || l.includes('kalanı benzer')) {
      console.warn(`UYARI: ${file}:${i + 1} satırında yasaklı yer tutucu tespit edildi: "${l}"`);
      totalPlaceholders++;
    }
  }

  fullContent += text.trim() + '\n\n---\n\n';
}

fs.writeFileSync(OUTPUT_FILE, fullContent, 'utf8');

const outputStats = fs.statSync(OUTPUT_FILE);
const totalLines = fullContent.split('\n').length;

console.log('✅ Derleme Başarıyla Tamamlandı!');
console.log(`Toplam Boyut: ${(outputStats.size / 1024).toFixed(2)} KB`);
console.log(`Toplam Satır: ${totalLines}`);
console.log(`Yasaklı Yer Tutucu Sayısı: ${totalPlaceholders}`);
