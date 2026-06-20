import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { checkEligibility } from "../../services/tracerService";
import { getAlumniById } from "../../services/alumniService";
import { getDashboard } from "../../services/dashboardService";
import { Link } from "react-router-dom";
import { User, ClipboardCheck, GraduationCap, AlertCircle, CheckCircle2, Award, Briefcase } from "lucide-react";
import { toast } from "react-toastify";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";

const statusLabel = {
  TERDAFTAR_WISUDA: "Terdaftar Wisuda",
  LULUS: "Lulus Akademik",
  IJAZAH_TERBIT: "Ijazah Sudah Terbit",
  IJAZAH_DIAMBIL: "Ijazah Sudah Diambil",
};

const COLORS = ["#3b82f6", "#64748b", "#a855f7", "#22c55e"]; // Blue, Slate, Purple, Green
const KESESUAIAN_COLORS = ["#10b981", "#ef4444"]; // Green, Red
const KERJA_COLORS = ["#0ea5e9", "#f59e0b", "#64748b"]; // Sky Blue, Orange, Slate

export default function DashboardPage() {
  const user = useSelector(selectUser);
  const [alumniDetail, setAlumniDetail] = useState(null);
  const [tracerStatus, setTracerStatus] = useState({ eligible: false, status: "", message: "" });
  const [globalStats, setGlobalStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const loadDashboardData = async () => {
      try {
        const [alumniRes, eligibilityRes, globalRes] = await Promise.all([
          getAlumniById(user.id),
          checkEligibility(),
          getDashboard(),
        ]);
        setAlumniDetail(alumniRes.data.data);
        setTracerStatus(eligibilityRes.data);
        setGlobalStats(globalRes.data.data);
      } catch (err) {
        console.error("Gagal memuat data dashboard alumni", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-slate-200 rounded-2xl w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-slate-200 rounded-2xl" />
            <div className="h-48 bg-slate-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const isTracerDone = tracerStatus.status === "SUDAH_MENGISI";
  const isTracerAvailable = tracerStatus.eligible && tracerStatus.status === "BELUM_MENGISI";

  // Data status alumni global untuk grafik
  const pieDataGlobal = globalStats?.statusDistribusi?.map((s) => ({
    name: statusLabel[s.status] || s.status,
    value: s.total,
  })) || [];

  // Data Pekerjaan Global untuk grafik
  const pieDataKesesuaian = globalStats?.pekerjaanStats?.kesesuaianBidang || [];
  const pieDataKerja = globalStats?.pekerjaanStats?.statusPekerjaan || [];
  const barDataWaktuTunggu = globalStats?.pekerjaanStats?.waktuTungguPerProdi?.map((p) => ({
    name: p.namaProdi.split("/")[1]?.trim() || p.namaProdi,
    "Waktu Tunggu (Bulan)": p.rataWaktuTunggu,
  })) || [];

  return (
    <div className="p-8">
      {/* Welcome Card */}
      <div className="bg-linear-to-r from-teal-800 to-cyan-900 text-white rounded-3xl p-8 mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="relative z-10">
          <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider backdrop-blur-sm">
            Portal Alumni Polimdo
          </span>
          <h1 className="text-3xl font-extrabold mt-3 leading-tight">Selamat Datang Kembali,</h1>
          <p className="text-2xl font-medium text-teal-100">{user?.name}</p>
          <p className="text-teal-200 text-sm mt-1">NIM: {user?.nim}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Stats & Academic Status */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Academic Status Card */}
            <div className="card shadow-lg hover:shadow-xl transition-all border border-slate-100 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
                    <GraduationCap size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Status Akademik</h2>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Jurusan / Program Studi</p>
                    <p className="text-sm font-medium text-slate-700 mt-0.5">
                      {alumniDetail?.jurusan ? `${alumniDetail.jurusan.namaJurusan} / ${alumniDetail.jurusan.namaProdi}` : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Status Kelulusan</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`badge ${
                        alumniDetail?.statusAlumni === "IJAZAH_DIAMBIL" ? "badge-green" : 
                        alumniDetail?.statusAlumni === "IJAZAH_TERBIT" ? "badge-purple" : 
                        alumniDetail?.statusAlumni === "LULUS" ? "badge-slate" : "badge-blue"
                      }`}>
                        {statusLabel[alumniDetail?.statusAlumni]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link to="/alumni/status" className="text-sm text-teal-600 hover:text-teal-700 font-bold flex items-center gap-1">
                  Lihat Detail Kelulusan &rarr;
                </Link>
              </div>
            </div>

            {/* Tracer Study Card */}
            <div className="card shadow-lg hover:shadow-xl transition-all border border-slate-100 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
                    <ClipboardCheck size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Tracer Study</h2>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-4">
                  {isTracerDone ? (
                    <div className="flex gap-3">
                      <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Selesai Mengisi</p>
                        <p className="text-xs text-slate-500 mt-0.5">{tracerStatus.message}</p>
                      </div>
                    </div>
                  ) : isTracerAvailable ? (
                    <div className="flex gap-3">
                      <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Kuisioner Tersedia</p>
                        <p className="text-xs text-slate-500 mt-0.5">Silakan isi tracer study untuk membantu evaluasi kurikulum akademik.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <AlertCircle className="text-slate-400 shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="text-sm font-semibold text-slate-600">Belum Dibuka</p>
                        <p className="text-xs text-slate-500 mt-0.5">{tracerStatus.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                {isTracerAvailable ? (
                  <Link to="/alumni/tracer" className="btn-primary block text-center bg-teal-600 hover:bg-teal-700 border-none text-sm py-2 px-4 rounded-xl text-white font-semibold">
                    Isi Kuisioner Tracer
                  </Link>
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    {isTracerDone ? "Terima kasih atas partisipasi Anda!" : "Kuisioner belum dibuka untuk Anda saat ini."}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Global Distribution Chart */}
        <div className="card shadow-md border border-slate-100 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
                <Award size={20} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800">Sebaran Kelulusan Alumni</h2>
                <p className="text-xs text-slate-500">Statistik status ijazah alumni keseluruhan</p>
              </div>
            </div>

            <div className="flex items-center justify-center min-h-[220px]">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieDataGlobal}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieDataGlobal.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" align="center" iconSize={10} tick={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Global Career Stats Section */}
      {globalStats?.pekerjaanStats && (
        <div className="mt-8 space-y-8">
          <div className="flex items-center gap-3 border-b pb-3 mb-4">
            <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
              <Briefcase size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Tren Karir & Pekerjaan Alumni</h2>
              <p className="text-xs text-slate-500">Gambaran keselarasan kerja dan waktu tunggu lulusan Polimdo secara keseluruhan</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart: Kesesuaian Bidang */}
            <div className="card shadow-md border border-slate-100 p-6 flex flex-col">
              <h2 className="text-sm font-bold text-slate-800 mb-1">Kesesuaian Bidang Kerja</h2>
              <p className="text-xs text-slate-400 mb-4">Kesesuaian pekerjaan dengan program studi alumni</p>
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
              <p className="text-xs text-slate-400 mb-4">Distribusi status kepegawaian alumni Polimdo</p>
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
                  <Bar dataKey="Waktu Tunggu (Bulan)" fill="#0d9488" radius={[4, 4, 0, 0]}>
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
