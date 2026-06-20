import { useEffect, useState } from "react";
import { Users, BookOpen, CheckCircle, Clock, ClipboardList, ShieldAlert, Briefcase } from "lucide-react";
import { getDashboard } from "../../services/dashboardService";
import { toast } from "react-toastify";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";

const statusLabel = {
  TERDAFTAR_WISUDA: "Terdaftar Wisuda",
  LULUS: "Lulus",
  IJAZAH_TERBIT: "Ijazah Terbit",
  IJAZAH_DIAMBIL: "Ijazah Diambil",
};

const COLORS = ["#3b82f6", "#64748b", "#a855f7", "#22c55e"]; // Blue, Slate, Purple, Green
const TRACER_COLORS = ["#10b981", "#f97316"]; // Green, Orange
const KESESUAIAN_COLORS = ["#10b981", "#ef4444"]; // Green, Red
const KERJA_COLORS = ["#0ea5e9", "#f59e0b", "#64748b"]; // Sky Blue, Orange, Slate

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
      label: "Ijazah Diambil",
      value: data?.sudahAmbilIjazah || 0,
      icon: CheckCircle,
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      label: "Belum Ambil Ijazah",
      value: data?.belumAmbilIjazah || 0,
      icon: Clock,
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
  ];

  // Data untuk Pie Chart Distribusi Status Alumni
  const pieDataStatus = data?.statusDistribusi?.map((s) => ({
    name: statusLabel[s.status] || s.status,
    value: s.total,
  })) || [];

  // Data untuk Bar Chart Alumni per Prodi
  const barDataProdi = data?.alumniPerProdi?.map((p) => ({
    name: p.namaProdi.split("/")[1]?.trim() || p.namaProdi, // Ambil nama prodi saja biar tidak kepanjangan
    "Jumlah Alumni": p.total,
  })) || [];

  // Data untuk Pie Chart Tracer Study
  const pieDataTracer = [
    { name: "Sudah Mengisi", value: data?.tracerStats?.sudahMengisi || 0 },
    { name: "Belum Mengisi", value: data?.tracerStats?.belumMengisi || 0 },
  ];

  // Data Pekerjaan
  const pieDataKesesuaian = data?.pekerjaanStats?.kesesuaianBidang || [];
  const pieDataKerja = data?.pekerjaanStats?.statusPekerjaan || [];
  const barDataWaktuTunggu = data?.pekerjaanStats?.waktuTungguPerProdi?.map((p) => ({
    name: p.namaProdi.split("/")[1]?.trim() || p.namaProdi,
    "Waktu Tunggu (Bulan)": p.rataWaktuTunggu,
  })) || [];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="page-title">Dashboard Admin</h1>
        <p className="page-subtitle">Ringkasan data alumni Politeknik Negeri Manado</p>
      </div>

      {/* Title & Purpose Academic Banner */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="relative z-10">
          <h2 className="text-xs uppercase tracking-wider text-blue-200 font-extrabold mb-1">Judul Tugas Akhir</h2>
          <p className="text-xl font-extrabold mb-3 leading-snug">
            Rancang Bangun Aplikasi Pengelolaan Data Alumni untuk Mendukung Administrasi Akademik di Politeknik Negeri Manado
          </p>
          <div className="border-t border-white/10 pt-4 mt-4">
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              <span className="font-bold text-white uppercase tracking-wider text-[10px] bg-blue-500 px-2.5 py-0.5 rounded-full mr-2">Tujuan Sistem</span>
              Sistem digunakan oleh Admin Akademik untuk mengelola dan mengarsipkan data alumni mulai dari pendaftaran wisuda, kelulusan, penerbitan ijazah, hingga pengambilan ijazah.
            </p>
          </div>
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

      {/* Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Chart 1: Donut Chart Distribusi Arsip */}
        <div className="card shadow-md border border-slate-100 p-6 flex flex-col">
          <h2 className="text-base font-bold text-slate-800 mb-4">Distribusi Arsip Alumni</h2>
          <div className="flex-1 flex items-center justify-center min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieDataStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieDataStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Bar Chart Alumni Per Prodi */}
        <div className="card shadow-md border border-slate-100 p-6 flex flex-col">
          <h2 className="text-base font-bold text-slate-800 mb-4">Jumlah Alumni per Program Studi</h2>
          <div className="flex-1 flex items-center justify-center min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barDataProdi}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="Jumlah Alumni" fill="#8884d8" radius={[4, 4, 0, 0]}>
                  {barDataProdi.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tracer Study Stats Section */}
      {data?.tracerStats && (
        <div className="card shadow-md border border-slate-100 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6 border-b pb-3">
            <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
              <ClipboardList size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Statistik Pengisian: {data.tracerStats.namaPeriodeAktif}
              </h2>
              <p className="text-xs text-slate-500">
                Status Periode:{" "}
                <span className={`font-semibold ${data.tracerStats.status === "Aktif" ? "text-emerald-600" : "text-red-500"}`}>
                  {data.tracerStats.status}
                </span>
              </p>
            </div>
          </div>

          {data.tracerStats.status === "Aktif" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Pie Chart Tracer */}
              <div className="md:col-span-1 flex justify-center min-h-[220px]">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieDataTracer}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieDataTracer.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={TRACER_COLORS[index % TRACER_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Metrics */}
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-slate-400 text-xs font-semibold uppercase">Total Alumni Target</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{data.tracerStats.totalAlumniTarget} Orang</p>
                </div>
                <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
                  <p className="text-teal-600 text-xs font-semibold uppercase">Sudah Mengisi</p>
                  <p className="text-2xl font-bold text-teal-700 mt-1">{data.tracerStats.sudahMengisi} Orang</p>
                </div>
                <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                  <p className="text-orange-600 text-xs font-semibold uppercase">Belum Mengisi</p>
                  <p className="text-2xl font-bold text-orange-700 mt-1">{data.tracerStats.belumMengisi} Orang</p>
                </div>
                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <p className="text-blue-600 text-xs font-semibold uppercase">Persentase Pengisian</p>
                  <p className="text-2xl font-bold text-blue-700 mt-1">{data.tracerStats.persentase}%</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 border border-dashed rounded-2xl flex flex-col items-center">
              <ShieldAlert size={36} className="text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700">Tidak Ada Periode Tracer Study yang Aktif</p>
              <p className="text-xs text-slate-500 mt-0.5">Aktifkan periode tracer study pada menu Periode Tracer untuk menampilkan statistik.</p>
            </div>
          )}
        </div>
      )}

      {/* Career Stats Section */}
      {data?.pekerjaanStats && (
        <div className="space-y-8">
          <div className="flex items-center gap-3 border-b pb-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <Briefcase size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Statistik Karir & Pekerjaan Alumni</h2>
              <p className="text-xs text-slate-500">Analisis keselarasan dan waktu tunggu lulusan di dunia kerja</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart: Kesesuaian Bidang */}
            <div className="card shadow-md border border-slate-100 p-6 flex flex-col">
              <h2 className="text-sm font-bold text-slate-800 mb-1">Kesesuaian Bidang Kerja</h2>
              <p className="text-xs text-slate-400 mb-4">Persentase kesesuaian pekerjaan dengan program studi alumni</p>
              <div className="flex-1 flex items-center justify-center min-h-[300px]">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieDataKesesuaian}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieDataKesesuaian.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={KESESUAIAN_COLORS[index % KESESUAIAN_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" iconSize={10} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart: Status Pekerjaan */}
            <div className="card shadow-md border border-slate-100 p-6 flex flex-col">
              <h2 className="text-sm font-bold text-slate-800 mb-1">Status Pekerjaan Alumni</h2>
              <p className="text-xs text-slate-400 mb-4">Distribusi status kepegawaian alumni Polimdo secara keseluruhan</p>
              <div className="flex-1 flex items-center justify-center min-h-[300px]">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieDataKerja}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieDataKerja.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={KERJA_COLORS[index % KERJA_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" iconSize={10} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Chart: Rata-rata Waktu Tunggu */}
          <div className="card shadow-md border border-slate-100 p-6 flex flex-col">
            <h2 className="text-sm font-bold text-slate-800 mb-1">Rata-rata Waktu Tunggu Kerja per Program Studi</h2>
            <p className="text-xs text-slate-400 mb-4">Waktu rata-rata (dalam bulan) yang dibutuhkan lulusan untuk mendapatkan pekerjaan pertama</p>
            <div className="flex-1 flex items-center justify-center min-h-[300px]">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barDataWaktuTunggu}>
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={0} />
                  <YAxis allowDecimals={true} unit=" bln" tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => [`${value} Bulan`, "Rata-rata Waktu Tunggu"]} />
                  <Bar dataKey="Waktu Tunggu (Bulan)" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    {barDataWaktuTunggu.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
