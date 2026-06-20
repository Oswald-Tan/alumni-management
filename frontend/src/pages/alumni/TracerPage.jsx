import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkEligibility, getActiveQuestions, submitResponse } from "../../services/tracerService";
import { ClipboardCheck, Briefcase, HelpCircle, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

export default function TracerPage() {
  const navigate = useNavigate();
  const [eligibility, setEligibility] = useState({ eligible: false, status: "", message: "" });
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
    waktuTunggu: "",
  });

  const loadTracerData = async () => {
    setIsLoading(true);
    try {
      const eligibilityRes = await checkEligibility();
      setEligibility(eligibilityRes.data);

      if (eligibilityRes.data.eligible && eligibilityRes.data.status === "BELUM_MENGISI") {
        const questionsRes = await getActiveQuestions();
        setQuestions(questionsRes.data.data);
        
        // Initialize answers state
        const initialAnswers = {};
        questionsRes.data.data.forEach((q) => {
          initialAnswers[q.id] = "";
        });
        setAnswers(initialAnswers);
      }
    } catch (err) {
      toast.error("Gagal memuat kuisioner");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTracerData();
  }, []);

  const handleAnswerChange = (qId, val) => {
    setAnswers({ ...answers, [qId]: val });
    
    // Auto-detect jika menjawab "Ya" pada pertanyaan tentang status pekerjaan untuk mempermudah user
    // Misalnya pertanyaan berisi "sudah bekerja"
    const qText = questions.find(q => q.id === qId)?.pertanyaan.toLowerCase();
    if (qText && (qText.includes("bekerja") || qText.includes("pekerjaan"))) {
      if (val.toLowerCase().startsWith("ya")) {
        setIsEmployed(true);
      } else if (val.toLowerCase().startsWith("tidak")) {
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
      // Map format answers untuk dikirim ke API
      const formattedAnswers = Object.entries(answers).map(([qId, val]) => ({
        questionId: parseInt(qId),
        jawaban: val.toString(),
      }));

      const payload = {
        answers: formattedAnswers,
        job: isEmployed ? {
          ...job,
          gajiPertama: job.gajiPertama ? parseFloat(job.gajiPertama) : null,
          waktuTunggu: parseInt(job.waktuTunggu) || 0,
        } : null,
      };

      const res = await submitResponse(payload);
      toast.success(res.data.message);
      navigate("/alumni/dashboard");
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

  // Jika alumni tidak eligible untuk mengisi
  if (!eligibility.eligible) {
    return (
      <div className="p-8">
        <div className="page-header">
          <div>
            <h1 className="page-title">Tracer Study</h1>
            <p className="page-subtitle">Pengisian kuisioner evaluasi alumni</p>
          </div>
        </div>

        <div className="card shadow-lg p-8 border border-slate-100 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
          {eligibility.status === "SUDAH_MENGISI" ? (
            <>
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Tracer Study Terkirim</h2>
              <p className="text-sm text-slate-500 mt-2 max-w-md">{eligibility.message}</p>
              {eligibility.submittedAt && (
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Dikirim pada: {new Date(eligibility.submittedAt).toLocaleString("id-ID")}
                </p>
              )}
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                <AlertCircle size={36} />
              </div>
              <h2 className="text-xl font-bold text-slate-700">Pengisian Belum Tersedia</h2>
              <p className="text-sm text-slate-500 mt-2 max-w-md">{eligibility.message}</p>
            </>
          )}
          <button onClick={() => navigate("/alumni/dashboard")} className="btn-secondary mt-6">
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Pengisian Kuisioner Tracer Study</h1>
          <p className="page-subtitle">Mohon isi kuisioner berikut dengan jujur demi akreditasi dan peningkatan kualitas kampus</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* Kuisioner Card */}
        <div className="card shadow-md border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-3">
            <ClipboardCheck size={20} className="text-teal-600" />
            <span>Bagian 1: Kuisioner Alumni</span>
          </h2>

          <div className="space-y-6">
            {questions.map((q) => (
              <div key={q.id} className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">
                  {q.pertanyaan} {q.isRequired && <span className="text-red-500">*</span>}
                </label>

                {/* Tipe Text */}
                {q.tipe === "text" && (
                  <input
                    type="text"
                    value={answers[q.id]}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    placeholder="Ketik jawaban Anda..."
                    className="form-input text-sm"
                    required={q.isRequired}
                  />
                )}

                {/* Tipe Textarea */}
                {q.tipe === "textarea" && (
                  <textarea
                    value={answers[q.id]}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    placeholder="Berikan jawaban terperinci..."
                    className="form-input text-sm h-24"
                    required={q.isRequired}
                  />
                )}

                {/* Tipe Radio */}
                {q.tipe === "radio" && q.opsi && (
                  <div className="flex flex-col sm:flex-row gap-4 mt-2">
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
                    value={answers[q.id]}
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
              </div>
            ))}
          </div>
        </div>

        {/* Pekerjaan Card */}
        <div className="card shadow-md border border-slate-100 p-6">
          <div className="flex items-center justify-between border-b pb-3 mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Briefcase size={20} className="text-teal-600" />
              <span>Bagian 2: Data Pekerjaan Alumni</span>
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
            </div>
          ) : (
            <p className="text-slate-500 text-sm italic py-4 text-center">
              Dua bagian kuisioner ini wajib dikirim. Ceklis "Saya Sudah Bekerja" di kanan atas jika Anda sudah berstatus bekerja saat ini.
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
            {isSubmitting ? "Mengirim Jawaban..." : "Submit Tracer Study"}
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
    </div>
  );
}
