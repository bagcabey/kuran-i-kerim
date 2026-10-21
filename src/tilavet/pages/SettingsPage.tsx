import React, { useEffect, useState } from 'react';
import { api } from '../core/api/client.js';
import { applySettings, t } from '../ui/hooks.js';

export default function SettingsPage() {
  const [scale, setScale] = useState(1);
  const [theme, setTheme] = useState<'auto' | 'light' | 'dark'>('auto');
  const [tajweedColors, setTajweedColors] = useState(true);
  const [tuning, setTuning] = useState<'tr-53' | 'ar-24'>('tr-53');
  const [goal, setGoal] = useState(10);
  const [cloudRec, setCloudRec] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusIsError, setStatusIsError] = useState(false);

  useEffect(() => {
    api.progress().then(r => {
      if (r.settings) {
        setScale(r.settings.quran_scale ?? 1);
        setTheme(r.settings.theme ?? 'auto');
        setTajweedColors(r.settings.tajweed_colors ?? true);
        setTuning(r.settings.tuning ?? 'tr-53');
        setGoal(r.settings.daily_goal_minutes ?? 10);
        setCloudRec(r.settings.cloud_recordings ?? false);
        applySettings({ quranScale: r.settings.quran_scale ?? 1, theme: r.settings.theme ?? 'auto' });
      }
    }).catch(() => {});
  }, []);

  async function save() {
    try {
      applySettings({ quranScale: scale, theme });
      await api.saveSettings({
        quranScale: scale,
        tajweedColors,
        theme,
        dailyGoalMinutes: goal,
        kararId: 'D3',
        tuning,
        cloudRecordings: cloudRec,
        reminders: false
      });
      setStatusIsError(false);
      setStatusMsg('Ayarlar kaydedildi.');
    } catch {
      setStatusIsError(false);
      setStatusMsg('Ayarlar yerel olarak uygulandı.');
    }
  }

  async function handleDeleteAll() {
    if (!confirm('Tüm Tilavet Akademisi ilerleme ve kayıt verileriniz silinecektir. Emin misiniz?')) return;

    try {
      await api.deleteAll();
      setStatusIsError(false);
      setStatusMsg('Tüm verileriniz başarıyla silindi.');
    } catch {
      setStatusIsError(true);
      setStatusMsg('Veriler silinemedi. Lütfen yeniden deneyin.');
    }
  }

  return (
    <div className="tl-container tl-stack">
      <h1 className="tl-h1">Ayarlar &amp; Gizlilik</h1>
      {statusMsg && <div className="tl-note" role={statusIsError ? 'alert' : 'status'}>{statusMsg}</div>}

      <div className="tl-card tl-stack">
        <h2 className="tl-h2">Görünüm ve Yazı Tipi</h2>
        <label className="tl-row">
          <span>{t('tl.settings.quranSize')}: {Math.round(scale * 100)}%</span>
          <input
            type="range"
            min={0.8}
            max={2.0}
            step={0.1}
            value={scale}
            onChange={e => {
              const v = +e.target.value;
              setScale(v);
              applySettings({ quranScale: v, theme });
            }}
          />
        </label>
        <label className="tl-row">
          <span>{t('tl.settings.theme')}:</span>
          <select
            className="tl-select"
            value={theme}
            onChange={e => {
              const v = e.target.value as any;
              setTheme(v);
              applySettings({ quranScale: scale, theme: v });
            }}
          >
            <option value="auto">Otomatik (Sistem)</option>
            <option value="light">Açık Tema (Sıcak Kâğıt)</option>
            <option value="dark">Koyu Tema (Derin Zümrüt)</option>
          </select>
        </label>
        <label className="tl-row">
          <input
            type="checkbox"
            checked={tajweedColors}
            onChange={e => setTajweedColors(e.target.checked)}
          />
          <span>{t('tl.settings.tajweedColors')}</span>
        </label>
      </div>

      <div className="tl-card tl-stack">
        <h2 className="tl-h2">Makam ve Ses Sistemi</h2>
        <label className="tl-row">
          <span>Makam Akort Sistemi:</span>
          <select
            className="tl-select"
            value={tuning}
            onChange={e => setTuning(e.target.value as any)}
          >
            <option value="tr-53">Türk Müziği (53 Koma - Arel/Ezgi/Uzdilek)</option>
            <option value="ar-24">Arap Müziği (24 Çeyrek Ton - Mansûrî)</option>
          </select>
        </label>
        <label className="tl-row">
          <span>Günlük Hedef Süre: {goal} dakika</span>
          <input
            type="range"
            min={5}
            max={60}
            step={5}
            value={goal}
            onChange={e => setGoal(+e.target.value)}
          />
        </label>
      </div>

      <div className="tl-card tl-stack">
        <h2 className="tl-h2">{t('tl.settings.privacy')}</h2>
        <p className="tl-muted">{t('tl.rec.why')}</p>
        <label className="tl-row">
          <input
            type="checkbox"
            checked={cloudRec}
            onChange={e => setCloudRec(e.target.checked)}
          />
          <span>{t('tl.settings.cloudRecordings')}</span>
        </label>
        <div style={{ marginTop: '16px' }}>
          <button className="tl-btn tl-btn--danger" onClick={handleDeleteAll}>
            Tüm Tilavet Verilerimi Sil
          </button>
        </div>
      </div>

      <div className="tl-row">
        <button className="tl-btn" onClick={save}>Ayarları Kaydet</button>
      </div>
    </div>
  );
}
