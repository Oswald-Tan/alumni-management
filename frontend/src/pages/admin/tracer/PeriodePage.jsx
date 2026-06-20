import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Calendar, Settings, X } from "lucide-react";
import { getPeriods, createPeriod, updatePeriod, deletePeriod } from "../../../services/tracerService";
import { toast } from "react-toastify";
import ConfirmModal from "../../../components/ConfirmModal";

export default function PeriodePage() {
  const [periods, setPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: "create", data: null });
  const [form, setForm] = useState({
    namaPeriode: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    status: "Tidak Aktif",
    modePengisian: "Semua",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const fetchPeriods = async () => {
    try {
      const res = await getPeriods();
      setPeriods(res.data.data);
    } catch {
      toast.error("Gagal memuat data periode tracer");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriods();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreate = () => {
    setForm({
      namaPeriode: "",
      tanggalMulai: "",
      tanggalSelesai: "",
      status: "Tidak Aktif",
      modePengisian: "Semua",
    });
    setModal({ open: true, mode: "create", data: null });
  };

  const openEdit = (period) => {
    setForm({
      namaPeriode: period.namaPeriode,
      tanggalMulai: period.tanggalMulai ? period.tanggalMulai.split("T")[0] : "",
      tanggalSelesai: period.tanggalSelesai ? period.tanggalSelesai.split("T")[0] : "",
      status: period.status,
      modePengisian: period.modePengisian,
    });
    setModal({ open: true, mode: "edit", data: period });
  };

  const closeModal = () => setModal({ open: false, mode: "create", data: null });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.namaPeriode.trim() || !form.tanggalMulai || !form.tanggalSelesai) {
      toast.error("Semua field wajib diisi");
      return;
    }

    setIsSaving(true);
    try {
      if (modal.mode === "create") {
        await createPeriod(form);
        toast.success("Periode tracer berhasil dibuat");
      } else {
        await updatePeriod(modal.data.id, form);
        toast.success("Periode tracer berhasil diupdate");
      }
      closeModal();
      fetchPeriods();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (period) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Periode Tracer",
      message: `Apakah Anda yakin ingin menghapus periode tracer "${period.namaPeriode}"? Semua data jawaban terkait akan terhapus!`,
      onConfirm: async () => {
        try {
          await deletePeriod(period.id);
          toast.success("Periode tracer berhasil dihapus");
          fetchPeriods();
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
          <h1 className="page-title">Periode Tracer Study</h1>
          <p className="page-subtitle">Atur periode pengisian tracer study dan aturan NIM ganjil/genap</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Buat Periode Baru
        </button>
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Periode</th>
                <th>Mulai</th>
                <th>Selesai</th>
                <th>Target NIM</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="text-center py-8 text-slate-400">Memuat...</td></tr>
              ) : periods.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-slate-400">Tidak ada periode tracer</td></tr>
              ) : (
                periods.map((p, idx) => (
                  <tr key={p.id}>
                    <td className="text-slate-400">{idx + 1}</td>
                    <td className="font-semibold text-slate-800">{p.namaPeriode}</td>
                    <td className="text-slate-600">
                      {new Date(p.tanggalMulai).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="text-slate-600">
                      {new Date(p.tanggalSelesai).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td>
                      <span className={`badge ${p.modePengisian === "Semua" ? "badge-blue" : "badge-purple"}`}>
                        {p.modePengisian === "Semua" ? "Semua NIM" : `NIM ${p.modePengisian}`}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${p.status === "Aktif" ? "badge-green" : "badge-slate"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="btn-secondary py-1.5 px-3">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(p)} className="btn-danger py-1.5 px-3">
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
                {modal.mode === "create" ? "Buat Periode Tracer" : "Edit Periode Tracer"}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="form-label">Nama Periode</label>
                <input
                  type="text"
                  name="namaPeriode"
                  value={form.namaPeriode}
                  onChange={handleChange}
                  placeholder="Contoh: Tracer Study 2026"
                  className="form-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Tanggal Mulai</label>
                  <input
                    type="date"
                    name="tanggalMulai"
                    value={form.tanggalMulai}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Tanggal Selesai</label>
                  <input
                    type="date"
                    name="tanggalSelesai"
                    value={form.tanggalSelesai}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Mode Pengisian (NIM)</label>
                  <select
                    name="modePengisian"
                    value={form.modePengisian}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="Semua">Semua Alumni</option>
                    <option value="Ganjil">Digit NIM Ganjil</option>
                    <option value="Genap">Digit NIM Genap</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Status Periode</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="Tidak Aktif">Tidak Aktif</option>
                    <option value="Aktif">Aktif</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t">
                <button type="button" onClick={closeModal} className="btn-secondary">Batal</button>
                <button type="submit" disabled={isSaving} className="btn-primary">
                  {isSaving ? "Menyimpan..." : "Simpan Periode"}
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
