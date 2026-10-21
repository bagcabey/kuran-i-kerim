import React, { useEffect, useMemo, useState, useRef } from 'react';
import { api } from '../core/api/client.js';

interface ReciterItem {
  id: string;
  reciterId: string;
  moshafId: number;
  name: string;
  moshafName: string;
  server: string;
  surahList: number[];
  avatarText: string;
}

const SURAH_DATA = [
  { no: 1, name: "Fâtiha", ar: "الفاتحة", ayahs: 7 },
  { no: 2, name: "Bakara", ar: "البقرة", ayahs: 286 },
  { no: 3, name: "Âl-i İmrân", ar: "آل عمران", ayahs: 200 },
  { no: 4, name: "Nisâ", ar: "النساء", ayahs: 176 },
  { no: 5, name: "Mâide", ar: "المائدة", ayahs: 120 },
  { no: 6, name: "En'âm", ar: "الأنعام", ayahs: 165 },
  { no: 7, name: "A'râf", ar: "الأعراف", ayahs: 206 },
  { no: 8, name: "Enfâl", ar: "الأنفال", ayahs: 75 },
  { no: 9, name: "Tevbe", ar: "التوبة", ayahs: 129 },
  { no: 10, name: "Yûnus", ar: "يونس", ayahs: 109 },
  { no: 11, name: "Hûd", ar: "هود", ayahs: 123 },
  { no: 12, name: "Yûsuf", ar: "يوسف", ayahs: 111 },
  { no: 13, name: "Ra'd", ar: "الرعد", ayahs: 43 },
  { no: 14, name: "İbrâhîm", ar: "إبراهيم", ayahs: 52 },
  { no: 15, name: "Hicr", ar: "الحجر", ayahs: 99 },
  { no: 16, name: "Nahl", ar: "النحل", ayahs: 128 },
  { no: 17, name: "İsrâ", ar: "الإسراء", ayahs: 111 },
  { no: 18, name: "Kehf", ar: "الكهف", ayahs: 110 },
  { no: 19, name: "Meryem", ar: "مريم", ayahs: 98 },
  { no: 20, name: "Tâhâ", ar: "طه", ayahs: 135 },
  { no: 21, name: "Enbiyâ", ar: "الأنبياء", ayahs: 112 },
  { no: 22, name: "Hac", ar: "الحج", ayahs: 78 },
  { no: 23, name: "Mü'minûn", ar: "المؤمنون", ayahs: 118 },
  { no: 24, name: "Nûr", ar: "النور", ayahs: 64 },
  { no: 25, name: "Furkân", ar: "الفرقان", ayahs: 77 },
  { no: 26, name: "Şuarâ", ar: "الشعراء", ayahs: 227 },
  { no: 27, name: "Neml", ar: "النمل", ayahs: 93 },
  { no: 28, name: "Kasas", ar: "القصص", ayahs: 88 },
  { no: 29, name: "Ankebût", ar: "العنكبوت", ayahs: 69 },
  { no: 30, name: "Rûm", ar: "الروم", ayahs: 60 },
  { no: 31, name: "Lokmân", ar: "لقمان", ayahs: 34 },
  { no: 32, name: "Secde", ar: "السجدة", ayahs: 30 },
  { no: 33, name: "Ahzâb", ar: "الأحزاب", ayahs: 73 },
  { no: 34, name: "Sebe'", ar: "سبإ", ayahs: 54 },
  { no: 35, name: "Fâtır", ar: "فاطر", ayahs: 45 },
  { no: 36, name: "Yâsîn", ar: "يس", ayahs: 83 },
  { no: 37, name: "Sâffât", ar: "الصافات", ayahs: 182 },
  { no: 38, name: "Sâd", ar: "ص", ayahs: 88 },
  { no: 39, name: "Zümer", ar: "الزمر", ayahs: 75 },
  { no: 40, name: "Mü'min (Gâfir)", ar: "غافر", ayahs: 85 },
  { no: 41, name: "Fussilet", ar: "فصلت", ayahs: 54 },
  { no: 42, name: "Şûrâ", ar: "الشورى", ayahs: 53 },
  { no: 43, name: "Zuhruf", ar: "الزخرف", ayahs: 89 },
  { no: 44, name: "Duhân", ar: "الدخان", ayahs: 59 },
  { no: 45, name: "Câsiye", ar: "الجاثية", ayahs: 37 },
  { no: 46, name: "Ahkâf", ar: "الأحقاف", ayahs: 35 },
  { no: 47, name: "Muhammed", ar: "محمد", ayahs: 38 },
  { no: 48, name: "Fetih", ar: "الفتح", ayahs: 29 },
  { no: 49, name: "Hucurât", ar: "الحجرات", ayahs: 18 },
  { no: 50, name: "Kâf", ar: "ق", ayahs: 45 },
  { no: 51, name: "Zâriyât", ar: "الذاريات", ayahs: 60 },
  { no: 52, name: "Tûr", ar: "الطور", ayahs: 49 },
  { no: 53, name: "Necm", ar: "النجم", ayahs: 62 },
  { no: 54, name: "Kamer", ar: "القمر", ayahs: 55 },
  { no: 55, name: "Rahmân", ar: "الرحمن", ayahs: 78 },
  { no: 56, name: "Vâkıa", ar: "الواقعة", ayahs: 96 },
  { no: 57, name: "Hadîd", ar: "الحديد", ayahs: 29 },
  { no: 58, name: "Mücâdele", ar: "المجادلة", ayahs: 22 },
  { no: 59, name: "Haşr", ar: "الحشر", ayahs: 24 },
  { no: 60, name: "Mümtehine", ar: "الممتحنة", ayahs: 13 },
  { no: 61, name: "Saff", ar: "الصف", ayahs: 14 },
  { no: 62, name: "Cuma", ar: "الجمعة", ayahs: 11 },
  { no: 63, name: "Münâfikûn", ar: "المنافقون", ayahs: 11 },
  { no: 64, name: "Teğâbün", ar: "التغابن", ayahs: 18 },
  { no: 65, name: "Talâk", ar: "الطلاق", ayahs: 12 },
  { no: 66, name: "Tahrîm", ar: "التحريم", ayahs: 12 },
  { no: 67, name: "Mülk", ar: "الملك", ayahs: 30 },
  { no: 68, name: "Kalem", ar: "القلم", ayahs: 52 },
  { no: 69, name: "Hâkka", ar: "الحاقة", ayahs: 52 },
  { no: 70, name: "Meâric", ar: "المعارج", ayahs: 44 },
  { no: 71, name: "Nûh", ar: "نوح", ayahs: 28 },
  { no: 72, name: "Cin", ar: "الجن", ayahs: 28 },
  { no: 73, name: "Müzzemmil", ar: "المزمل", ayahs: 20 },
  { no: 74, name: "Müddessir", ar: "المدثر", ayahs: 56 },
  { no: 75, name: "Kıyâme", ar: "القيامة", ayahs: 40 },
  { no: 76, name: "İnsân", ar: "الإنسان", ayahs: 31 },
  { no: 77, name: "Mürselât", ar: "المرسلات", ayahs: 50 },
  { no: 78, name: "Nebe", ar: "النبإ", ayahs: 40 },
  { no: 79, name: "Nâziât", ar: "النازعات", ayahs: 46 },
  { no: 80, name: "Abese", ar: "عبس", ayahs: 42 },
  { no: 81, name: "Tekvîr", ar: "التكوير", ayahs: 29 },
  { no: 82, name: "İnfitâr", ar: "الانفطار", ayahs: 19 },
  { no: 83, name: "Mutaffifîn", ar: "المطففين", ayahs: 36 },
  { no: 84, name: "İnşikâk", ar: "الانشقاق", ayahs: 25 },
  { no: 85, name: "Bürûc", ar: "البروج", ayahs: 22 },
  { no: 86, name: "Târık", ar: "الطارق", ayahs: 17 },
  { no: 87, name: "A'lâ", ar: "الأعلى", ayahs: 19 },
  { no: 88, name: "Gâşiye", ar: "الغاشية", ayahs: 26 },
  { no: 89, name: "Fecr", ar: "الفجر", ayahs: 30 },
  { no: 90, name: "Beled", ar: "البلد", ayahs: 20 },
  { no: 91, name: "Şems", ar: "الشمس", ayahs: 15 },
  { no: 92, name: "Leyl", ar: "الليل", ayahs: 21 },
  { no: 93, name: "Duhâ", ar: "الضحى", ayahs: 11 },
  { no: 94, name: "İnşirâh", ar: "الشرح", ayahs: 8 },
  { no: 95, name: "Tîn", ar: "التين", ayahs: 8 },
  { no: 96, name: "Alak", ar: "العلق", ayahs: 19 },
  { no: 97, name: "Kadir", ar: "القدر", ayahs: 5 },
  { no: 98, name: "Beyyine", ar: "البينة", ayahs: 8 },
  { no: 99, name: "Zilzâl", ar: "الزلزلة", ayahs: 8 },
  { no: 100, name: "Âdiyât", ar: "العاديات", ayahs: 11 },
  { no: 101, name: "Kâria", ar: "القارعة", ayahs: 11 },
  { no: 102, name: "Tekâsür", ar: "التكاثر", ayahs: 8 },
  { no: 103, name: "Asr", ar: "العصر", ayahs: 3 },
  { no: 104, name: "Hümeze", ar: "الهمزة", ayahs: 9 },
  { no: 105, name: "Fîl", ar: "الفيل", ayahs: 5 },
  { no: 106, name: "Kureyş", ar: "قريش", ayahs: 4 },
  { no: 107, name: "Mâûn", ar: "الماعون", ayahs: 7 },
  { no: 108, name: "Kevser", ar: "الكوثر", ayahs: 3 },
  { no: 109, name: "Kâfirûn", ar: "الكافرون", ayahs: 6 },
  { no: 110, name: "Nasr", ar: "النصر", ayahs: 3 },
  { no: 111, name: "Tebbet", ar: "المسد", ayahs: 5 },
  { no: 112, name: "İhlâs", ar: "الإخلاص", ayahs: 4 },
  { no: 113, name: "Felak", ar: "الفلق", ayahs: 5 },
  { no: 114, name: "Nâs", ar: "الناس", ayahs: 6 }
];

export default function ListeningPage() {
  const [reciters, setReciters] = useState<ReciterItem[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [q, setQ] = useState('');
  const [surah, setSurah] = useState(1);
  const [activeReciterId, setActiveReciterId] = useState('');
  const [url, setUrl] = useState('');
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [err, setErr] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    let active = true;
    api.reciters('tr').then(({ reciters: catalog }) => {
      const entries = catalog.flatMap(reciter => {
        if (!reciter || typeof reciter.id !== 'string' || !Array.isArray(reciter.moshafs)) return [];
        const name = reciter.name?.tr || reciter.name?.ar || reciter.name?.en || reciter.id;
        return reciter.moshafs.flatMap(moshaf => {
          if (
            !Number.isInteger(moshaf.id) ||
            typeof moshaf.name !== 'string' ||
            typeof moshaf.server !== 'string' ||
            !Array.isArray(moshaf.surahList)
          ) {
            return [];
          }

          const surahList = moshaf.surahList.filter(value =>
            Number.isInteger(value) && value >= 1 && value <= 114
          );
          return [{
            id: `${reciter.id}:${moshaf.id}`,
            reciterId: reciter.id,
            moshafId: moshaf.id,
            name,
            moshafName: moshaf.name,
            server: moshaf.server,
            surahList,
            avatarText: name.split(/\s+/).map(part => part[0]).slice(0, 3).join('').toLocaleUpperCase('tr')
          }];
        });
      });

      if (!active) return;
      setReciters(entries);
      if (entries.length > 0) setActiveReciterId(entries[0].id);
      else setErr('Kaynak katalogda kullanılabilir kâri kaydı bulunmuyor.');
    }).catch(error => {
      console.error('Kâri kataloğu yüklenemedi:', error);
      if (active) setErr('Kâri kataloğu şu anda yüklenemiyor. Lütfen daha sonra yeniden deneyin.');
    }).finally(() => {
      if (active) setCatalogLoading(false);
    });

    return () => {
      active = false;
      requestId.current++;
    };
  }, []);

  const currentSurahObj = useMemo(() => {
    return SURAH_DATA.find(s => s.no === surah) || SURAH_DATA[0];
  }, [surah]);

  const activeReciter = useMemo(() => {
    return reciters.find(r => r.id === activeReciterId);
  }, [reciters, activeReciterId]);

  const filteredList = useMemo(() => {
    const query = q.trim().toLocaleLowerCase('tr');
    return reciters.filter(r => `${r.name} ${r.moshafName}`.toLocaleLowerCase('tr').includes(query));
  }, [reciters, q]);

  async function playReciter(reciterId: string, surahNo = surah) {
    const currentRequestId = ++requestId.current;
    audioRef.current?.pause();
    setUrl('');

    const reciter = reciters.find(r => r.id === reciterId);
    if (!reciter) {
      setErr('Seçilen kıraat kaynağı katalogda bulunmuyor.');
      return;
    }
    if (!reciter.surahList.includes(surahNo)) {
      setErr(`${reciter.name} · ${reciter.moshafName} için ${surahNo}. sûrenin kaydı kaynak kataloğunda bulunmuyor.`);
      return;
    }

    setErr('');
    setActiveReciterId(reciterId);
    setSurah(surahNo);
    setUrl('');

    try {
      const result = await api.reciterAudio(reciter.server, surahNo);
      if (currentRequestId !== requestId.current) return;
      setUrl(result.url);
    } catch (error) {
      console.error('Kâri ses kaynağı çözümlenemedi:', error);
      if (currentRequestId === requestId.current) {
        setErr('Seçilen kâri/sûre kaydı açılamadı. Kayıt başka bir kâriyle değiştirilmedi.');
      }
    }
  }

  function handleRateChange(rate: number) {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }

  return (
    <div className="tl-container tl-stack">
      {/* 1. ÜST BAŞLIK & ETÜT KONSOLU */}
      <div className="tl-card tl-stack" style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.85), rgba(7,12,22,0.95))', borderColor: 'var(--tl-gold)' }}>
        <div className="tl-row" style={{ justifyContent: 'space-between' }}>
          <div>
            <div className="tl-row" style={{ gap: '6px', marginBottom: '6px' }}>
              <span className="tl-chip tl-chip--gold">DİNLEME SALONU</span>
              <span className="tl-chip">Kaynak kâri kataloğu</span>
            </div>
            <h1 className="tl-h1" style={{ margin: 0 }}>Kur'an Dinleme Salonu &amp; Kurrâ Kütüphanesi</h1>
            <p className="tl-muted" style={{ margin: '4px 0 0' }}>
              Kâri ve kayıt seçenekleri kaynak kataloğundan yüklenir. Kayıt bulunmayan sûreler başka bir okuyucuyla değiştirilmez.
            </p>
          </div>
        </div>

        {/* Sûre Seçimi ve Hızlı Erişim */}
        <div className="tl-row" style={{ gap: '12px', alignItems: 'flex-end', marginTop: '8px' }}>
          <div style={{ flex: '1', minWidth: '240px' }}>
            <label className="tl-muted" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px' }}>DİNLENECEK SÛRE:</label>
            <select
              className="tl-select"
              style={{ width: '100%' }}
              value={surah}
              onChange={e => {
                const s = +e.target.value;
                setSurah(s);
                if (activeReciterId) void playReciter(activeReciterId, s);
              }}
              aria-label="Sûre Seçiniz"
            >
              {SURAH_DATA.map(s => (
                <option key={s.no} value={s.no}>
                  {s.no}. {s.name} ({s.ar}) · {s.ayahs} Âyet
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <label className="tl-muted" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px' }}>KURRÂ ARAMA:</label>
            <input
              className="tl-select"
              style={{ width: '100%' }}
              placeholder="Kâri veya kıraat kaydı ara…"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>
        </div>

        {/* 2. AKTİF SES ÇALAR KONSOLU */}
        {url && activeReciter && (
          <div className="tl-card tl-card--soft tl-stack" style={{ marginTop: '12px', border: '1px solid var(--tl-gold)' }}>
            <div className="tl-row" style={{ justifyContent: 'space-between' }}>
              <div className="tl-row" style={{ gap: '10px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'var(--tl-gold)',
                    color: '#07090e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  {activeReciter.avatarText}
                </div>
                <div>
                  <strong>{activeReciter.name}</strong>
                  <div className="tl-muted" style={{ fontSize: '0.82rem' }}>
                    {currentSurahObj.name} Sûresi · {activeReciter.moshafName}
                  </div>
                </div>
              </div>

              {/* Hız Seçimi */}
              <div className="tl-row" style={{ gap: '6px' }}>
                <span className="tl-muted" style={{ fontSize: '0.8rem' }}>Hız:</span>
                {[0.75, 1.0, 1.25].map(r => (
                  <button
                    key={r}
                    type="button"
                    className={`tl-chip ${playbackRate === r ? 'tl-chip--gold' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRateChange(r)}
                  >
                    {r}x
                  </button>
                ))}
              </div>
            </div>

            <audio
              ref={audioRef}
              controls
              autoPlay
              src={url}
              style={{ width: '100%', marginTop: '6px' }}
              onError={() => {
                if (audioRef.current?.currentSrc !== url) return;
                console.error('Katalogdaki ses dosyası açılamadı:', url);
                setErr(`${activeReciter.name} · ${activeReciter.moshafName} kaydı açılamadı. Başka kâriye geçilmedi.`);
                setUrl('');
              }}
            />
          </div>
        )}
      </div>

      {err && <div className="tl-note tl-note--danger" role="alert">{err}</div>}

      {!catalogLoading && !err && (
        <p className="tl-muted" role="status">{filteredList.length} kıraat kaydı katalog ölçütleriyle eşleşti.</p>
      )}

      {/* 4. KÂRİ PROFİL KARTLARI */}
      <div className="tl-grid tl-grid-2">
        {catalogLoading && <div className="tl-note" role="status">Kâri kataloğu yükleniyor…</div>}
        {filteredList.map(r => {
          const isThisActive = (r.id === activeReciterId);
          const hasSelectedSurah = r.surahList.includes(surah);
          return (
            <div
              key={r.id}
              className="tl-card tl-stack"
              style={{
                borderColor: isThisActive ? 'var(--tl-gold)' : undefined,
                boxShadow: isThisActive ? '0 0 16px rgba(184,135,43,0.2)' : undefined
              }}
            >
              <div className="tl-row" style={{ gap: '12px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'var(--tl-gold)',
                    color: '#07090e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    flexShrink: 0
                  }}
                >
                  {r.avatarText}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{r.name}</h3>
                  <div className="tl-muted" style={{ fontSize: '0.8rem', color: 'var(--tl-gold)' }}>
                    {r.moshafName}
                  </div>
                </div>
              </div>

              <p className="tl-muted" style={{ fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
                Kaynak kataloğunda {r.surahList.length} sûre için kayıt bildiriliyor.
              </p>

              {/* Dinleme Butonları */}
              <div className="tl-row" style={{ justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--tl-border)' }}>
                <button
                  type="button"
                  className="tl-btn"
                  style={{ flex: 1 }}
                  disabled={!hasSelectedSurah || catalogLoading}
                  onClick={() => void playReciter(r.id, surah)}
                >
                  {hasSelectedSurah ? `▶ ${currentSurahObj.name} Sûresi Dinle` : `${currentSurahObj.name} kaydı yok`}
                </button>
              </div>
            </div>
          );
        })}
        {!catalogLoading && !err && filteredList.length === 0 && (
          <div className="tl-note">Aramayla eşleşen doğrulanmış katalog kaydı bulunamadı.</div>
        )}
      </div>

      <p className="tl-muted" style={{ textAlign: 'center', fontSize: '0.82rem', marginTop: '16px' }}>
        Kayıt bilgileri kaynak sağlayıcının kataloğundan alınır. Sağlayıcı metaverisi tek başına yayın lisansı veya belirli bir kıraat usulünün doğrulaması anlamına gelmez.
      </p>
    </div>
  );
}
