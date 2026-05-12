import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import MahasiswaProfilePage from './pages/MahasiswaProfilePage';
import DosenBimbinganPage from './pages/DosenBimbinganPage';
import AdminApp from './AdminApp';

export default function App() {
  const { user } = useAuth();

  if (!user) return <LoginPage />;
  if (user.role === 'mahasiswa') return <Shell title="Portal Mahasiswa" subtitle={user.username}><MahasiswaProfilePage /></Shell>;
  if (user.role === 'dosen') return <Shell title="Portal Dosen" subtitle={user.username}><DosenBimbinganPage /></Shell>;
  return <AdminApp />;
}

function Shell({ title, subtitle, children }) {
  const { logout } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-5 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">{title}</h1>
            <p className="text-indigo-200 text-sm mt-0.5">{subtitle}</p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-indigo-200 hover:text-white transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Keluar
          </button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-8 py-8">{children}</main>
    </div>
  );
}
