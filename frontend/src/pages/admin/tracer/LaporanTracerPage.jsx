import { useEffect, useState } from "react";
import { FileDown, Users, CheckCircle, ClipboardList, Briefcase, HelpCircle, Clock, CheckSquare } from "lucide-react";
import { getReport, getPeriods } from "../../../services/tracerService";
import { getJurusan } from "../../../services/jurusanService";
import { API_URL } from "../../../config";
import { toast } from "react-toastify";

export default function LaporanTracerPage() {
  const [reportData, setReportData] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [jurusanList, setJurusanList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    periodId: "",
    jurusanId: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [periodsRes, jurusanRes] = await Promise.all([
        getPeriods(),
        getJurusan(),
      ]);

      const periodList = periodsRes.data.data;
      setPeriods(periodList);
      setJurusanList(jurusanRes.data.data);

      const active = periodList.find((p) => p.status === "Aktif");
      const defaultPeriodId = active ? active.id : (periodList[0]?.id || "");

      setFilter((prev) => ({
        ...prev,
        periodId: prev.periodId || defaultPeriodId,
      }));

      const reportRes = await getReport({
        periodId: filter.periodId || defaultPeriodId,
        jurusanId: filter.jurusanId,
      });
      setReportData(reportRes.data.data.report || []);
    } catch {
      toast.error("Gagal memuat data laporan akreditasi");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter.periodId, filter.jurusanId]);

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleExportExcel = () => {
    const query = new URLSearchParams({
      periodId: filter.periodId || "",
      jurusanId: filter.jurusanId || "",
    }).toString();
    window.open(`${API_URL}/tracer/export/excel?${query}`, "_blank");
  };

  // Hitung total akumulatif untuk summary cards
  const totalAlumni = reportData.reduce((acc, curr) => acc + curr.totalAlumni, 0);
  const totalTarget = reportData.reduce((acc, curr) => acc + curr.totalTarget, 0);
  const totalSudahMengisi = reportData.reduce((acc, curr) => acc + curr.sudahMengisi, 0);
  const totalBelumMengisi = reportData.reduce((acc, curr) => acc + curr.belumMengisi, 0);
  const totalBekerja = reportData.reduce((acc, curr) => acc + curr.bekerja, 0);
  const totalBelumBekerja = reportData.reduce((acc, curr) => acc + curr.belumBekerja, 0);
  const totalSesuaiBidang = reportData.reduce((acc, curr) => acc + curr.sesuaiBidang, 0);
  const totalTidakSesuaiBidang = reportData.reduce((acc, curr) => acc + curr.tidakSesuaiBidang, 0);

  const avgWaktuTunggu = reportData.length > 0 && totalBekerja > 0
    ? parseFloat((reportData.reduce((acc, curr) => acc + (curr.rataWaktuTunggu * curr.bekerja), 0) / totalBekerja).toFixed(1))
    : 0;

  const persentasePengisian = totalTarget > 0 ? Math.round((totalSudahMengisi / totalTarget) * 100) : 0;
  const persentaseBekerja = totalTarget > 0 ? Math.round((totalBekerja / totalTarget) * 100) : 0;
  const persentaseKesesuaian = totalBekerja > 0 ? Math.round((totalSesuaiBidang / totalBekerja) * 100) : 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Laporan Akreditasi & Tracer Study</h1>
          <p className="page-subtitle">Statistik rekapitulasi data tracer study untuk akreditasi program studi</p>
        </div>
        <button
          onClick={handleExportExcel}
          className="btn-primary flex items-center gap-2 bg-teal-700 hover:bg-teal-600 border-none cursor-pointer"
        >
          <FileDown size={16} />
          Ekspor Excel Tracer
        </button>
      </div>

      {/* Filter Card */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Periode Tracer</label>
            <select
              name="periodId"
              value={filter.periodId}
              onChange={handleFilterChange}
              className="form-select"
            >
              {periods.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.namaPeriode} {p.status === "Aktif" ? "(Aktif)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Jurusan / Program Studi</label>
            <select
              name="jurusanId"
              value={filter.jurusanId}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">Semua Jurusan / Prodi</option>
              {jurusanList.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.namaJurusan} / {j.namaProdi}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Pengisian */}
        <div className="stat-card">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
            <ClipboardList size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{totalSudahMengisi} <span className="text-sm font-normal text-slate-500">/ {totalTarget}</span></p>
            <p className="text-sm text-slate-500">Sudah Mengisi ({persentasePengisian}%)</p>
          </div>
        </div>

        {/* Card 2: Bekerja */}
        <div className="stat-card">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
            <Briefcase size={24} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{totalBekerja} <span className="text-sm font-normal text-slate-500">/ {totalSudahMengisi}</span></p>
            <p className="text-sm text-slate-500">Bekerja ({persentaseBekerja}%)</p>
          </div>
        </div>

        {/* Card 3: Kesesuaian */}
        <div className="stat-card">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
            <CheckSquare size={24} className="text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{totalSesuaiBidang} <span className="text-sm font-normal text-slate-500">/ {totalBekerja}</span></p>
            <p className="text-sm text-slate-500">Sesuai Bidang ({persentaseKesesuaian}%)</p>
          </div>
        </div>

        {/* Card 4: Rata Waktu Tunggu */}
        <div className="stat-card">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
            <Clock size={24} className="text-orange-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{avgWaktuTunggu} <span className="text-sm font-normal text-slate-500">Bulan</span></p>
            <p className="text-sm text-slate-500">Rata-rata Tunggu Kerja</p>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="card">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Statistik per Program Studi</h2>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Program Studi</th>
                <th>Akred</th>
                <th>Total Alumni</th>
                <th>Sudah Mengisi</th>
                <th>Persentase (%)</th>
                <th>Bekerja</th>
                <th>Sesuai Bidang</th>
                <th>Rata Tunggu (Bulan)</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={9} className="text-center py-8 text-slate-400">Memuat laporan...</td></tr>
              ) : reportData.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-8 text-slate-400">Tidak ada data laporan</td></tr>
              ) : (
                reportData.map((row, idx) => (
                  <tr key={row.jurusanId}>
                    <td className="text-slate-400">{idx + 1}</td>
                    <td className="font-semibold text-slate-800">{row.namaJurusan} - {row.namaProdi} ({row.jenjang})</td>
                    <td>
                      <span className="badge badge-purple">{row.akreditasi || "-"}</span>
                    </td>
                    <td className="text-center font-semibold">{row.totalAlumni}</td>
                    <td className="text-center">{row.sudahMengisi} <span className="text-xs text-slate-400">/ {row.totalTarget}</span></td>
                    <td className="text-center font-bold text-teal-600">{row.persentaseMengisi}%</td>
                    <td className="text-center">{row.bekerja}</td>
                    <td className="text-center font-semibold text-blue-600">
                      {row.sesuaiBidang} <span className="text-xs text-slate-400 font-normal">({row.bekerja > 0 ? Math.round((row.sesuaiBidang / row.bekerja) * 100) : 0}%)</span>
                    </td>
                    <td className="text-center font-mono font-bold text-orange-600">{row.rataWaktuTunggu} Bln</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
