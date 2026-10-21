import React, { useEffect, useState } from 'react';

const j = (url: string, init?: RequestInit) =>
  fetch('/api/tilavet/teacher' + url, { credentials: 'include', headers: { 'Content-Type': 'application/json' }, ...init }).then(r => r.json());

export default function TeacherPage() {
  const [classId, setClassId] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [ayah, setAyah] = useState('');

  const loadOverview = (id: string) => j(`/classes/${id}/overview`).then(r => setStudents(r.students ?? []));
  useEffect(() => { if (classId) loadOverview(classId); }, [classId]);

  async function createClass() {
    const r = await j('/classes', { method: 'POST', body: JSON.stringify({ name }) });
    setClassId(r.id); setCode(r.invite_code);
  }
  async function addAssignment() {
    await j(`/classes/${classId}/assignments`, { method: 'POST', body: JSON.stringify({ title, ayahKey: ayah || undefined }) });
    setTitle(''); setAyah('');
  }

  return (
    <div className="tl-container tl-stack">
      <h1 className="tl-h1">Hoca Paneli</h1>
      <div className="tl-card tl-row">
        <input className="tl-select" placeholder="Sınıf adı" value={name} onChange={e => setName(e.target.value)} />
        <button className="tl-btn" onClick={createClass} disabled={name.length < 2}>Sınıf oluştur</button>
        {code && <span className="tl-chip tl-chip--gold">Davet kodu: {code}</span>}
      </div>

      {classId && (<>
        <div className="tl-card tl-stack">
          <h2 className="tl-h2">Ödev ata</h2>
          <div className="tl-row">
            <input className="tl-select" placeholder="Ödev başlığı" value={title} onChange={e => setTitle(e.target.value)} />
            <input className="tl-select" placeholder="Ayet (örn. 1:1)" value={ayah} onChange={e => setAyah(e.target.value)} />
            <button className="tl-btn" onClick={addAssignment} disabled={title.length < 2}>Ata</button>
          </div>
        </div>
        <div className="tl-card">
          <h2 className="tl-h2">Öğrenciler</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th align="left">Öğrenci</th><th>Biten ders</th><th>Süre (dk)</th><th>Son aktiflik</th></tr></thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.student_id} style={{ borderTop: '1px solid var(--tl-border)' }}>
                    <td>{String(s.student_id).slice(0, 8)}…</td>
                    <td align="center">{s.done_lessons}</td>
                    <td align="center">{Math.round(s.seconds / 60)}</td>
                    <td align="center">{s.last_active ? new Date(s.last_active).toLocaleDateString('tr-TR') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>)}
    </div>
  );
}
