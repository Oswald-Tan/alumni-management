import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, Eye, X } from "lucide-react";
import { getAlumni, deleteAlumni } from "../../services/alumniService";
import { toast } from "react-toastify";

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

export default function AlumniPage() {
  const [alumni, setAlumni] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlumni, setSelectedAlumni] = useState(null); // Detail modal state
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

  const handleDelete = async (id, nama) => {
    if (!confirm(`Hapus alumni "${nama}"? Data tidak dapat dikembalikan.`)) return;
    try {
      await deleteAlumni(id);
      toast.success("Alumni berhasil dihapus");
      fetchAlumni();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus");
    }
  };

  return (
    <div className="p-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">Data Alumni</h1>
          <p className="page-subtitle">Total {pagination.total} alumni terdaftar</p>
        </div>
        <Link to="/admin/alumni/create" className="btn-primary">
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
              placeholder="Cari nama / NIM / No Ijazah..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="form-input pl-9"
            />
          </div>
          <button type="submit" className="btn-primary">Cari</button>
        </form>

        {/* Table */}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>NIM</th>
                <th>Program Studi</th>
                <th>Kelulusan</th>
                <th>No Ijazah</th>
                <th>Pengambilan</th>
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
                    <td className="font-semibold">{a.nama}</td>
                    <td className="font-mono text-sm">{a.nim}</td>
                    <td className="text-slate-500 text-sm">{a.programStudi?.namaProdi}</td>
                    <td className="text-slate-500 text-sm">
                      {a.tanggalKelulusan
                        ? new Date(a.tanggalKelulusan).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td className="font-mono text-sm">{a.nomorIjazah || "-"}</td>
                    <td className="text-slate-500 text-sm">
                      {a.tanggalPengambilanIjazah
                        ? new Date(a.tanggalPengambilanIjazah).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      <span className={`badge ${statusBadge[a.statusAlumni]}`}>
                        {statusLabel[a.statusAlumni]}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setSelectedAlumni(a)}
                          className="btn-secondary py-1.5 px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 border-none"
                          title="Detail"
                        >
                          <Eye size={14} />
                        </button>
                        <Link to={`/admin/alumni/edit/${a.id}`} className="btn-secondary py-1.5 px-3" title="Edit">
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(a.id, a.nama)}
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
                  <p className="text-xs text-slate-400 font-semibold uppercase">Program Studi</p>
                  <p className="text-sm font-medium text-slate-800">{selectedAlumni.programStudi?.namaProdi || "-"}</p>
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
                      ? new Date(selectedAlumni.tanggalKelulusan).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Tanggal Wisuda</p>
                  <p className="text-sm text-slate-700">
                    {selectedAlumni.tanggalWisuda
                      ? new Date(selectedAlumni.tanggalWisuda).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Nomor Ijazah</p>
                  <p className="text-sm font-mono text-slate-700">{selectedAlumni.nomorIjazah || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Tanggal Pengambilan Ijazah</p>
                  <p className="text-sm text-slate-700">
                    {selectedAlumni.tanggalPengambilanIjazah
                      ? new Date(selectedAlumni.tanggalPengambilanIjazah).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "-"}
                  </p>
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
    </div>
  );
}
