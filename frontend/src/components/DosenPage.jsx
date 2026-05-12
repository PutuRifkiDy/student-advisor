import { useEffect, useState } from 'react';
import { api } from '../api';
import Modal from './Modal';
import { IconPlus } from './Icons';
import { useTableControls, TableControls, Pagination } from './TableControls';
import ConfirmDialog from './ConfirmDialog';
import { useToast, ToastContainer } from './Toast';

const empty = { nip: '', nama: '', jurusan: '', jabatan: '' };

export default function DosenPage() {
  const [list, setList] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toasts, show } = useToast();

  const load = () => api.get('/dosen').then(setList);
  useEffect(() => { load(); }, []);

  const { search, setSearch, filter, setFilter, filterOptions, page, setPage, perPage, setPerPage, paginated, filtered, totalPages } =
    useTableControls(list, ['nip', 'nama', 'jurusan', 'jabatan'], 'jurusan');

  const openAdd = () => { setForm(empty); setModal('add'); };
  const openEdit = (d) => { setForm({ nip: d.nip, nama: d.nama, jurusan: d.jurusan, jabatan: d.jabatan }); setEditId(d.id); setModal('edit'); };

  const save = async () => {
    try {
      if (modal === 'add') { await api.post('/dosen', form); show('Dosen berhasil ditambahkan'); }
      else { await api.put(`/dosen/${editId}`, form); show('Data dosen berhasil diperbarui'); }
      setModal(null);
      load();
    } catch (err) {
      show(err.message, 'error');
    }
  };

  const confirmDelete = async () => {
    await api.del(`/dosen/${deleteTarget.id}`);
    setDeleteTarget(null);
    show('Dosen berhasil dihapus', 'error');
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Data Dosen</h2>
          <p className="text-sm text-slate-400 mt-0.5">{list.length} dosen terdaftar</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm">
          <IconPlus /> Tambah Dosen
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
              {['NIP', 'Nama', 'Jurusan', 'Jabatan', 'Aksi'].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginated.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4 text-slate-500 font-mono text-xs">{d.nip}</td>
                <td className="px-5 py-4 font-medium text-slate-800">{d.nama}</td>
                <td className="px-5 py-4 text-slate-600">{d.jurusan}</td>
                <td className="px-5 py-4">
                  <span className="bg-violet-50 text-violet-700 text-xs font-medium px-2.5 py-1 rounded-full">{d.jabatan}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-3">
                    <button onClick={() => openEdit(d)} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Edit</button>
                    <button onClick={() => setDeleteTarget({ id: d.id, nama: d.nama })} className="text-red-400 hover:text-red-600 text-xs font-medium">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-400 text-sm">Tidak ada data ditemukan</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPage={setPage} total={filtered.length} perPage={perPage} />

      {modal && (
        <Modal title={modal === 'add' ? 'Tambah Dosen' : 'Edit Dosen'} onClose={() => setModal(null)}>
          <FormDosen form={form} setForm={setForm} onSave={save} onCancel={() => setModal(null)} />
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={<>Anda akan menghapus data dosen <span className="font-semibold text-slate-800">{deleteTarget.nama}</span>. Tindakan ini tidak dapat dibatalkan.</>}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}

function FormDosen({ form, setForm, onSave, onCancel }) {
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <div className="space-y-4">
      {[
        ['NIP', 'nip', '198501012010011001'],
        ['Nama Lengkap', 'nama', 'Dr. Budi Santoso, M.Kom.'],
        ['Jurusan', 'jurusan', 'Teknik Informatika'],
        ['Jabatan', 'jabatan', 'Lektor Kepala'],
      ].map(([label, key, placeholder]) => (
        <div key={key}>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
          <input value={form[key]} onChange={set(key)} placeholder={placeholder} className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition" />
        </div>
      ))}
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">Batal</button>
        <button onClick={onSave} className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">Simpan</button>
      </div>
    </div>
  );
}
