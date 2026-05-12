import { useState } from 'react';
import DosenPage from './components/DosenPage';
import MahasiswaPage from './components/MahasiswaPage';
import BimbinganPage from './components/BimbinganPage';
import { IconGraduate, IconTeacher, IconTable } from './components/Icons';

const tabs = [
  { id: 'mahasiswa', label: 'Mahasiswa', icon: <IconGraduate /> },
  { id: 'dosen', label: 'Dosen', icon: <IconTeacher /> },
  { id: 'bimbingan', label: 'Tabel Bimbingan', icon: <IconTable /> },
];

export default function App() {
  const [tab, setTab] = useState('mahasiswa');

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-6 shadow-lg">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight">Sistem Bimbingan Akademik</h1>
          <p className="text-indigo-200 text-sm mt-1">Manajemen data dosen pembimbing & mahasiswa</p>
        </div>
      </header>

      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-8 flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-all ${
                tab === t.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-8 py-8">
        {tab === 'mahasiswa' && <MahasiswaPage />}
        {tab === 'dosen' && <DosenPage />}
        {tab === 'bimbingan' && <BimbinganPage />}
      </main>
    </div>
  );
}
