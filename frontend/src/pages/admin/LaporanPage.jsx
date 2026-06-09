import { useEffect, useState } from "react";
import { FileDown, Printer, Users, BookOpen, Award, CheckCircle } from "lucide-react";
import { getAlumni } from "../../services/alumniService";
import { getDashboard } from "../../services/dashboardService";
import { getProdi } from "../../services/prodiService";
import { API_URL } from "../../config";
import { toast } from "react-toastify";

const statusLabel = {
  TERDAFTAR_WISUDA: "Terdaftar Wisuda",
  LULUS: "Lulus",
  IJAZAH_TERBIT: "Ijazah Terbit",
  IJAZAH_DIAMBIL: "Ijazah Diambil",
};

export default function LaporanPage() {
  const [alumni, setAlumni] = useState([]);
  const [prodiList, setProdiList] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({ prodiId: "", year: "", statusIjazah: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alumniRes, dashRes, prodiRes] = await Promise.all([
          getAlumni({ limit: 1000 }),
          getDashboard(),
          getProdi(),
        ]);
        setAlumni(alumniRes.data.data);
        setDashboard(dashRes.data.data);
        setProdiList(prodiRes.data.data);
      } catch {
        toast.error("Gagal memuat data laporan");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePrint = () => {
    const query = new URLSearchParams({
      prodiId: filter.prodiId || "",
      year: filter.year || "",
      statusIjazah: filter.statusIjazah || "",
    }).toString();
    window.open(`${API_URL}/alumni/export/pdf?${query}`, "_blank");
  };

  const handleExportExcel = () => {
    const query = new URLSearchParams({
      prodiId: filter.prodiId || "",
      year: filter.year || "",
      statusIjazah: filter.statusIjazah || "",
    }).toString();
    window.open(`${API_URL}/alumni/export/excel?${query}`, "_blank");
  };

  // Get unique graduation years
  const uniqueYears = Array.from(
    new Set(
      alumni
        .map((a) => (a.tanggalKelulusan ? new Date(a.tanggalKelulusan).getFullYear() : null))
        .filter(Boolean)
    )
  ).sort((a, b) => b - a);

  const filtered = alumni.filter((a) => {
    if (filter.prodiId && a.programStudiId !== parseInt(filter.prodiId)) return false;
    if (filter.year) {
      const y = a.tanggalKelulusan ? new Date(a.tanggalKelulusan).getFullYear() : null;
      if (y !== parseInt(filter.year)) return false;
    }
    if (filter.statusIjazah) {
      const isTaken = !!a.tanggalPengambilanIjazah;
      if (filter.statusIjazah === "SUDAH" && !isTaken) return false;
      if (filter.statusIjazah === "BELUM" && isTaken) return false;
    }
    return true;
  });

  return (
    <div className="p-8">
      <div className="page-header print:hidden">
        <div>
          <h1 className="page-title">Laporan Alumni</h1>
          <p className="page-subtitle">Rekap dan ekspor data alumni untuk administrasi akademik</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportExcel} className="btn-secondary py-2.5 px-4 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none cursor-pointer">
            <FileDown size={16} />
            Ekspor Excel
          </button>
          <button onClick={handlePrint} className="btn-primary cursor-pointer">
            <Printer size={16} />
            Ekspor PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {dashboard && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="stat-card">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{dashboard.totalAlumni}</p>
              <p className="text-sm text-slate-500">Total Alumni</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
              <BookOpen size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{dashboard.totalProdi}</p>
              <p className="text-sm text-slate-500">Program Studi</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{dashboard.sudahAmbilIjazah}</p>
              <p className="text-sm text-slate-500">Ijazah Diambil</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
              <Award size={24} className="text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{dashboard.belumAmbilIjazah}</p>
              <p className="text-sm text-slate-500">Ijazah Belum Diambil</p>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="card mb-4 print:hidden">
        <div className="flex gap-4 items-end flex-wrap">
          <div>
            <label className="form-label">Tahun Kelulusan</label>
            <select
              value={filter.year}
              onChange={(e) => setFilter({ ...filter, year: e.target.value })}
              className="form-select w-40"
            >
              <option value="">Semua Tahun</option>
              {uniqueYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Program Studi</label>
            <select
              value={filter.prodiId}
              onChange={(e) => setFilter({ ...filter, prodiId: e.target.value })}
              className="form-select w-56"
            >
              <option value="">Semua Program Studi</option>
              {prodiList.map((p) => (
                <option key={p.id} value={p.id}>{p.namaProdi}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Pengambilan Ijazah</label>
            <select
              value={filter.statusIjazah}
              onChange={(e) => setFilter({ ...filter, statusIjazah: e.target.value })}
              className="form-select w-48"
            >
              <option value="">Semua Status</option>
              <option value="SUDAH">Sudah Ambil Ijazah</option>
              <option value="BELUM">Belum Ambil Ijazah</option>
            </select>
          </div>

          <button
            onClick={() => setFilter({ prodiId: "", year: "", statusIjazah: "" })}
            className="btn-secondary h-[42px]"
          >
            Reset Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card print:shadow-none print:border-none print:p-0">
        <div className="hidden print:block text-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Laporan Rekapitulasi Data Alumni</h2>
          <p className="text-sm text-slate-500">Politeknik Negeri Manado</p>
          <hr className="my-4 border-slate-300" />
        </div>

        <p className="text-sm text-slate-500 mb-4 print:hidden">
          Menampilkan {filtered.length} dari {alumni.length} alumni
        </p>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>NIM</th>
                <th>Program Studi</th>
                <th>Tanggal Kelulusan</th>
                <th>Nomor Ijazah</th>
                <th>Tanggal Pengambilan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="text-center py-10 text-slate-400">Memuat...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-slate-400">Tidak ada data alumni yang cocok</td></tr>
              ) : filtered.map((a, idx) => (
                <tr key={a.id}>
                  <td className="text-slate-400">{idx + 1}</td>
                  <td className="font-semibold">{a.nama}</td>
                  <td className="font-mono text-sm">{a.nim}</td>
                  <td className="text-slate-500 text-sm">{a.programStudi?.namaProdi}</td>
                  <td className="text-slate-500 text-sm">
                    {a.tanggalKelulusan ? new Date(a.tanggalKelulusan).toLocaleDateString("id-ID") : "-"}
                  </td>
                  <td className="font-mono text-sm">{a.nomorIjazah || "-"}</td>
                  <td className="text-slate-500 text-sm">
                    {a.tanggalPengambilanIjazah ? new Date(a.tanggalPengambilanIjazah).toLocaleDateString("id-ID") : "-"}
                  </td>
                  <td className="text-sm">{statusLabel[a.statusAlumni]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
