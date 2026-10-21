import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import curriculum from '../data/curriculum.json';
import { LevelMap } from '../ui/LevelMap.js';
import { Home } from '../ui/Home.js';
import { api } from '../core/api/client.js';
import l1_1 from '../data/lessons/L1-1-harfler.json';
import l1_6 from '../data/lessons/L1-6-sifatlar-giris.json';
import l2_6 from '../data/lessons/L2-6-seviye2-sinav.json';
import l3_1 from '../data/lessons/L3-1-nun-sakin-giris.json';
import l3_2 from '../data/lessons/L3-2-izhar.json';
import l3_8 from '../data/lessons/L3-8-seviye3-sinav.json';

const allLessons = [l1_1, l1_6, l2_6, l3_1, l3_2, l3_8];
const curriculumLessonCount = curriculum.levels.reduce((count, level) => count + level.lessons.length, 0);

export default function JourneyPage({ filterLevels }: { filterLevels?: number[] }) {
  const nav = useNavigate();
  const [state, setState] = useState<any>({ progress: {}, activity: [], badges: [], settings: null });
  const [due, setDue] = useState(0);
  useEffect(() => {
    api.progress().then(setState).catch(() => {});
    api.srsDue().then(r => setDue(r.cards.length)).catch(() => {});
  }, []);

  const availableIds = useMemo(() => new Set(allLessons.map(lesson => lesson.id)), []);
  const levels = useMemo(() => curriculum.levels
    .filter(level => !filterLevels || filterLevels.includes(level.level))
    .map(level => ({ ...level, lessons: level.lessons.filter(id => availableIds.has(id)) }))
    .filter(level => level.lessons.length > 0), [filterLevels, availableIds]);
  const metas = allLessons.map(l => ({ id: l.id, level: l.level, prerequisites: l.prerequisites ?? [], minutes: l.estimatedMinutes ?? 10 }));
  const titles = Object.fromEntries(allLessons.map(l => [l.id, l.title]));
  const minutesToday = state.activity.find((a: any) => a.day === new Date().toISOString().slice(0, 10))?.minutes ?? 0;

  return (
    <>
      {!filterLevels && (
        <Home metas={metas} progress={state.progress} activityDays={state.activity.map((a: any) => a.day)}
          minutesToday={minutesToday} goalMinutes={state.settings?.daily_goal_minutes ?? 10}
          titles={titles} onOpen={id => nav(`/tilavet/ders/${id}`)} srsDueCount={due} onReview={() => nav('/tilavet/studyo?mode=review')} />
      )}
      <div className="tl-container">
        <div className="tl-note tl-note--warn" role="status">
          Müfredatta {curriculumLessonCount} ders tanımlı; bu uygulama akışında {allLessons.length} ders içeriği mevcut.
          Diğer dersler gerçek içerikleri eklenene kadar açılmaz.
        </div>
        <LevelMap levels={levels} metas={metas} progress={state.progress} titles={titles} onOpen={id => nav(`/tilavet/ders/${id}`)} />
      </div>
    </>
  );
}
