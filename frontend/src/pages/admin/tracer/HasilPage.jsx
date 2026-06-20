import { useEffect, useState } from "react";
import { Search, ClipboardList, CheckCircle, XCircle } from "lucide-react";
import { getMonitoring, getPeriods } from "../../../services/tracerService";
import { getJurusan } from "../../../services/jurusanService";
import { toast } from "react-toastify";

export default function HasilPage() {
  const [results, setResults] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [jurusanList, setJurusanList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    periodId: "",
    jurusanId: "",
    status: "",
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

      // Cari default active period
      const active = periodList.find((p) => p.status === "Aktif");
      const defaultPeriodId = active ? active.id : (periodList[0]?.id || "");
      
      setFilter((prev) => ({
        ...prev,
        periodId: prev.periodId || defaultPeriodId,
      }));

      // Fetch monitoring results
      const monitorRes = await getMonitoring({
        periodId: filter.periodId || defaultPeriodId,
        jurusanId: filter.jurusanId,
        status: filter.status,
      });
      setResults(monitorRes.data.data);
    } catch {
      toast.error("Gagal memuat data monitoring");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter.periodId, filter.jurusanId, filter.status]);

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filtered = results.filter((r) =>
    r.nama.toLowerCase().includes(search.toLowerCase()) ||
    r.nim.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Monitoring Hasil Tracer Study</h1>
          <p className="page-subtitle">Pantau alumni yang sudah atau belum mengisi kuisioner tracer study</p>
        </div>
      </div>

      {/* Filter Card */}
      <div className="card mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
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

          <div>
            <label className="form-label">Status Pengisian</label>
            <select
              name="status"
              value={filter.status}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">Semua Status</option>
              <option value="Sudah Mengisi">Sudah Mengisi</option>
              <option value="Belum Mengisi">Belum Mengisi</option>
            </select>
          </div>

          <div>
            <label className="form-label">Cari Nama / NIM</label>
            <input
              type="text"
              placeholder="Cari..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
            />
          </div>
        </div>
      </div>

      {/* Results Card */}
      <div className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Alumni</th>
                <th>NIM</th>
                <th>Jurusan / Program Studi</th>
                <th>Status Pengisian</th>
                <th>Tanggal Kirim</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400">Memuat data...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400">Tidak ada data alumni</td></tr>
              ) : (
                filtered.map((r, idx) => (
                  <tr key={r.id}>
                    <td className="text-slate-400">{idx + 1}</td>
                    <td className="font-semibold text-slate-800">{r.nama}</td>
                    <td className="font-mono text-sm">{r.nim}</td>
                    <td className="text-slate-500 text-sm">
                      {r.jurusan ? `${r.jurusan.namaJurusan} / ${r.jurusan.namaProdi}` : "-"}
                    </td>
                    <td>
                      <span className={`badge ${r.statusTracer === "Sudah Mengisi" ? "badge-green" : "badge-slate"}`}>
                        {r.statusTracer === "Sudah Mengisi" ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle size={12} />
                            <span>Sudah Mengisi</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <XCircle size={12} />
                            <span>Belum Mengisi</span>
                          </div>
                        )}
                      </span>
                    </td>
                    <td className="text-slate-500 text-sm">
                      {r.tanggalSubmit
                        ? new Date(r.tanggalSubmit).toLocaleString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>
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
