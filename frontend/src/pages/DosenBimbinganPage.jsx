import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { useTableControls, TableControls, Pagination } from '../components/TableControls';
import { useToast, ToastContainer } from '../components/Toast';

export default function DosenBimbinganPage() {
  const { user } = useAuth();
  const [dosen, setDosen] = useState(null);
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [tab, setTab] = useState('bimbingan');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const { toasts, show } = useToast();

  const load = () => Promise.all([api.get('/dosen'), api.get('/mahasiswa')]).then(([dosenList, mList]) => {
    const me = dosenList.find((d) => d.id === user.ref_id);
    setDosen(me);
    setForm({ nama: me?.nama, jurusan: me?.jurusan, jabatan: me?.jabatan });
    setMahasiswaList(mList.filter((m) => m.dosen_id === user.ref_id));
  });

  useEffect(() => { load(); }, [user.ref_id]);

  const save = async () => {
    try {
      await api.put('/dosen/me', form);
      show('Profil berhasil diperbarui');
      setEditing(false);
      load();
    } catch (err) { show(err.message, 'error'); }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const { search, setSearch, filter, setFilter, filterOptions, page, setPage, perPage, setPerPage, paginated, filtered, totalPages } =
    useTableControls(mahasiswaList, ['nim', 'nama', 'jurusan'], 'jurusan');

  return (
    <div>
      <div className="flex gap-1 mb-6 border-b border-slate-200">
        {[['bimbingan', 'Mahasiswa Bimbingan'], ['profil', 'Profil Saya']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-all ${tab === id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'profil' && dosen && (
        <div className="max-w-lg">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-8 text-center">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl font-bold text-white">{dosen.nama.charAt(0)}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{dosen.nama}</h3>
              <p className="text-indigo-200 text-sm mt-1">{dosen.nip}</p>
            </div>
            <div className="p-6">
              {editing ? (
                <div className="space-y-4">
                  {[['Nama Lengkap', 'nama'], ['Jurusan', 'jurusan'], ['Jabatan', 'jabatan']].map(([label, key]) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                      <input value={form[key] ?? ''} onChange={set(key)}
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" />
                    </div>
                  ))}
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => setEditing(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">Batal</button>
                    <button onClick={save} className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium">Simpan</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    {[['Jurusan', dosen.jurusan], ['Jabatan', dosen.jabatan], ['Jumlah Mahasiswa Bimbingan', `${mahasiswaList.length} mahasiswa`]].map(([label, value]) => (
                      <div key={label} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                        <span className="text-sm text-slate-400 font-medium">{label}</span>
                        <span className="text-sm font-semibold text-slate-800">{value}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setEditing(true)}
                    className="mt-5 w-full flex items-center justify-center gap-2 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-sm font-medium py-2.5 rounded-xl transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit Profil
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'bimbingan' && (
        <>
          <div className="mb-4">
            <p className="text-sm text-slate-500">{mahasiswaList.length} mahasiswa bimbingan</p>
          </div>
          <TableControls
            search={search} onSearch={setSearch}
            filter={filter} onFilter={setFilter}
            filterOptions={filterOptions} filterLabel="Jurusan"
            perPage={perPage} onPerPage={(v) => { setPerPage(v); setPage(1); }}
          />
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['NIM', 'Nama', 'Jurusan', 'Semester'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginated.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 text-slate-500 font-mono text-xs">{m.nim}</td>
                    <td className="px-5 py-4 font-medium text-slate-800">{m.nama}</td>
                    <td className="px-5 py-4 text-slate-600">{m.jurusan}</td>
                    <td className="px-5 py-4">
                      <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full">Sem {m.semester}</span>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-12 text-center text-slate-400 text-sm">Tidak ada data ditemukan</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onPage={setPage} total={filtered.length} perPage={perPage} />
        </>
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}
