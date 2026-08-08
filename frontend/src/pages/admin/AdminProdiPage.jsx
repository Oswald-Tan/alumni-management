import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, X, ShieldAlert } from "lucide-react";
import { getAdminProdi, createAdminProdi, updateAdminProdi, deleteAdminProdi } from "../../services/adminProdiService";
import { getJurusan } from "../../services/jurusanService";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";

export default function AdminProdiPage() {
  const [adminList, setAdminList] = useState([]);
  const [jurusanList, setJurusanList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({ open: false, mode: "create", data: null });
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    jurusanId: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [adminsRes, jurusanRes] = await Promise.all([
        getAdminProdi(),
        getJurusan(),
      ]);
      setAdminList(adminsRes.data.data);
      setJurusanList(jurusanRes.data.data);
    } catch {
      toast.error("Gagal memuat data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreate = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      jurusanId: jurusanList[0]?.id || "",
    });
    setModal({ open: true, mode: "create", data: null });
  };

  const openEdit = (admin) => {
    setForm({
      name: admin.name,
      email: admin.email,
      password: "", // Leave blank for no change
      jurusanId: admin.jurusanId || "",
    });
    setModal({ open: true, mode: "edit", data: admin });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || (modal.mode === "create" && !form.password) || !form.jurusanId) {
      toast.error("Semua field wajib diisi");
      return;
    }

    setIsSaving(true);
    try {
      if (modal.mode === "create") {
        await createAdminProdi(form);
        toast.success("Admin Prodi berhasil ditambahkan");
      } else {
        await updateAdminProdi(modal.data.id, form);
        toast.success("Admin Prodi berhasil diperbarui");
      }
      setModal({ open: false, mode: "create", data: null });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id, name) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Admin Prodi",
      message: `Apakah Anda yakin ingin menghapus akun Admin Prodi "${name}"?`,
      onConfirm: async () => {
        try {
          await deleteAdminProdi(id);
          toast.success("Admin Prodi berhasil dihapus");
          fetchData();
        } catch (err) {
          toast.error(err.response?.data?.message || "Gagal menghapus");
        }
      },
    });
  };

  const filteredAdmins = adminList.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Kelola Admin Prodi</h1>
          <p className="page-subtitle">Manajemen akun admin program studi untuk tracer study prodi masing-masing</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} />
          Tambah Admin Prodi
        </button>
      </div>

      {/* Search & Table Card */}
      <div className="card">
        <div className="flex gap-2 mb-4 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama / email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-9"
          />
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Program Studi Terikat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-8 text-slate-400">Memuat data...</td></tr>
              ) : filteredAdmins.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-slate-400">Tidak ada admin prodi</td></tr>
              ) : (
                filteredAdmins.map((a, idx) => (
                  <tr key={a.id}>
                    <td className="text-slate-400">{idx + 1}</td>
                    <td className="font-semibold text-slate-800">{a.name}</td>
                    <td className="font-mono text-sm">{a.email}</td>
                    <td className="text-slate-500 text-sm">
                      {a.jurusan ? `${a.jurusan.namaJurusan} / ${a.jurusan.namaProdi}` : "-"}
                    </td>
                    <td>
                      <div className="flex gap-1.5">
                        <button onClick={() => openEdit(a)} className="btn-secondary py-1.5 px-3" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(a.id, a.name)}
                          className="btn-danger py-1.5 px-3"
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Create/Edit */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 mx-4">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800">
                {modal.mode === "create" ? "Tambah Admin Prodi" : "Edit Admin Prodi"}
              </h2>
              <button onClick={() => setModal({ open: false, mode: "create", data: null })} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Contoh: Admin Informatika"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Contoh: admin.if@polimdo.ac.id"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">
                  Password {modal.mode === "edit" && <span className="text-xs text-slate-400 font-normal">(Kosongkan jika tidak diubah)</span>}
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  className="form-input"
                  required={modal.mode === "create"}
                />
              </div>

              <div>
                <label className="form-label">Program Studi Terikat</label>
                <select
                  name="jurusanId"
                  value={form.jurusanId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  {jurusanList.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.namaJurusan} / {j.namaProdi} ({j.jenjang})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModal({ open: false, mode: "create", data: null })}
                  className="btn-secondary"
                >
                  Batal
                </button>
                <button type="submit" disabled={isSaving} className="btn-primary">
                  {isSaving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Hapus"
        roleTheme="red"
      />
    </div>
  );
}
