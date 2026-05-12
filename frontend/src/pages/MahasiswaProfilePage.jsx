import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function MahasiswaProfilePage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/mahasiswa').then((list) => {
      const me = list.find((m) => m.id === user.ref_id);
      setData(me);
    });
  }, [user.ref_id]);

  if (!data) return <div className="text-center py-16 text-slate-400">Memuat data...</div>;

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-semibold text-slate-800 mb-6">Profil Saya</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-8 text-center">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl font-bold text-white">{data.nama.charAt(0)}</span>
          </div>
          <h3 className="text-xl font-bold text-white">{data.nama}</h3>
          <p className="text-indigo-200 text-sm mt-1">{data.nim}</p>
        </div>

        <div className="p-6 space-y-4">
          {[
            ['Jurusan', data.jurusan],
            ['Semester', `Semester ${data.semester}`],
            ['Dosen Pembimbing', data.nama_dosen ?? 'Belum ditentukan'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
              <span className="text-sm text-slate-400 font-medium">{label}</span>
              <span className="text-sm font-semibold text-slate-800">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
