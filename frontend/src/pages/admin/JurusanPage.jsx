import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, BookOpen, Search, X } from "lucide-react";
import { getJurusan, createJurusan, updateJurusan, deleteJurusan } from "../../services/jurusanService";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";

export default function JurusanPage() {
  const [jurusanList, setJurusanList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({ open: false, mode: "create", data: null });
  const [form, setForm] = useState({
    namaJurusan: "",
    namaProdi: "",
    jenjang: "D4",
    akreditasi: "Baik Sekali",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const fetchJurusan = async () => {
    try {
      const res = await getJurusan();
      setJurusanList(res.data.data);
    } catch {
      toast.error("Gagal memuat data jurusan");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJurusan();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreate = () => {
    setForm({
      namaJurusan: "",
      namaProdi: "",
      jenjang: "D4",
      akreditasi: "Baik Sekali",
    });
    setModal({ open: true, mode: "create", data: null });
  };

  const openEdit = (jurusan) => {
    setForm({
      namaJurusan: jurusan.namaJurusan,
      namaProdi: jurusan.namaProdi,
      jenjang: jurusan.jenjang || "D4",
      akreditasi: jurusan.akreditasi || "Baik Sekali",
    });
    setModal({ open: true, mode: "edit", data: jurusan });
  };

  const closeModal = () => setModal({ open: false, mode: "create", data: null });

  const handleSave = async () => {
    if (!form.namaJurusan.trim()) {
      toast.error("Nama jurusan wajib diisi");
      return;
    }
    if (!form.namaProdi.trim()) {
      toast.error("Nama program studi wajib diisi");
      return;
    }

    setIsSaving(true);
    try {
      if (modal.mode === "create") {
        await createJurusan(form);
        toast.success("Jurusan / Prodi berhasil ditambahkan");
      } else {
        await updateJurusan(modal.data.id, form);
        toast.success("Jurusan / Prodi berhasil diupdate");
      }
      closeModal();
      fetchJurusan();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (jurusan) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Jurusan / Program Studi",
      message: `Apakah Anda yakin ingin menghapus jurusan/prodi "${jurusan.namaJurusan} - ${jurusan.namaProdi}"?`,
      onConfirm: async () => {
        try {
          await deleteJurusan(jurusan.id);
          toast.success("Jurusan / Prodi berhasil dihapus");
          fetchJurusan();
        } catch (err) {
          toast.error(err.response?.data?.message || "Gagal menghapus");
        }
      },
    });
  };

  const filtered = jurusanList.filter((j) =>
    j.namaJurusan.toLowerCase().includes(search.toLowerCase()) ||
    j.namaProdi.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Jurusan & Program Studi</h1>
          <p className="page-subtitle">Kelola data jurusan, program studi, jenjang, dan akreditasi</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} />
          Tambah Jurusan / Prodi
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
              placeholder="Cari jurusan atau prodi..."
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
                <th>Jurusan</th>
                <th>Program Studi</th>
                <th>Jenjang</th>
                <th>Akreditasi</th>
                <th>Jumlah Alumni</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="text-center py-8 text-slate-400">Memuat...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-slate-400">Tidak ada data</td></tr>
              ) : (
                filtered.map((jurusan, idx) => (
                  <tr key={jurusan.id}>
                    <td className="text-slate-400">{idx + 1}</td>
                    <td className="font-semibold text-slate-700">{jurusan.namaJurusan}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <BookOpen size={15} className="text-teal-600" />
                        <span className="font-medium text-slate-900">{jurusan.namaProdi}</span>
                      </div>
                    </td>
                    <td className="text-slate-600 font-mono text-sm">{jurusan.jenjang || "-"}</td>
                    <td>
                      <span className="badge badge-purple">{jurusan.akreditasi || "-"}</span>
                    </td>
                    <td>
                      <span className="badge badge-blue">{jurusan._count?.alumni || 0} alumni</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(jurusan)} className="btn-secondary py-1.5 px-3">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(jurusan)} className="btn-danger py-1.5 px-3">
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
                {modal.mode === "create" ? "Tambah Jurusan / Prodi" : "Edit Jurusan / Prodi"}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="form-label">Nama Jurusan</label>
                <input
                  type="text"
                  name="namaJurusan"
                  value={form.namaJurusan}
                  onChange={handleChange}
                  placeholder="Contoh: Teknik Elektro"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Nama Program Studi</label>
                <input
                  type="text"
                  name="namaProdi"
                  value={form.namaProdi}
                  onChange={handleChange}
                  placeholder="Contoh: D4 Teknik Informatika"
                  className="form-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Jenjang</label>
                  <select
                    name="jenjang"
                    value={form.jenjang}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="D3">D3</option>
                    <option value="D4">D4</option>
                    <option value="S1">S1</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Akreditasi</label>
                  <select
                    name="akreditasi"
                    value={form.akreditasi}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="Unggul">Unggul</option>
                    <option value="Baik Sekali">Baik Sekali</option>
                    <option value="Baik">Baik</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button onClick={closeModal} className="btn-secondary">Batal</button>
              <button onClick={handleSave} disabled={isSaving} className="btn-primary bg-teal-600 hover:bg-teal-500">
                {isSaving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
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
