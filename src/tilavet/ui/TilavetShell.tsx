import React, { useEffect, useRef } from 'react';
import '../styles/tilavet.css';
import { t } from './hooks.js';

export const TILAVET_TABS = [
  { id: 'journey',   path: '/tilavet',            label: 'tl.nav.journey' },
  { id: 'scratch',   path: '/tilavet/sifirdan',   label: 'tl.nav.scratch' },
  { id: 'tajweed',   path: '/tilavet/tecvid',     label: 'tl.nav.tajweed' },
  { id: 'technique', path: '/tilavet/teknik',     label: 'tl.nav.technique' },
  { id: 'makam',     path: '/tilavet/makam',      label: 'tl.nav.makam' },
  { id: 'voice',     path: '/tilavet/ses',        label: 'tl.nav.voice' },
  { id: 'listen',    path: '/tilavet/dinleme',    label: 'tl.nav.listen' },
  { id: 'qiraat',    path: '/tilavet/kiraat',     label: 'tl.nav.qiraat' },
  { id: 'assistant', path: '/tilavet/asistan',    label: 'tl.nav.assistant' },
  { id: 'studio',    path: '/tilavet/studyo',     label: 'tl.nav.studio' },
  { id: 'exam',      path: '/tilavet/sinav',      label: 'tl.nav.exam' },
  { id: 'glossary',  path: '/tilavet/sozluk',     label: 'tl.nav.glossary' },
  { id: 'settings',  path: '/tilavet/ayarlar',    label: 'tl.nav.settings' },
] as const;

export function TilavetShell({ active, onNavigate, children, isTeacher }: {
  active: string; onNavigate: (path: string) => void; children: React.ReactNode; isTeacher?: boolean;
}) {
  const tabs = isTeacher ? [...TILAVET_TABS, { id: 'teacher', path: '/tilavet/hoca', label: 'tl.nav.teacher' } as const] : TILAVET_TABS;
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeTabRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [active]);

  return (
    <div className="tl-root">
      <div className="tl-container">
        <div className="tl-tabs" role="tablist" aria-label={t('tl.tab')}>
          {tabs.map(tab => (
            <button key={tab.id} ref={active === tab.id ? activeTabRef : undefined} role="tab" className="tl-tab" aria-selected={active === tab.id}
              onClick={() => onNavigate(tab.path)}>{t(tab.label)}</button>
          ))}
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
}
