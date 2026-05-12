import { useEffect, useState } from 'react';
import { api } from '../api';
import { useTableControls, TableControls, Pagination } from './TableControls';

export default function BimbinganPage() {
  const [list, setList] = useState([]);

  useEffect(() => { api.get('/mahasiswa').then(setList); }, []);

  const { search, setSearch, filter, setFilter, filterOptions, page, setPage, perPage, setPerPage, paginated, filtered, totalPages } =
    useTableControls(list, ['nim', 'nama', 'jurusan', 'nama_dosen'], 'nama_dosen');

  // Group paginated results by dosen
  const grouped = paginated.reduce((acc, m) => {
    const key = m.nama_dosen ?? 'Belum Ada Pembimbing';
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Tabel Bimbingan</h2>
        <p className="text-sm text-slate-400 mt-0.5">Daftar mahasiswa dikelompokkan per dosen pembimbing</p>
      </div>

      <TableControls
        search={search} onSearch={setSearch}
        filter={filter} onFilter={setFilter}
        filterOptions={filterOptions} filterLabel="Dosen"
        perPage={perPage} onPerPage={(v) => { setPerPage(v); setPage(1); }}
      />

      {paginated.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center text-slate-400 text-sm">Tidak ada data ditemukan</div>
      )}

      <div className="space-y-5">
        {Object.entries(grouped).map(([dosen, mahasiswas]) => (
          <div key={dosen} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                {dosen.charAt(0)}
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Dosen Pembimbing</p>
                <p className="font-semibold text-slate-800">{dosen}</p>
              </div>
              <span className="ml-auto bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                {mahasiswas.length} mahasiswa
              </span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['NIM', 'Nama', 'Jurusan', 'Semester'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mahasiswas.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{m.nim}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{m.nama}</td>
                    <td className="px-5 py-3.5 text-slate-600">{m.jurusan}</td>
                    <td className="px-5 py-3.5">
                      <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full">Sem {m.semester}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPage={setPage} total={filtered.length} perPage={perPage} />
    </div>
  );
}
