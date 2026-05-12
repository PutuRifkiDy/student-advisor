import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { useTableControls, TableControls, Pagination } from '../components/TableControls';

export default function DosenBimbinganPage() {
  const { user } = useAuth();
  const [dosen, setDosen] = useState(null);
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [tab, setTab] = useState('bimbingan');

  useEffect(() => {
    Promise.all([api.get('/dosen'), api.get('/mahasiswa')]).then(([dosenList, mList]) => {
      setDosen(dosenList.find((d) => d.id === user.ref_id));
      setMahasiswaList(mList.filter((m) => m.dosen_id === user.ref_id));
    });
  }, [user.ref_id]);

  const { search, setSearch, filter, setFilter, filterOptions, page, setPage, perPage, setPerPage, paginated, filtered, totalPages } =
    useTableControls(mahasiswaList, ['nim', 'nama', 'jurusan'], 'jurusan');

  return (
    <div>
      {/* Tab */}
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
            <div className="p-6 space-y-1">
              {[['Jurusan', dosen.jurusan], ['Jabatan', dosen.jabatan], ['Jumlah Mahasiswa Bimbingan', `${mahasiswaList.length} mahasiswa`]].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                  <span className="text-sm text-slate-400 font-medium">{label}</span>
                  <span className="text-sm font-semibold text-slate-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'bimbingan' && (
        <>
          <div className="flex items-center justify-between mb-4">
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
    </div>
  );
}
