import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, HelpCircle, X, CheckCircle, Layers } from "lucide-react";
import { getQuestions, createQuestion, updateQuestion, deleteQuestion } from "../../../services/tracerService";
import { toast } from "react-toastify";
import ConfirmModal from "../../../components/ConfirmModal";

export default function PertanyaanPage() {
  const [questions, setQuestions] = useState([]);
  const [activeCategory, setActiveCategory] = useState("DIKTI"); // "DIKTI" | "IKU"
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: "create", data: null });
  const [form, setForm] = useState({
    pertanyaan: "",
    tipe: "radio",
    opsi: "",
    isRequired: true,
    urutan: 0,
    isActive: true,
    category: "DIKTI",
    section: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await getQuestions({ category: activeCategory });
      setQuestions(res.data.data);
    } catch {
      toast.error("Gagal memuat data pertanyaan kuisioner");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [activeCategory]);

  const handleChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const openCreate = () => {
    setForm({
      pertanyaan: "",
      tipe: "radio",
      opsi: "",
      isRequired: true,
      urutan: questions.length + 1,
      isActive: true,
      category: activeCategory,
      section: activeCategory === "IKU" ? "Bagian 1: Kompetensi Utama (Hard Skills)" : "Kuesioner Wajib",
    });
    setModal({ open: true, mode: "create", data: null });
  };

  const openEdit = (q) => {
    setForm({
      pertanyaan: q.pertanyaan,
      tipe: q.tipe,
      opsi: q.opsi || "",
      isRequired: q.isRequired,
      urutan: q.urutan,
      isActive: q.isActive,
      category: q.category || activeCategory,
      section: q.section || "",
    });
    setModal({ open: true, mode: "edit", data: q });
  };

  const closeModal = () => setModal({ open: false, mode: "create", data: null });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.pertanyaan.trim()) {
      toast.error("Teks pertanyaan wajib diisi");
      return;
    }
    if (["radio", "select"].includes(form.tipe) && !form.opsi.trim()) {
      toast.error("Untuk tipe pilihan, isi pilihan jawaban (pisahkan dengan koma)");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...form,
        opsi: ["radio", "select"].includes(form.tipe) ? form.opsi.trim() : null,
      };

      if (modal.mode === "create") {
        await createQuestion(payload);
        toast.success("Pertanyaan berhasil ditambahkan");
      } else {
        await updateQuestion(modal.data.id, payload);
        toast.success("Pertanyaan berhasil diupdate");
      }
      closeModal();
      fetchQuestions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (q) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Pertanyaan Kuisioner",
      message: `Apakah Anda yakin ingin menghapus pertanyaan "${q.pertanyaan}"?`,
      onConfirm: async () => {
        try {
          await deleteQuestion(q.id);
          toast.success("Pertanyaan berhasil dihapus");
          fetchQuestions();
        } catch (err) {
          toast.error(err.response?.data?.message || "Gagal menghapus");
        }
      },
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Pertanyaan Kuisioner Tracer Study</h1>
          <p className="page-subtitle">Kelola pertanyaan tracer per prodi untuk Kategori DIKTI (1 Tahun) dan IKU (1-5 Tahun)</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Tambah Pertanyaan {activeCategory}
        </button>
      </div>

      {/* Category Navigation Tabs */}
      <div className="flex border-b border-slate-200 mb-6 space-x-4">
        <button
          onClick={() => setActiveCategory("DIKTI")}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeCategory === "DIKTI"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Layers size={16} />
          Tracer DIKTI (1 Tahun)
        </button>

        <button
          onClick={() => setActiveCategory("IKU")}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeCategory === "IKU"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <CheckCircle size={16} />
          Tracer IKU (1-5 Tahun Berdasarkan CPL)
        </button>
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Urutan</th>
                <th>Section / Bagian</th>
                <th>Pertanyaan</th>
                <th>Lingkup Prodi</th>
                <th>Tipe</th>
                <th>Pilihan Jawaban</th>
                <th>Wajib</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={9} className="text-center py-8 text-slate-400">Memuat...</td></tr>
              ) : questions.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-8 text-slate-400">Tidak ada pertanyaan untuk kategori {activeCategory}</td></tr>
              ) : (
                questions.map((q) => (
                  <tr key={q.id}>
                    <td className="font-mono text-center font-bold text-slate-500 w-16">{q.urutan}</td>
                    <td className="text-xs font-semibold text-teal-700 bg-teal-50/50 rounded px-2 py-1 max-w-[140px] truncate">
                      {q.section || "Umum"}
                    </td>
                    <td className="font-medium text-slate-800 max-w-sm whitespace-normal break-words">
                      <div className="flex gap-2">
                        <HelpCircle size={16} className="text-teal-600 shrink-0 mt-0.5" />
                        <span>{q.pertanyaan}</span>
                      </div>
                    </td>
                    <td className="text-xs font-semibold text-slate-600">
                      {q.jurusan ? (
                        <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                          {q.jurusan.namaProdi}
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          Global (Semua Prodi)
                        </span>
                      )}
                    </td>
                    <td className="text-slate-600 text-sm font-semibold capitalize">{q.tipe === "textarea" ? "Text Panjang" : q.tipe}</td>
                    <td className="text-slate-500 text-xs truncate max-w-xs">{q.opsi || "-"}</td>
                    <td>
                      <span className={`badge ${q.isRequired ? "badge-blue" : "badge-slate"}`}>
                        {q.isRequired ? "Ya" : "Tidak"}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${q.isActive ? "badge-green" : "badge-slate"}`}>
                        {q.isActive ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(q)} className="btn-secondary py-1.5 px-3">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(q)} className="btn-danger py-1.5 px-3">
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
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-lg font-bold text-slate-800">
                {modal.mode === "create" ? `Tambah Pertanyaan (${activeCategory})` : `Edit Pertanyaan (${activeCategory})`}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="form-label">Kategori Tracer</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="DIKTI">Tracer DIKTI (1 Tahun)</option>
                  <option value="IKU">Tracer IKU (1-5 Tahun CPL)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Section / Sub-bagian Kuesioner</label>
                <input
                  type="text"
                  name="section"
                  value={form.section}
                  onChange={handleChange}
                  placeholder="Contoh: Bagian 1: Kompetensi Utama (Hard Skills)"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Teks Pertanyaan</label>
                <textarea
                  name="pertanyaan"
                  value={form.pertanyaan}
                  onChange={handleChange}
                  placeholder="Ketik teks pertanyaan..."
                  className="form-input h-20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Tipe Jawaban</label>
                  <select
                    name="tipe"
                    value={form.tipe}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="radio">Radio Button (Pilih Satu)</option>
                    <option value="select">Dropdown Select (Pilih Satu)</option>
                    <option value="checkbox">Checkbox (Bisa Pilih Banyak)</option>
                    <option value="text">Text Pendek</option>
                    <option value="textarea">Text Panjang</option>
                    <option value="label">Penjelasan / Label</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Urutan Tampil</label>
                  <input
                    type="number"
                    name="urutan"
                    value={form.urutan}
                    onChange={handleChange}
                    className="form-input"
                    min="0"
                    required
                  />
                </div>
              </div>

              {["radio", "select"].includes(form.tipe) && (
                <div>
                  <label className="form-label">Pilihan Jawaban (pisahkan dengan koma)</label>
                  <input
                    type="text"
                    name="opsi"
                    value={form.opsi}
                    onChange={handleChange}
                    placeholder="Contoh: Sangat Baik,Baik,Cukup,Kurang"
                    className="form-input"
                    required
                  />
                  <p className="text-xs text-slate-400 mt-1">Gunakan tanda koma (,) tanpa spasi ekstra sebagai pemisah</p>
                </div>
              )}

              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="isRequired"
                    checked={form.isRequired}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Wajib Diisi</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Status Aktif</span>
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t">
                <button type="button" onClick={closeModal} className="btn-secondary">Batal</button>
                <button type="submit" disabled={isSaving} className="btn-primary bg-teal-700 hover:bg-teal-600">
                  {isSaving ? "Menyimpan..." : "Simpan Pertanyaan"}
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
