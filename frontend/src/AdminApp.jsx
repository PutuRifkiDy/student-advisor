import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import DosenPage from './components/DosenPage';
import MahasiswaPage from './components/MahasiswaPage';
import BimbinganPage from './components/BimbinganPage';
import UsersPage from './pages/UsersPage';
import { IconGraduate, IconTeacher, IconTable } from './components/Icons';

const IconUsers = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const tabs = [
  { id: 'mahasiswa', label: 'Mahasiswa', icon: <IconGraduate /> },
  { id: 'dosen', label: 'Dosen', icon: <IconTeacher /> },
  { id: 'bimbingan', label: 'Tabel Bimbingan', icon: <IconTable /> },
  { id: 'users', label: 'Manajemen Akun', icon: <IconUsers /> },
];

export default function AdminApp() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('mahasiswa');

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-5 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Sistem Bimbingan Akademik</h1>
            <p className="text-indigo-200 text-sm mt-0.5">Admin · {user.username}</p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-indigo-200 hover:text-white transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Keluar
          </button>
        </div>
      </header>

      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-8 flex gap-1">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-all ${
                tab === t.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-8 py-8">
        {tab === 'mahasiswa' && <MahasiswaPage />}
        {tab === 'dosen' && <DosenPage />}
        {tab === 'bimbingan' && <BimbinganPage />}
        {tab === 'users' && <UsersPage />}
      </main>
    </div>
  );
}
