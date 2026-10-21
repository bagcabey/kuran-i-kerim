import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MakamGrid } from '../ui/MakamGrid.js';
import { MakamDetail } from '../ui/MakamDetail.js';
import type { Makam } from '../core/types.js';
import rast from '../data/makam/rast.json';
import ussak from '../data/makam/ussak.json';
import hicaz from '../data/makam/hicaz.json';
import nihavend from '../data/makam/nihavend.json';
import saba from '../data/makam/saba.json';
import segah from '../data/makam/segah.json';
import kurdi from '../data/makam/kurdi.json';
import acemasiran from '../data/makam/acemasiran.json';
import neva from '../data/makam/neva.json';
import huzzam from '../data/makam/huzzam.json';

const allMakams: Makam[] = [
  rast as any,
  ussak as any,
  hicaz as any,
  nihavend as any,
  saba as any,
  segah as any,
  kurdi as any,
  acemasiran as any,
  neva as any,
  huzzam as any
];

export default function MakamPage() {
  const { makamId } = useParams();
  const nav = useNavigate();
  const makams = useMemo(() => [...allMakams].sort((a, b) => a.difficulty - b.difficulty), []);
  const current = makams.find(m => m.id === makamId);
  return (
    <div className="tl-container tl-stack">
      {current
        ? <><button className="tl-btn tl-btn--ghost" onClick={() => nav('/tilavet/makam')}>← Tüm makamlar</button><MakamDetail makam={current} /></>
        : <><h1 className="tl-h1">Makam Okulu</h1><p className="tl-muted">Öğrenmek istediğin makamı seç (10 Klasik Tilavet Makamı).</p><MakamGrid makams={makams} onPick={id => nav(`/tilavet/makam/${id}`)} /></>}
    </div>
  );
}
