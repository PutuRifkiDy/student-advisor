import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      login(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Sistem Bimbingan</h1>
          <p className="text-slate-400 text-sm mt-1">Masuk untuk melanjutkan</p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-2xl shadow-xl p-8 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Username / NIM</label>
            <input
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              placeholder="Masukkan username atau NIM"
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="Masukkan password"
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-3.5 py-2.5 rounded-xl">
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-xl transition-colors mt-2"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="mt-4 bg-white rounded-2xl shadow-xl p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Akun Demo</p>
          <div className="space-y-2">
            {[
              { role: 'Admin', username: 'admin', password: 'admin123', color: 'bg-violet-50 text-violet-700' },
              { role: 'Dosen', username: '198501012010011001', password: '198501012010011001', color: 'bg-blue-50 text-blue-700' },
              { role: 'Mahasiswa', username: '2021050001', password: '2021050001', color: 'bg-emerald-50 text-emerald-700' },
            ].map((demo) => (
              <button
                key={demo.role}
                type="button"
                onClick={() => setForm({ username: demo.username, password: demo.password })}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-left"
              >
                <div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mr-2 ${demo.color}`}>{demo.role}</span>
                  <span className="text-xs text-slate-500 font-mono">{demo.username}</span>
                </div>
                <span className="text-xs text-slate-300">Klik untuk isi</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
