import { useEffect, useState } from 'react';
import { api } from '../api';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast, ToastContainer } from '../components/Toast';
import { IconPlus } from '../components/Icons';
import { useTableControls, TableControls, Pagination } from '../components/TableControls';

const empty = { username: '', password: '', role: 'mahasiswa', ref_id: '' };
const roleLabel = { admin: 'Admin', dosen: 'Dosen', mahasiswa: 'Mahasiswa' };
const roleBadge = { admin: 'bg-violet-50 text-violet-700', dosen: 'bg-blue-50 text-blue-700', mahasiswa: 'bg-emerald-50 text-emerald-700' };

export default function UsersPage() {
  const [list, setList] = useState([]);
  const [dosenList, setDosenList] = useState([]);
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toasts, show } = useToast();

  const load = () => Promise.all([api.get('/users'), api.get('/dosen'), api.get('/mahasiswa')])
    .then(([u, d, m]) => { setList(u); setDosenList(d); setMahasiswaList(m); });

  useEffect(() => { load(); }, []);

  const { search, setSearch, filter, setFilter, filterOptions, page, setPage, perPage, setPerPage, paginated, filtered, totalPages } =
    useTableControls(list, ['username', 'role'], 'role');

  const openAdd = () => { setForm(empty); setModal('add'); };
  const openEdit = (u) => { setForm({ username: u.username, password: '', role: u.role, ref_id: u.ref_id ?? '' }); setEditId(u.id); setModal('edit'); };

  const save = async () => {
    try {
      if (modal === 'add') { await api.post('/users', form); show('Akun berhasil dibuat'); }
      else { await api.put(`/users/${editId}`, { role: form.role, ref_id: form.ref_id }); show('Role berhasil diperbarui'); }
      setModal(null); load();
    } catch (err) { show(err.message, 'error'); }
  };

  const confirmDelete = async () => {
    await api.del(`/users/${deleteTarget.id}`);
    setDeleteTarget(null); show('Akun berhasil dihapus', 'error'); load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Manajemen Akun</h2>
          <p className="text-sm text-slate-400 mt-0.5">{list.length} akun terdaftar</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm">
          <IconPlus /> Tambah Akun
        </button>
      </div>

      <TableControls
        search={search} onSearch={setSearch}
        filter={filter} onFilter={setFilter}
        filterOptions={filterOptions} filterLabel="Role"
        perPage={perPage} onPerPage={(v) => { setPerPage(v); setPage(1); }}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['Username', 'Role', 'Terhubung ke', 'Aksi'].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginated.map((u) => {
              const linked = u.role === 'dosen'
                ? dosenList.find((d) => d.id === u.ref_id)?.nama
                : u.role === 'mahasiswa'
                ? mahasiswaList.find((m) => m.id === u.ref_id)?.nama
                : null;
              return (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-medium text-slate-800">{u.username}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleBadge[u.role]}`}>{roleLabel[u.role]}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-sm">{linked ?? <span className="text-slate-300 italic text-xs">—</span>}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(u)} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Edit Role</button>
                      <button onClick={() => setDeleteTarget({ id: u.id, nama: u.username })} className="text-red-400 hover:text-red-600 text-xs font-medium">Hapus</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {paginated.length === 0 && <tr><td colSpan={4} className="px-5 py-12 text-center text-slate-400 text-sm">Tidak ada data ditemukan</td></tr>}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPage={setPage} total={filtered.length} perPage={perPage} />

      {modal && (
        <Modal title={modal === 'add' ? 'Tambah Akun' : 'Edit Role'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            {modal === 'add' && (
              <>
                <Field label="Username" value={form.username} onChange={(v) => setForm((f) => ({ ...f, username: v }))} placeholder="contoh: budi.santoso" />
                <Field label="Password" type="password" value={form.password} onChange={(v) => setForm((f) => ({ ...f, password: v }))} placeholder="Min. 6 karakter" />
              </>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Role</label>
              <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value, ref_id: '' }))}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="admin">Admin</option>
                <option value="dosen">Dosen</option>
                <option value="mahasiswa">Mahasiswa</option>
              </select>
            </div>
            {form.role === 'dosen' && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Hubungkan ke Dosen</label>
                <select value={form.ref_id} onChange={(e) => setForm((f) => ({ ...f, ref_id: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  <option value="">-- Pilih Dosen --</option>
                  {dosenList.map((d) => <option key={d.id} value={d.id}>{d.nama}</option>)}
                </select>
              </div>
            )}
            {form.role === 'mahasiswa' && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Hubungkan ke Mahasiswa</label>
                <select value={form.ref_id} onChange={(e) => setForm((f) => ({ ...f, ref_id: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  <option value="">-- Pilih Mahasiswa --</option>
                  {mahasiswaList.map((m) => <option key={m.id} value={m.id}>{m.nama} ({m.nim})</option>)}
                </select>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setModal(null)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">Batal</button>
              <button onClick={save} className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium">Simpan</button>
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={<>Akun <span className="font-semibold text-slate-800">{deleteTarget.nama}</span> akan dihapus permanen.</>}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" />
    </div>
  );
}
