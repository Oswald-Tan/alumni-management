import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Eye, X, Plus, Pencil, Trash2 } from "lucide-react";
import { getAlumni, deleteAlumni } from "../../services/alumniService";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";

const statusLabel = {
  TERDAFTAR_WISUDA: "Terdaftar Wisuda",
  LULUS: "Lulus",
  IJAZAH_TERBIT: "Ijazah Terbit",
  IJAZAH_DIAMBIL: "Ijazah Diambil",
};

const statusBadge = {
  TERDAFTAR_WISUDA: "badge-blue",
  LULUS: "badge-slate",
  IJAZAH_TERBIT: "badge-purple",
  IJAZAH_DIAMBIL: "badge-green",
};

export default function AdminProdiAlumniPage() {
  const [alumni, setAlumni] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });
  const limit = 10;

  const fetchAlumni = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAlumni({ search, page: pagination.page, limit });
      setAlumni(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      toast.error("Gagal memuat data alumni");
    } finally {
      setIsLoading(false);
    }
  }, [search, pagination.page]);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleDelete = (id, name) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Alumni",
      message: `Apakah Anda yakin ingin menghapus data alumni "${name}"? Tindakan ini tidak dapat dibatalkan.`,
      onConfirm: async () => {
        try {
          await deleteAlumni(id);
          toast.success("Data alumni berhasil dihapus");
          fetchAlumni();
        } catch (err) {
          toast.error(err.response?.data?.message || "Gagal menghapus alumni");
        }
      },
    });
  };

  return (
    <div className="p-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">Data Alumni Prodi</h1>
          <p className="page-subtitle">Total {pagination.total} alumni terdaftar di program studi Anda</p>
        </div>
        <Link to="/admin-prodi/alumni/create" className="btn-primary bg-emerald-600 hover:bg-emerald-700">
          <Plus size={16} />
          Tambah Alumni
        </Link>
      </div>

      <div className="card">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama / NIM..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="form-input pl-9"
            />
          </div>
          <button type="submit" className="btn-primary bg-emerald-600 hover:bg-emerald-700">Cari</button>
        </form>

        {/* Table */}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Foto</th>
                <th>Nama</th>
                <th>NIM</th>
                <th>Jurusan / Prodi</th>
                <th>Kelulusan</th>
                <th>No Ijazah</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={9} className="text-center py-10 text-slate-400">Memuat...</td></tr>
              ) : alumni.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-10 text-slate-400">Tidak ada data alumni</td></tr>
              ) : (
                alumni.map((a, idx) => (
                  <tr key={a.id}>
                    <td className="text-slate-400">{(pagination.page - 1) * limit + idx + 1}</td>
                    <td>
                      {a.foto ? (
                        <img
                          src={`http://localhost:5000/uploads/foto/${a.foto}`}
                          alt={a.nama}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {a.nama?.charAt(0) || "?"}
                        </div>
                      )}
                    </td>
                    <td className="font-semibold">{a.nama}</td>
                    <td className="font-mono text-sm">{a.nim}</td>
                    <td className="text-slate-500 text-sm">
                      {a.jurusan ? `${a.jurusan.namaJurusan} / ${a.jurusan.namaProdi}` : "-"}
                    </td>
                    <td className="text-slate-500 text-sm">
                      {a.tanggalKelulusan
                        ? new Date(a.tanggalKelulusan).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td className="font-mono text-sm">{a.nomorIjazah || "-"}</td>
                    <td>
                      <span className={`badge ${statusBadge[a.statusAlumni]}`}>
                        {statusLabel[a.statusAlumni]}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setSelectedAlumni(a)}
                          className="btn-secondary py-1.5 px-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none"
                          title="Detail"
                        >
                          <Eye size={14} />
                        </button>
                        <Link
                          to={`/admin-prodi/alumni/edit/${a.id}`}
                          className="btn-secondary py-1.5 px-3 hover:bg-slate-200 border-none flex items-center justify-center"
                          title="Edit"
                        >
                          <Pencil size={14} className="text-slate-600" />
                        </Link>
                        <button
                          onClick={() => handleDelete(a.id, a.nama)}
                          className="btn-danger py-1.5 px-3 bg-red-50 text-red-600 hover:bg-red-100 border-none"
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

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Halaman {pagination.page} dari {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page === 1}
                className="btn-secondary py-1.5 px-3 disabled:opacity-40"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="btn-secondary py-1.5 px-3 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedAlumni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 mx-4">
            <div className="flex items-center justify-between mb-4 border-b border-slate-150 pb-3">
              <h2 className="text-lg font-bold text-slate-800">Detail Alumni</h2>
              <button onClick={() => setSelectedAlumni(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Foto Alumni */}
              <div className="flex justify-center mb-2">
                {selectedAlumni.foto ? (
                  <img
                    src={`http://localhost:5000/uploads/foto/${selectedAlumni.foto}`}
                    alt={selectedAlumni.nama}
                    className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-slate-200">
                    {selectedAlumni.nama?.charAt(0) || "?"}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Nama Lengkap</p>
                  <p className="text-sm font-medium text-slate-800">{selectedAlumni.nama}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">NIM</p>
                  <p className="text-sm font-mono font-medium text-slate-800">{selectedAlumni.nim}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Jurusan / Program Studi</p>
                  <p className="text-sm font-medium text-slate-800">
                    {selectedAlumni.jurusan ? `${selectedAlumni.jurusan.namaJurusan} / ${selectedAlumni.jurusan.namaProdi}` : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Status Arsip</p>
                  <span className={`badge ${statusBadge[selectedAlumni.statusAlumni]} mt-1`}>
                    {statusLabel[selectedAlumni.statusAlumni]}
                  </span>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Tanggal Kelulusan</p>
                  <p className="text-sm text-slate-700">
                    {selectedAlumni.tanggalKelulusan
                      ? new Date(selectedAlumni.tanggalKelulusan).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Nomor Ijazah</p>
                  <p className="text-sm font-mono text-slate-700">{selectedAlumni.nomorIjazah || "-"}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-3 border-t border-slate-100">
              <button onClick={() => setSelectedAlumni(null)} className="btn-secondary">
                Tutup
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
