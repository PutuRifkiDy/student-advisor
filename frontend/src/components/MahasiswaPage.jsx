import { useEffect, useState } from 'react';
import { api } from '../api';
import Modal from './Modal';
import { IconPlus } from './Icons';
import { useTableControls, TableControls, Pagination } from './TableControls';
import ConfirmDialog from './ConfirmDialog';
import { useToast, ToastContainer } from './Toast';

const empty = { nim: '', nama: '', jurusan: '', semester: '', dosen_id: '' };

export default function MahasiswaPage() {
  const [list, setList] = useState([]);
  const [dosenList, setDosenList] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toasts, show } = useToast();

  const load = () => Promise.all([api.get('/mahasiswa'), api.get('/dosen')]).then(([m, d]) => { setList(m); setDosenList(d); });
  useEffect(() => { load(); }, []);

  const { search, setSearch, filter, setFilter, filterOptions, page, setPage, perPage, setPerPage, paginated, filtered, totalPages } =
    useTableControls(list, ['nim', 'nama', 'jurusan', 'nama_dosen'], 'jurusan');

  const openAdd = () => { setForm(empty); setModal('add'); };
  const openEdit = (m) => {
    setForm({ nim: m.nim, nama: m.nama, jurusan: m.jurusan, semester: m.semester, dosen_id: m.dosen_id ?? '' });
    setEditId(m.id);
    setModal('edit');
  };

  const save = async () => {
    try {
      if (modal === 'add') { await api.post('/mahasiswa', form); show('Mahasiswa berhasil ditambahkan'); }
      else { await api.put(`/mahasiswa/${editId}`, form); show('Data mahasiswa berhasil diperbarui'); }
      setModal(null);
      load();
    } catch (err) {
      show(err.message, 'error');
    }
  };

  const confirmDelete = async () => {
    await api.del(`/mahasiswa/${deleteTarget.id}`);
    setDeleteTarget(null);
    show('Mahasiswa berhasil dihapus', 'error');
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Data Mahasiswa</h2>
          <p className="text-sm text-slate-400 mt-0.5">{list.length} mahasiswa terdaftar</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm">
          <IconPlus /> Tambah Mahasiswa
        </button>
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
              {['NIM', 'Nama', 'Jurusan', 'Semester', 'Dosen Pembimbing', 'Aksi'].map((h) => (
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
                <td className="px-5 py-4">
                  {m.nama_dosen
                    ? <span className="text-slate-700">{m.nama_dosen}</span>
                    : <span className="text-slate-300 italic text-xs">Belum ditentukan</span>}
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-3">
                    <button onClick={() => openEdit(m)} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Edit</button>
                    <button onClick={() => setDeleteTarget({ id: m.id, nama: m.nama })} className="text-red-400 hover:text-red-600 text-xs font-medium">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-sm">Tidak ada data ditemukan</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPage={setPage} total={filtered.length} perPage={perPage} />

      {modal && (
        <Modal title={modal === 'add' ? 'Tambah Mahasiswa' : 'Edit Mahasiswa'} onClose={() => setModal(null)}>
          <FormMahasiswa form={form} setForm={setForm} dosenList={dosenList} onSave={save} onCancel={() => setModal(null)} />
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={<>Anda akan menghapus data mahasiswa <span className="font-semibold text-slate-800">{deleteTarget.nama}</span>. Tindakan ini tidak dapat dibatalkan.</>}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}

function FormMahasiswa({ form, setForm, dosenList, onSave, onCancel }) {
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <div className="space-y-4">
      {[
        ['NIM', 'nim', '2021050001'],
        ['Nama Lengkap', 'nama', 'Andi Pratama'],
        ['Jurusan', 'jurusan', 'Teknik Informatika'],
      ].map(([label, key, placeholder]) => (
        <div key={key}>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
          <input value={form[key]} onChange={set(key)} placeholder={placeholder} className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition" />
        </div>
      ))}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Semester</label>
        <input type="number" min="1" max="14" value={form.semester} onChange={set('semester')} placeholder="Contoh: 3" className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Dosen Pembimbing</label>
        <select value={form.dosen_id} onChange={set('dosen_id')} className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition bg-white">
          <option value="">-- Belum ditentukan --</option>
          {dosenList.map((d) => <option key={d.id} value={d.id}>{d.nama} ({d.nip})</option>)}
        </select>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">Batal</button>
        <button onClick={onSave} className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">Simpan</button>
      </div>
    </div>
  );
}
