import React, { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LessonRunner } from '../ui/LessonRunner.js';
import type { Ayah, AyahKey, Lesson, Quiz } from '../core/types.js';
import l1_1 from '../data/lessons/L1-1-harfler.json';
import l1_6 from '../data/lessons/L1-6-sifatlar-giris.json';
import l2_6 from '../data/lessons/L2-6-seviye2-sinav.json';
import l3_1 from '../data/lessons/L3-1-nun-sakin-giris.json';
import l3_2 from '../data/lessons/L3-2-izhar.json';
import l3_8 from '../data/lessons/L3-8-seviye3-sinav.json';
import q3_2 from '../data/quiz/Q-3-2.json';

const allLessons: any[] = [l1_1, l1_6, l2_6, l3_1, l3_2, l3_8];
const allQuizzes: Record<string, Quiz> = {
  'Q-3-2': q3_2 as any
};

export default function LessonPage() {
  const { lessonId } = useParams();
  const nav = useNavigate();
  const lesson = useMemo(() => allLessons.find((l: Lesson) => l.id === lessonId), [lessonId]) as Lesson | undefined;

  const getAyah = useCallback(async (key: string): Promise<Ayah> => {
    const match = /^(\d+):(\d+)$/.exec(key);
    if (!match) throw new Error(`Geçersiz ayet anahtarı: ${key}`);

    const surah = Number(match[1]);
    const ayah = Number(match[2]);
    if (!Number.isInteger(surah) || surah < 1 || surah > 114 || !Number.isInteger(ayah) || ayah < 1) {
      throw new Error(`Geçersiz ayet numarası: ${key}`);
    }

    const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/editions/quran-uthmani,tr.diyanet`);
    if (!res.ok) throw new Error(`Ayet kaynağı HTTP ${res.status} yanıtı verdi.`);

    const response = await res.json();
    if (response.code !== 200 || !Array.isArray(response.data) || response.data.length < 2) {
      throw new Error('Ayet kaynağından beklenen metin alanları alınamadı.');
    }

    const [quran, meal] = response.data;
    if (typeof quran?.text !== 'string' || !quran.text.trim() ||
        typeof meal?.text !== 'string' || !meal.text.trim()) {
      throw new Error('Ayet metni veya Türkçe meal eksik.');
    }

    return {
      key: key as AyahKey,
      surah,
      ayah,
      textUthmani: quran.text,
      translationTr: meal.text
    };
  }, []);

  if (!lesson) return <div className="tl-container"><div className="tl-note tl-note--warn">Bu dersin yayımlanmış içeriği bu uygulama sürümünde mevcut değil.</div></div>;

  return (
    <LessonRunner
      lesson={lesson}
      quizzes={allQuizzes}
      getAyah={getAyah}
      getAudioUrl={(_audioId: string) => {
        return null;
      }}
      onComplete={() => nav('/tilavet')}
    />
  );
}
