import { useEffect, useState } from "react";
import { Search, ClipboardList, CheckCircle, XCircle, Eye, X, Download } from "lucide-react";
import { getMonitoring, getPeriods, getAlumniResponseDetail, exportTracerExcel } from "../../services/tracerService";
import { toast } from "react-toastify";

export default function HasilPage() {
  const [results, setResults] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    periodId: "",
    status: "",
    category: "",
  });
  const [detailModal, setDetailModal] = useState({
    open: false,
    alumniId: null,
    data: null,
    isLoading: false,
    activeTab: "DIKTI",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const periodsRes = await getPeriods();
      const periodList = periodsRes.data.data;
      setPeriods(periodList);

      const active = periodList.find((p) => p.status === "Aktif");
      const defaultPeriodId = active ? active.id : (periodList[0]?.id || "");
      
      setFilter((prev) => ({
        ...prev,
        periodId: prev.periodId || defaultPeriodId,
      }));

      const monitorRes = await getMonitoring({
        periodId: filter.periodId || defaultPeriodId,
        status: filter.status,
        category: filter.category,
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
  }, [filter.periodId, filter.status, filter.category]);

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleOpenDetail = async (alumniId) => {
    setDetailModal({ open: true, alumniId, data: null, isLoading: true, activeTab: "DIKTI" });
    try {
      const res = await getAlumniResponseDetail(alumniId, { periodId: filter.periodId });
      const data = res.data.data;
      const firstCat = data.responses[0]?.category || "DIKTI";
      setDetailModal({ open: true, alumniId, data, isLoading: false, activeTab: firstCat });
    } catch {
      toast.error("Gagal memuat detail jawaban alumni");
      setDetailModal({ open: false, alumniId: null, data: null, isLoading: false, activeTab: "DIKTI" });
    }
  };

  const [exportingType, setExportingType] = useState(null);

  const handleExportExcel = async (exportCategory) => {
    setExportingType(exportCategory);
    const catLabel = exportCategory === "ALL" ? "Gabungan (DIKTI & IKU)" : `Tracer ${exportCategory}`;
    try {
      toast.info(`Menyiapkan data export ${catLabel}...`);
      const response = await exportTracerExcel({
        category: exportCategory,
        periodId: filter.periodId,
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const selectedPeriod = periods.find((p) => String(p.id) === String(filter.periodId));
      const periodName = selectedPeriod ? selectedPeriod.namaPeriode.replace(/[^a-zA-Z0-9_-]/g, "_") : "Semua_Periode";
      link.setAttribute("download", `Laporan_Jawaban_Tracer_${exportCategory}_${periodName}_${new Date().getFullYear()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`Berhasil mengekspor Laporan Jawaban ${catLabel}`);
    } catch {
      toast.error(`Gagal mengekspor Laporan Jawaban ${catLabel}`);
    } finally {
      setExportingType(null);
    }
  };

  const filtered = results.filter((r) =>
    r.nama.toLowerCase().includes(search.toLowerCase()) ||
    r.nim.toLowerCase().includes(search.toLowerCase())
  );

  const activeResponse = detailModal.data?.responses?.find((r) => r.category === detailModal.activeTab);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="page-header flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Monitoring Hasil Tracer Study</h1>
          <p className="page-subtitle">Pantau alumni prodi yang sudah atau belum mengisi kuesioner Tracer DIKTI & IKU</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-auto">
          <button
            onClick={() => handleExportExcel("ALL")}
            disabled={exportingType !== null}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Ekspor Seluruh Jawaban Kuesioner Tracer Study Gabungan (DIKTI & IKU) ke Excel"
          >
            <Download size={16} />
            <span>{exportingType === "ALL" ? "Mengekspor..." : "Export All (Gabungan)"}</span>
          </button>

          <button
            onClick={() => handleExportExcel("DIKTI")}
            disabled={exportingType !== null}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Ekspor Seluruh Jawaban Kuesioner Tracer Study DIKTI ke Excel"
          >
            <Download size={16} />
            <span>{exportingType === "DIKTI" ? "Mengekspor..." : "Export Tracer DIKTI"}</span>
          </button>

          <button
            onClick={() => handleExportExcel("IKU")}
            disabled={exportingType !== null}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Ekspor Seluruh Jawaban Kuesioner Tracer Study IKU ke Excel"
          >
            <Download size={16} />
            <span>{exportingType === "IKU" ? "Mengekspor..." : "Export Tracer IKU"}</span>
          </button>
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
            <label className="form-label">Kategori Tracer</label>
            <select
              name="category"
              value={filter.category}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">Semua Kategori (DIKTI & IKU)</option>
              <option value="DIKTI">DIKTI (1 Tahun)</option>
              <option value="IKU">IKU (1-5 Tahun CPL)</option>
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
                <th>Kategori Terisi</th>
                <th>Tanggal Kirim</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="text-center py-8 text-slate-400">Memuat data...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 text-slate-400">Tidak ada data alumni</td></tr>
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
                    <td>
                      <div className="flex gap-1 flex-wrap">
                        {r.categoriesFilled && r.categoriesFilled.length > 0 ? (
                          r.categoriesFilled.map((cat) => (
                            <span key={cat} className="px-2 py-0.5 text-xs font-bold bg-teal-100 text-teal-800 rounded">
                              {cat}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </div>
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
                    <td className="text-center">
                      {r.statusTracer === "Sudah Mengisi" ? (
                        <button
                          onClick={() => handleOpenDetail(r.id)}
                          className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 text-teal-700 border-teal-200 hover:bg-teal-50 mx-auto"
                        >
                          <Eye size={14} />
                          <span>Lihat Jawaban</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs italic">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Jawaban */}
      {detailModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Detail Jawaban Kuesioner Alumni</h2>
                {detailModal.data?.alumni && (
                  <p className="text-sm text-slate-500 mt-1">
                    {detailModal.data.alumni.nama} ({detailModal.data.alumni.nim}) -{" "}
                    {detailModal.data.alumni.jurusan?.namaProdi}
                  </p>
                )}
              </div>
              <button
                onClick={() => setDetailModal({ open: false, alumniId: null, data: null, isLoading: false, activeTab: "DIKTI" })}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {detailModal.isLoading ? (
                <div className="p-8 text-center text-slate-400">Memuat detail jawaban alumni...</div>
              ) : !detailModal.data?.responses || detailModal.data.responses.length === 0 ? (
                <div className="p-8 text-center text-slate-400">Belum ada rincian jawaban terikat untuk alumni ini.</div>
              ) : (
                <>
                  {/* Category Tabs */}
                  <div className="flex gap-2 border-b border-slate-100 pb-3">
                    {detailModal.data.responses.map((resp) => (
                      <button
                        key={resp.id}
                        onClick={() => setDetailModal({ ...detailModal, activeTab: resp.category })}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                          detailModal.activeTab === resp.category
                            ? "bg-teal-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        Tracer {resp.category}
                      </button>
                    ))}
                  </div>

                  {activeResponse ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg text-xs text-slate-500 font-medium">
                        <span>Periode: {activeResponse.period?.namaPeriode}</span>
                        <span>
                          Dikirim pada: {new Date(activeResponse.submittedAt).toLocaleString("id-ID")}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {activeResponse.answers.map((ans, idx) => (
                          <div key={ans.id} className="p-4 rounded-xl border border-slate-100 bg-white space-y-2">
                            {ans.question?.tipe === "label" ? (
                              <div className="p-3 bg-teal-50 text-teal-900 text-sm font-medium rounded-lg whitespace-pre-line">
                                {ans.question.pertanyaan}
                              </div>
                            ) : (
                              <>
                                <p className="text-sm font-semibold text-slate-800">
                                  {idx + 1}. {ans.question?.pertanyaan || "Pertanyaan"}
                                </p>
                                <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-sm text-teal-900 font-medium whitespace-pre-line">
                                  {ans.jawaban || <span className="text-slate-400 italic">(Tidak diisi)</span>}
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-slate-400 text-sm">Tidak ada jawaban untuk kategori ini.</div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setDetailModal({ open: false, alumniId: null, data: null, isLoading: false, activeTab: "DIKTI" })}
                className="btn-secondary"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
