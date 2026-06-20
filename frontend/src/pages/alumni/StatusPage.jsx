import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { getAlumniById } from "../../services/alumniService";
import { GraduationCap, Award, Calendar, FileText, CheckCircle2, Circle } from "lucide-react";
import { toast } from "react-toastify";

export default function StatusPage() {
  const user = useSelector(selectUser);
  const [alumniDetail, setAlumniDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    getAlumniById(user.id)
      .then((res) => {
        setAlumniDetail(res.data.data);
      })
      .catch(() => {
        toast.error("Gagal memuat status kelulusan");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user]);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse card max-w-xl h-64 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  // Tentukan status pencapaian untuk timeline
  const hasLulus = !!alumniDetail?.tanggalKelulusan;
  const hasWisuda = !!alumniDetail?.tanggalWisuda;
  const hasTerbit = !!alumniDetail?.nomorIjazah;
  const hasAmbil = !!alumniDetail?.tanggalPengambilanIjazah;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const steps = [
    {
      title: "Lulus Akademik",
      description: "Telah menyelesaikan sidang dan dinyatakan lulus yudisium.",
      date: alumniDetail?.tanggalKelulusan,
      achieved: hasLulus,
      icon: GraduationCap,
      details: null,
    },
    {
      title: "Wisuda",
      description: "Terdaftar dan mengikuti upacara wisuda Politeknik Negeri Manado.",
      date: alumniDetail?.tanggalWisuda,
      achieved: hasWisuda,
      icon: Calendar,
      details: null,
    },
    {
      title: "Penerbitan Ijazah (Arsip)",
      description: "Nomor ijazah dikeluarkan dan berkas diarsipkan secara digital.",
      date: alumniDetail?.tanggalKelulusan, // Dianggap terbit setelah lulus/wisuda
      achieved: hasTerbit,
      icon: FileText,
      details: hasTerbit ? `Nomor Ijazah: ${alumniDetail.nomorIjazah}` : null,
    },
    {
      title: "Pengambilan Ijazah",
      description: "Ijazah asli dicetak dan telah diambil oleh alumni.",
      date: alumniDetail?.tanggalPengambilanIjazah,
      achieved: hasAmbil,
      icon: Award,
      details: hasAmbil ? `Diambil pada: ${formatDate(alumniDetail.tanggalPengambilanIjazah)}` : "Belum diambil",
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Status Kelulusan & Arsip Ijazah</h1>
          <p className="page-subtitle">Pantau proses kelulusan akademik, penerbitan, hingga pengambilan ijazah Anda</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline */}
        <div className="card shadow-md border border-slate-100 p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Alur Kelulusan Anda</h2>
          
          <div className="relative border-l border-slate-200 ml-4 pl-8 space-y-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative">
                  {/* Indicator Dot */}
                  <span className="absolute -left-12 top-0.5 flex items-center justify-center">
                    {step.achieved ? (
                      <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/20">
                        <CheckCircle2 size={18} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-200 text-slate-400 flex items-center justify-center">
                        <Circle size={12} className="fill-slate-300" />
                      </div>
                    )}
                  </span>

                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className={`text-base font-bold ${step.achieved ? "text-slate-800" : "text-slate-400"}`}>
                        {step.title}
                      </h3>
                      {step.achieved && step.date && (
                        <span className="text-xs text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-full w-fit">
                          {formatDate(step.date)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-1 max-w-md">{step.description}</p>
                    
                    {step.details && (
                      <div className="mt-2 text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-700 w-fit">
                        {step.details}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Box */}
        <div className="space-y-6">
          <div className="card shadow-md p-6 bg-teal-50/50 border-teal-100">
            <h3 className="text-sm font-bold text-teal-800 mb-2">Informasi Penting</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Ijazah dapat diambil di Bagian Administrasi Akademik Politeknik Negeri Manado dengan membawa:
            </p>
            <ul className="text-xs text-slate-600 list-disc list-inside space-y-1 mb-4">
              <li>Kartu Wisuda asli</li>
              <li>Bukti Bebas Masalah Keuangan</li>
              <li>Bukti Bebas Pustaka Perpustakaan</li>
              <li>Bukti Pengisian Tracer Study (di menu sebelah)</li>
            </ul>
            <div className="text-xs font-semibold text-teal-700">
              * Pastikan Anda telah mengisi Tracer Study sebelum melakukan pengambilan ijazah.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
