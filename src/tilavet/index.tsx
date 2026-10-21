import React, { lazy, Suspense } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { TilavetShell, TILAVET_TABS } from './ui/TilavetShell';

const JourneyPage   = lazy(() => import('./pages/JourneyPage'));
const LessonPage    = lazy(() => import('./pages/LessonPage'));
const MakamPage     = lazy(() => import('./pages/MakamPage'));
const VoicePage     = lazy(() => import('./pages/VoicePage'));
const ListeningPage = lazy(() => import('./pages/ListeningPage'));
const QiraatPage    = lazy(() => import('./pages/QiraatPage'));
const AssistantPage = lazy(() => import('./pages/AssistantPage'));
const StudioPage    = lazy(() => import('./pages/StudioPage'));
const ExamPage      = lazy(() => import('./pages/ExamPage'));
const TeacherPage   = lazy(() => import('./pages/TeacherPage'));
const GlossaryPage  = lazy(() => import('./pages/GlossaryPage'));
const SettingsPage  = lazy(() => import('./pages/SettingsPage'));

export default function TilavetApp({ isTeacher = false }: { isTeacher?: boolean }) {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const active = [...TILAVET_TABS].reverse().find(t => pathname.startsWith(t.path))?.id ?? 'journey';
  return (
    <TilavetShell active={active} onNavigate={nav} isTeacher={isTeacher}>
      <Suspense fallback={<div className="tl-container">Yükleniyor…</div>}>
        <Routes>
          <Route index element={<JourneyPage />} />
          <Route path="sifirdan" element={<JourneyPage filterLevels={[0, 1, 2]} />} />
          <Route path="tecvid" element={<JourneyPage filterLevels={[3]} />} />
          <Route path="teknik" element={<JourneyPage filterLevels={[4]} />} />
          <Route path="ders/:lessonId" element={<LessonPage />} />
          <Route path="makam" element={<MakamPage />} />
          <Route path="makam/:makamId" element={<MakamPage />} />
          <Route path="ses" element={<VoicePage />} />
          <Route path="dinleme" element={<ListeningPage />} />
          <Route path="kiraat" element={<QiraatPage />} />
          <Route path="asistan" element={<AssistantPage />} />
          <Route path="studyo" element={<StudioPage />} />
          <Route path="sinav" element={<ExamPage />} />
          <Route path="sozluk" element={<GlossaryPage />} />
          <Route path="ayarlar" element={<SettingsPage />} />
          {isTeacher && <Route path="hoca" element={<TeacherPage />} />}
        </Routes>
      </Suspense>
    </TilavetShell>
  );
}
