import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkEligibility, getActiveQuestions, submitResponse } from "../../services/tracerService";
import { ClipboardCheck, Briefcase, Save, AlertCircle, CheckCircle2, Layers, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";

export default function TracerPage() {
  const navigate = useNavigate();
  const [eligibility, setEligibility] = useState({ eligible: false, filledCategories: [], isEligibleDikti: false, isEligibleIku: false, message: "" });
  const [activeCategory, setActiveCategory] = useState("DIKTI");
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States untuk form pengisian
  const [answers, setAnswers] = useState({}); // format: { [questionId]: "jawaban" }
  const [isEmployed, setIsEmployed] = useState(false);
  const [job, setJob] = useState({
    namaPerusahaan: "",
    jabatan: "",
    bidangPekerjaan: "",
    statusPekerjaan: "Tetap",
    tahunMulai: new Date().getFullYear(),
    gajiPertama: "",
    kesesuaianBidang: "Sesuai",
    lokasiKerja: "Dalam Negeri",
    waktuTunggu: "",
  });

  const loadTracerData = async () => {
    setIsLoading(true);
    try {
      const eligibilityRes = await checkEligibility();
      const data = eligibilityRes.data;
      setEligibility(data);

      // Auto-select category
      if (data.isEligibleDikti && !data.filledCategories?.includes("DIKTI")) {
        setActiveCategory("DIKTI");
      } else if (data.isEligibleIku && !data.filledCategories?.includes("IKU")) {
        setActiveCategory("IKU");
      } else if (data.isEligibleDikti) {
        setActiveCategory("DIKTI");
      } else {
        setActiveCategory("IKU");
      }
    } catch {
      toast.error("Gagal memuat kelayakan tracer");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategoryQuestions = async (cat) => {
    setIsQuestionsLoading(true);
    try {
      const res = await getActiveQuestions({ category: cat });
      setQuestions(res.data.data);

      const initialAnswers = {};
      res.data.data.forEach((q) => {
        initialAnswers[q.id] = "";
      });
      setAnswers(initialAnswers);
    } catch {
      toast.error("Gagal memuat pertanyaan");
    } finally {
      setIsQuestionsLoading(false);
    }
  };

  useEffect(() => {
    loadTracerData();
  }, []);

  useEffect(() => {
    if (eligibility.eligible) {
      fetchCategoryQuestions(activeCategory);
    }
  }, [activeCategory, eligibility.eligible]);

  const handleAnswerChange = (qId, val) => {
    setAnswers({ ...answers, [qId]: val });
    
    // Auto-detect jika menjawab "Ya" / Bekerja
    const qText = questions.find(q => q.id === qId)?.pertanyaan.toLowerCase();
    if (qText && (qText.includes("bekerja") || qText.includes("pekerjaan") || qText.includes("status keberkerjaan"))) {
      if (val.toLowerCase().includes("bekerja") || val.toLowerCase().startsWith("ya")) {
        setIsEmployed(true);
      } else if (val.toLowerCase().includes("tidak") || val.toLowerCase().includes("belum")) {
        setIsEmployed(false);
      }
    }
  };

  const handleJobChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi kuisioner wajib
    const missingAnswers = questions.filter(q => q.isRequired && !answers[q.id]?.toString().trim());
    if (missingAnswers.length > 0) {
      toast.error(`Pertanyaan "${missingAnswers[0].pertanyaan}" wajib dijawab!`);
      return;
    }

    // Validasi form pekerjaan jika dicentang sudah bekerja
    if (isEmployed) {
      if (!job.namaPerusahaan.trim() || !job.jabatan.trim() || !job.bidangPekerjaan.trim() || !job.waktuTunggu) {
        toast.error("Silakan lengkapi informasi pekerjaan Anda.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([qId, val]) => ({
        questionId: parseInt(qId),
        jawaban: val.toString(),
      }));

      const payload = {
        category: activeCategory,
        answers: formattedAnswers,
        job: isEmployed ? {
          ...job,
          gajiPertama: job.gajiPertama ? parseFloat(job.gajiPertama) : null,
          waktuTunggu: parseInt(job.waktuTunggu) || 0,
        } : null,
      };

      const res = await submitResponse(payload);
      toast.success(res.data.message);
      loadTracerData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mengirim tracer study");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-slate-200 rounded-xl w-1/4" />
          <div className="h-64 bg-slate-200 rounded-2xl w-full" />
        </div>
      </div>
    );
  }

  // Group questions by section
  const groupedQuestions = questions.reduce((acc, q) => {
    const sectionName = q.section || "Kuesioner Umum";
    if (!acc[sectionName]) acc[sectionName] = [];
    acc[sectionName].push(q);
    return acc;
  }, {});

  const isCurrentCategoryFilled = eligibility.filledCategories?.includes(activeCategory);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Pengisian Kuesioner Tracer Study</h1>
          <p className="page-subtitle">Pilih kategori Tracer Study sesuai periode kelulusan Anda</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-4 mb-6">
        {eligibility.isEligibleDikti && (
          <button
            type="button"
            onClick={() => setActiveCategory("DIKTI")}
            className={`px-5 py-3 rounded-xl font-bold text-sm border transition-all cursor-pointer flex items-center gap-2 ${
              activeCategory === "DIKTI"
                ? "bg-teal-600 text-white border-teal-600 shadow-md"
                : "bg-white text-slate-700 border-slate-200 hover:border-teal-300"
            }`}
          >
            <Layers size={18} />
            <span>Tracer DIKTI (Lulusan 1 Tahun)</span>
            {eligibility.filledCategories?.includes("DIKTI") && (
              <CheckCircle2 size={16} className="text-emerald-300 ml-1" />
            )}
          </button>
        )}

        {eligibility.isEligibleIku && (
          <button
            type="button"
            onClick={() => setActiveCategory("IKU")}
            className={`px-5 py-3 rounded-xl font-bold text-sm border transition-all cursor-pointer flex items-center gap-2 ${
              activeCategory === "IKU"
                ? "bg-teal-600 text-white border-teal-600 shadow-md"
                : "bg-white text-slate-700 border-slate-200 hover:border-teal-300"
            }`}
          >
            <CheckCircle size={18} />
            <span>Tracer IKU (Lulusan 1-5 Tahun - CPL)</span>
            {eligibility.filledCategories?.includes("IKU") && (
              <CheckCircle2 size={16} className="text-emerald-300 ml-1" />
            )}
          </button>
        )}
      </div>

      {/* If category already filled */}
      {isCurrentCategoryFilled ? (
        <div className="card shadow-lg p-8 border border-slate-100 flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-8">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Tracer Study ({activeCategory}) Terkirim</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-md">
            Anda telah berhasil mengisi kuesioner Tracer Study kategori {activeCategory}. Terima kasih atas partisipasi Anda!
          </p>
          <button onClick={() => navigate("/alumni/dashboard")} className="btn-secondary mt-6">
            Kembali ke Dashboard
          </button>
        </div>
      ) : isQuestionsLoading ? (
        <div className="card p-8 text-center text-slate-400">Memuat pertanyaan kuesioner...</div>
      ) : questions.length === 0 ? (
        <div className="card p-8 text-center text-slate-400">
          Belum ada pertanyaan yang aktif untuk kategori {activeCategory}. Silakan hubungi Admin Prodi Anda.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
          {/* Question Sections */}
          {Object.entries(groupedQuestions).map(([sectionTitle, secQuestions]) => (
            <div key={sectionTitle} className="card shadow-md border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-3">
                <ClipboardCheck size={20} className="text-teal-600" />
                <span>{sectionTitle}</span>
              </h2>

              <div className="space-y-6">
                {secQuestions.map((q) => (
                  <div key={q.id} className="space-y-2">
                    {q.tipe === "label" || q.tipe === "info" ? (
                      <div className="p-4 bg-teal-50/80 border border-teal-200/80 rounded-lg text-teal-900 text-sm font-medium whitespace-pre-line leading-relaxed shadow-sm">
                        {q.pertanyaan}
                      </div>
                    ) : (
                      <>
                        <label className="text-sm font-semibold text-slate-700 block">
                          {q.pertanyaan} {q.isRequired && <span className="text-red-500">*</span>}
                        </label>

                        {/* Tipe Text */}
                        {q.tipe === "text" && (
                      <input
                        type="text"
                        value={answers[q.id] || ""}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        placeholder="Ketik jawaban Anda..."
                        className="form-input text-sm"
                        required={q.isRequired}
                      />
                    )}

                    {/* Tipe Textarea */}
                    {q.tipe === "textarea" && (
                      <textarea
                        value={answers[q.id] || ""}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        placeholder="Berikan jawaban terperinci..."
                        className="form-input text-sm h-24"
                        required={q.isRequired}
                      />
                    )}

                    {/* Tipe Radio */}
                    {q.tipe === "radio" && q.opsi && (
                      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-2">
                        {q.opsi.split(",").map((o) => (
                          <label key={o} className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 font-medium">
                            <input
                              type="radio"
                              name={`q-${q.id}`}
                              value={o}
                              checked={answers[q.id] === o}
                              onChange={() => handleAnswerChange(q.id, o)}
                              className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                              required={q.isRequired}
                            />
                            <span>{o}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Tipe Select */}
                    {q.tipe === "select" && q.opsi && (
                      <select
                        value={answers[q.id] || ""}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className="form-select text-sm"
                        required={q.isRequired}
                      >
                        <option value="">-- Pilih salah satu --</option>
                        {q.opsi.split(",").map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Tipe Checkbox / Checkboxes */}
                    {(q.tipe === "checkbox" || q.tipe === "checkboxes") && q.opsi && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                        {q.opsi.split(",").map((o) => {
                          const option = o.trim();
                          const currentSelected = answers[q.id]
                            ? answers[q.id].split(",").map((s) => s.trim())
                            : [];
                          const isChecked = currentSelected.includes(option);
                          return (
                            <label
                              key={option}
                              className="flex items-start gap-2.5 cursor-pointer text-sm text-slate-700 font-medium hover:text-teal-700 transition-colors p-2 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-200"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  let updated;
                                  if (isChecked) {
                                    updated = currentSelected.filter((item) => item !== option);
                                  } else {
                                    updated = [...currentSelected, option];
                                  }
                                  handleAnswerChange(q.id, updated.join(", "));
                                }}
                                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 mt-0.5"
                              />
                              <span>{option}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
              </div>
            </div>
          ))}

          {/* Pekerjaan Card */}
          <div className="card shadow-md border border-slate-100 p-6">
            <div className="flex items-center justify-between border-b pb-3 mb-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Briefcase size={20} className="text-teal-600" />
                <span>Informasi Pekerjaan Alumni</span>
              </h2>
              
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isEmployed}
                  onChange={(e) => setIsEmployed(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm font-bold text-teal-700">Saya Sudah Bekerja</span>
              </label>
            </div>

            {isEmployed ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Nama Perusahaan <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="namaPerusahaan"
                      value={job.namaPerusahaan}
                      onChange={handleJobChange}
                      placeholder="Contoh: PT Teknologi Indonesia"
                      className="form-input text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Jabatan / Posisi <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="jabatan"
                      value={job.jabatan}
                      onChange={handleJobChange}
                      placeholder="Contoh: Software Engineer"
                      className="form-input text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Bidang Pekerjaan <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="bidangPekerjaan"
                      value={job.bidangPekerjaan}
                      onChange={handleJobChange}
                      placeholder="Contoh: IT / Rekayasa Perangkat Lunak"
                      className="form-input text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Status Pekerjaan</label>
                    <select
                      name="statusPekerjaan"
                      value={job.statusPekerjaan}
                      onChange={handleJobChange}
                      className="form-input text-sm"
                    >
                      <option value="Tetap">Karyawan Tetap</option>
                      <option value="Kontrak">Kontrak / Outsourcing</option>
                      <option value="Freelance">Lepas / Freelance</option>
                      <option value="Wiraswasta">Wiraswasta / Bisnis</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Tahun Mulai Bekerja <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      name="tahunMulai"
                      value={job.tahunMulai}
                      onChange={handleJobChange}
                      className="form-input text-sm"
                      min="2000"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Gaji Pertama (Opsional)</label>
                    <input
                      type="number"
                      name="gajiPertama"
                      value={job.gajiPertama}
                      onChange={handleJobChange}
                      placeholder="Contoh: 5000000"
                      className="form-input text-sm"
                    />
                  </div>

                  <div>
                    <label className="form-label">Waktu Tunggu (Bulan) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      name="waktuTunggu"
                      value={job.waktuTunggu}
                      onChange={handleJobChange}
                      placeholder="Waktu tunggu kerja (bulan)"
                      className="form-input text-sm"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Kesesuaian dengan Bidang Studi</label>
                  <select
                    name="kesesuaianBidang"
                    value={job.kesesuaianBidang}
                    onChange={handleJobChange}
                    className="form-input text-sm"
                  >
                    <option value="Sesuai">Sesuai dengan Bidang Studi (Linear)</option>
                    <option value="Tidak Sesuai">Tidak Sesuai dengan Bidang Studi (Non-Linear)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Lokasi Kerja <span className="text-red-500">*</span></label>
                  <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 font-medium">
                      <input
                        type="radio"
                        name="lokasiKerja"
                        value="Dalam Negeri"
                        checked={job.lokasiKerja === "Dalam Negeri"}
                        onChange={handleJobChange}
                        className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                        required
                      />
                      <span>Dalam Negeri</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 font-medium">
                      <input
                        type="radio"
                        name="lokasiKerja"
                        value="Luar Negeri"
                        checked={job.lokasiKerja === "Luar Negeri"}
                        onChange={handleJobChange}
                        className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                      />
                      <span>Luar Negeri</span>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm italic py-4 text-center">
                Centang "Saya Sudah Bekerja" di kanan atas jika Anda sudah berstatus bekerja saat ini.
              </p>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary py-3 px-6 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-teal-600/30 border-none cursor-pointer text-base flex-1 sm:flex-none"
            >
              <Save size={18} />
              {isSubmitting ? "Mengirim Jawaban..." : `Submit Tracer (${activeCategory})`}
            </button>
            <button
              type="button"
              onClick={() => navigate("/alumni/dashboard")}
              className="btn-secondary py-3 px-6 text-base"
            >
              Batal
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
