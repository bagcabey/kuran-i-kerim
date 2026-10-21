import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Tilavet Akademi Kapsamlı Veri Havuzu ve Bütünlük Testi', () => {
  const dataFilePath = path.resolve(__dirname, '../../kimatik_lab/tilavet_akademi_data.js');
  const code = fs.readFileSync(dataFilePath, 'utf8');
  const fakeWindow: any = {};
  
  // Scripti güvenle çalıştırıp fakeWindow'a bağla
  const runScript = new Function('window', code);
  runScript(fakeWindow);
  const data = fakeWindow.TilavetAkademiDefaultData;

  it('TilavetAkademiDefaultData nesnesi eksiksiz yüklenir', () => {
    expect(data).toBeDefined();
    expect(typeof data).toBe('object');
  });

  it('28 Arap harfi ve 4 yazılış formu eksiksizdir', () => {
    expect(data.arabicLetters).toBeDefined();
    expect(data.arabicLetters.length).toBe(28);

    for (const letter of data.arabicLetters) {
      expect(letter.char).toBeTruthy();
      expect(letter.name).toBeTruthy();
      expect(letter.sound).toBeTruthy();
      expect(letter.mahrec).toBeTruthy();
      expect(['cevf', 'halk', 'lisan', 'sefeteyn', 'haysum']).toContain(letter.zone);
      expect(Array.isArray(letter.forms)).toBe(true);
      expect(letter.forms.length).toBe(4);
    }
  });

  it('Bitişmeyen 6 harf (ا د ذ ر ز و) doğru etiketlenmiştir', () => {
    const nonConnectors = ['ا', 'د', 'ذ', 'ر', 'ز', 'و'];
    for (const char of nonConnectors) {
      const found = data.arabicLetters.find((l: any) => l.char === char);
      expect(found, `${char} harfi bulunamadı`).toBeDefined();
      expect(found.nonConnector, `${char} nonConnector olmalı`).toBe(true);
    }
  });

  it('Harekeler (Üstün, Esre, Ötre) 28 harfin tamamını kapsar', () => {
    expect(data.harekeler).toBeDefined();
    expect(data.harekeler.ustun.length).toBe(28);
    expect(data.harekeler.esre.length).toBe(28);
    expect(data.harekeler.otre.length).toBe(28);

    for (const h of data.harekeler.ustun) {
      expect(h.char || h.glyph).toBeTruthy();
      expect(h.sound).toBeTruthy();
      expect(h.name).toBeTruthy();
    }
  });

  it('Cezm ve Şedde veri setleri geçerlidir', () => {
    expect(data.cezmSedde).toBeDefined();
    expect(data.cezmSedde.cezm.length).toBeGreaterThanOrEqual(12);
    expect(data.cezmSedde.sedde.length).toBeGreaterThanOrEqual(8);

    for (const c of data.cezmSedde.cezm) {
      expect(c.glyph || c.char).toBeTruthy();
      expect(c.sound).toBeTruthy();
    }
    for (const s of data.cezmSedde.sedde) {
      expect(s.glyph || s.char).toBeTruthy();
      expect(s.sound).toBeTruthy();
    }
  });

  it('Tenvin ve Med örnekleri Kur\'an kökenlidir ve zengindir', () => {
    expect(data.tenvin.length).toBeGreaterThanOrEqual(12);
    expect(data.med.length).toBeGreaterThanOrEqual(10);

    const nuhiha = data.med.find((m: any) => m.glyph === 'نُوحِيهَا' || m.char === 'نُوحِيهَا');
    expect(nuhiha).toBeDefined();
  });

  it('Heceleme laboratuvarı zengin kelime ve hece balonları içerir', () => {
    expect(data.heceleme.length).toBeGreaterThanOrEqual(10);
    for (const w of data.heceleme) {
      expect(w.word).toBeTruthy();
      expect(w.syllables.length).toBeGreaterThanOrEqual(2);
      expect(w.latin).toBeTruthy();
      expect(w.tr).toBeTruthy();
    }
  });

  it('19 klasik tecvid kuralı Mushaf referanslarıyla eksiksizdir', () => {
    expect(data.tecvidRules.length).toBe(19);
    for (const r of data.tecvidRules) {
      expect(r.id).toBeTruthy();
      expect(r.name).toBeTruthy();
      expect(r.ar).toBeTruthy();
      expect(r.surah).toBeGreaterThan(0);
      expect(r.ayah).toBeGreaterThan(0);
      expect(r.samplePhrase).toBeTruthy();
      expect(r.ayahRef).toBeTruthy();
      expect(['nun', 'mim', 'madd', 'letter']).toContain(r.cat);
    }
  });

  it('10 Makam ve Kâri arşivi geçerlidir', () => {
    expect(data.makamlar.length).toBe(10);
    expect(data.reciters.length).toBeGreaterThanOrEqual(6);

    for (const m of data.makamlar) {
      expect(m.id).toBeTruthy();
      expect(m.names.tr).toBeTruthy();
      expect(typeof m.durak).toBe('number');
      expect(Array.isArray(m.dizi.cikici)).toBe(true);
      expect(m.dizi.cikici.length).toBeGreaterThanOrEqual(8);
    }
  });

  it('Secavend durak işaretleri (8 adet) ve hükümleri eksiksizdir', () => {
    expect(data.secavend).toBeDefined();
    expect(data.secavend.length).toBe(8);
    const symbols = ['م', 'ط', 'ج', 'ز', 'ص', 'قف', 'لا', '∴ ∴'];
    for (const s of symbols) {
      const item = data.secavend.find((x: any) => x.symbol === s);
      expect(item, `Secavend ${s} bulunamadı`).toBeDefined();
      expect(item.name).toBeTruthy();
      expect(item.hukum).toBeTruthy();
      expect(item.sampleAr).toBeTruthy();
      expect(item.explanation).toBeTruthy();
    }
  });

  it('İbtidâ, Vasl ve Dört Sekte/Özel tilavet kelimeleri eksiksizdir', () => {
    expect(data.ibtidaVasl.length).toBe(3);
    expect(data.ozelKelimeler.length).toBe(4);

    const sekte = data.ozelKelimeler.find((k: any) => k.type === 'Sekte');
    expect(sekte).toBeDefined();
    expect(sekte.places.length).toBe(4);

    const imale = data.ozelKelimeler.find((k: any) => k.type === 'İmâle');
    expect(imale).toBeDefined();
    expect(imale.places[0].surah).toBe(11);
    expect(imale.places[0].ayah).toBe(41);
  });

  it('Şan & vokal ısınma egzersizleri ve 3 tilavet mektebi tanımlıdır', () => {
    expect(data.vocalWarmups.length).toBeGreaterThanOrEqual(4);
    expect(data.reciterSchools.length).toBe(3);

    const misir = data.reciterSchools.find((s: any) => s.schoolId === 'misir');
    expect(misir).toBeDefined();
    expect(misir.representatives.length).toBeGreaterThan(0);
  });

  it('10 makamda 50 kaynaklı örnek ve 10 uzman teyidi bekleyen aday kayıt bulunur', () => {
    expect(data.makamlar).toBeDefined();
    expect(data.makamlar.length).toBe(10);

    const expectedMakams = ['rast', 'ussak', 'hicaz', 'nihavend', 'saba', 'segah', 'kurdi', 'acem', 'neva', 'huzzam'];
    for (const mId of expectedMakams) {
      const makam = data.makamlar.find((m: any) => m.id === mId);
      expect(makam, `${mId} makamı bulunamadı`).toBeDefined();
      expect(makam.names.tr).toBeTruthy();
      expect(makam.names.ar).toBeTruthy();
      expect(makam.dizi.cikici.length).toBeGreaterThanOrEqual(8);
      expect(makam.ayahExamples.length).toBe(5);
      expect(new Set(makam.ayahExamples.map((example: any) => example.reciterId)).size).toBeGreaterThanOrEqual(2);
      expect(makam.ayahExamples.every((example: any) => example.verificationStatus === 'pending-expert-review' ||
        example.verificationStatus === 'candidate-pending-expert-review')).toBe(true);
      expect(makam.ayahExamples.filter((example: any) => example.verificationStatus === 'candidate-pending-expert-review'))
        .toHaveLength(1);
      expect(makam.ayahExamples.find((example: any) => example.verificationStatus === 'candidate-pending-expert-review')?.makamAnalysis)
        .toContain('uzman dinlemesiyle ayrıca doğrulanmalıdır');

      for (const ex of makam.ayahExamples) {
        expect(ex.id).toBeTruthy();
        expect(ex.surah).toBeGreaterThan(0);
        expect(ex.ayah).toBeGreaterThan(0);
        expect(ex.endAyah).toBeGreaterThanOrEqual(ex.ayah);
        expect(ex.ayahTextAr.length).toBeGreaterThan(10);
        expect(ex.ayahTextTr.length).toBeGreaterThan(10);
        expect(ex.reciter).toBeTruthy();
        expect(ex.reciterId).toBeTruthy();
        expect(ex.makamAnalysis).toBeTruthy();
      }
    }
  });
});
