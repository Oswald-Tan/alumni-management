import { useEffect, useState } from "react";
import { Users, BookOpen, CheckCircle, Clock } from "lucide-react";
import { getDashboard } from "../../services/dashboardService";
import { toast } from "react-toastify";

const statusLabel = {
  TERDAFTAR_WISUDA: "Terdaftar Wisuda",
  LULUS: "Lulus",
  IJAZAH_TERBIT: "Ijazah Terbit",
  IJAZAH_DIAMBIL: "Ijazah Diambil",
};

const statusColor = {
  TERDAFTAR_WISUDA: "bg-blue-100 text-blue-700",
  LULUS: "bg-slate-100 text-slate-700",
  IJAZAH_TERBIT: "bg-purple-100 text-purple-700",
  IJAZAH_DIAMBIL: "bg-green-100 text-green-700",
};

const statusBarColor = {
  TERDAFTAR_WISUDA: "bg-blue-500",
  LULUS: "bg-slate-500",
  IJAZAH_TERBIT: "bg-purple-500",
  IJAZAH_DIAMBIL: "bg-green-500",
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboard();
        setData(res.data.data);
      } catch {
        toast.error("Gagal memuat data dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Alumni",
      value: data?.totalAlumni || 0,
      icon: Users,
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      label: "Program Studi",
      value: data?.totalProdi || 0,
      icon: BookOpen,
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
    {
      label: "Alumni Sudah Ambil Ijazah",
      value: data?.sudahAmbilIjazah || 0,
      icon: CheckCircle,
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      label: "Alumni Belum Ambil Ijazah",
      value: data?.belumAmbilIjazah || 0,
      icon: Clock,
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="page-title">Dashboard Admin</h1>
        <p className="page-subtitle">Ringkasan data alumni Politeknik Negeri Manado</p>
      </div>

      {/* Title & Purpose Academic Banner */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white mb-8 shadow-md shadow-blue-500/10">
        <h2 className="text-sm uppercase tracking-wider text-blue-200 font-bold mb-1">Judul Tugas Akhir</h2>
        <p className="text-lg font-bold mb-3 leading-snug">
          Rancang Bangun Aplikasi Pengelolaan Data Alumni untuk Mendukung Administrasi Akademik di Politeknik Negeri Manado
        </p>
        <div className="border-t border-white/10 pt-3 mt-3">
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            <span className="font-bold text-white uppercase tracking-wider text-[10px] bg-blue-500 px-2 py-0.5 rounded-full mr-2">Tujuan Sistem</span>
            Sistem digunakan oleh Admin Akademik untuk mengelola dan mengarsipkan data alumni mulai dari pendaftaran wisuda, kelulusan, penerbitan ijazah, hingga pengambilan ijazah.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="stat-card">
              <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon size={24} className={s.text} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{s.value.toLocaleString()}</p>
                <p className="text-sm text-slate-500">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribusi */}
        <div className="card">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Distribusi Arsip Alumni</h2>
          <div className="space-y-4">
            {data?.statusDistribusi?.map((s) => {
              const pct = data.totalAlumni > 0 ? Math.round((s.total / data.totalAlumni) * 100) : 0;
              return (
                <div key={s.status}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`badge ${statusColor[s.status] || "bg-slate-100 text-slate-600"}`}>
                      {statusLabel[s.status] || s.status}
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                      {s.total} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${statusBarColor[s.status] || "bg-blue-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alumni per Prodi */}
        <div className="card">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Alumni per Program Studi</h2>
          <div className="space-y-3">
            {data?.alumniPerProdi?.slice(0, 7).map((p) => {
              const pct = data.totalAlumni > 0 ? Math.round((p.total / data.totalAlumni) * 100) : 0;
              return (
                <div key={p.prodiId}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600 truncate max-w-[280px]">{p.namaProdi}</span>
                    <span className="text-sm font-semibold text-slate-700 ml-2">{p.total}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
