import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, BookOpen, Search, X } from "lucide-react";
import { getProdi, createProdi, updateProdi, deleteProdi } from "../../services/prodiService";
import { toast } from "react-toastify";

export default function ProgramStudiPage() {
  const [prodiList, setProdiList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({ open: false, mode: "create", data: null });
  const [formNama, setFormNama] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchProdi = async () => {
    try {
      const res = await getProdi();
      setProdiList(res.data.data);
    } catch {
      toast.error("Gagal memuat data program studi");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProdi(); }, []);

  const openCreate = () => {
    setFormNama("");
    setModal({ open: true, mode: "create", data: null });
  };

  const openEdit = (prodi) => {
    setFormNama(prodi.namaProdi);
    setModal({ open: true, mode: "edit", data: prodi });
  };

  const closeModal = () => setModal({ open: false, mode: "create", data: null });

  const handleSave = async () => {
    if (!formNama.trim()) { toast.error("Nama program studi wajib diisi"); return; }
    setIsSaving(true);
    try {
      if (modal.mode === "create") {
        await createProdi({ namaProdi: formNama });
        toast.success("Program studi berhasil ditambahkan");
      } else {
        await updateProdi(modal.data.id, { namaProdi: formNama });
        toast.success("Program studi berhasil diupdate");
      }
      closeModal();
      fetchProdi();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (prodi) => {
    if (!confirm(`Hapus program studi "${prodi.namaProdi}"?`)) return;
    try {
      await deleteProdi(prodi.id);
      toast.success("Program studi berhasil dihapus");
      fetchProdi();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus");
    }
  };

  const filtered = prodiList.filter((p) =>
    p.namaProdi.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Program Studi</h1>
          <p className="page-subtitle">Kelola data program studi</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} />
          Tambah Prodi
        </button>
      </div>

      {/* Card */}
      <div className="card">
        {/* Search */}
        <div className="mb-4">
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari program studi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-9"
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Program Studi</th>
                <th>Jumlah Alumni</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} className="text-center py-8 text-slate-400">Memuat...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-slate-400">Tidak ada data</td></tr>
              ) : (
                filtered.map((prodi, idx) => (
                  <tr key={prodi.id}>
                    <td className="text-slate-400">{idx + 1}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <BookOpen size={15} className="text-blue-500" />
                        <span className="font-medium">{prodi.namaProdi}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-blue">{prodi._count?.alumni || 0} alumni</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(prodi)} className="btn-secondary py-1.5 px-3">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(prodi)} className="btn-danger py-1.5 px-3">
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

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">
                {modal.mode === "create" ? "Tambah Program Studi" : "Edit Program Studi"}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="mb-4">
              <label className="form-label">Nama Program Studi</label>
              <input
                type="text"
                value={formNama}
                onChange={(e) => setFormNama(e.target.value)}
                placeholder="Contoh: D4 Teknik Informatika"
                className="form-input"
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                autoFocus
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={closeModal} className="btn-secondary">Batal</button>
              <button onClick={handleSave} disabled={isSaving} className="btn-primary">
                {isSaving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
