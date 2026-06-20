import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from "../../features/auth/authSlice";
import { getAlumniById, updateAlumni, updateAlumniFoto, deleteAlumniFoto } from "../../services/alumniService";
import { User, Lock, Save, BookOpen } from "lucide-react";
import { toast } from "react-toastify";
import ProfilePhotoUpload from "../../components/ProfilePhotoUpload";

export default function ProfilPage() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [alumniDetail, setAlumniDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [passForm, setPassForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!user?.id) return;
    getAlumniById(user.id)
      .then((res) => {
        setAlumniDetail(res.data.data);
      })
      .catch(() => {
        toast.error("Gagal memuat profil alumni");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user]);

  const handleUploadSuccess = (newFoto) => {
    setAlumniDetail((prev) => ({ ...prev, foto: newFoto }));
    dispatch(setUser({ ...user, foto: newFoto }));
  };

  const handlePassChange = (e) => {
    setPassForm({ ...passForm, [e.target.name]: e.target.value });
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!passForm.newPassword.trim()) {
      toast.error("Password baru wajib diisi");
      return;
    }
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error("Konfirmasi password baru tidak cocok");
      return;
    }

    setIsSaving(true);
    try {
      await updateAlumni(user.id, { password: passForm.newPassword });
      toast.success("Password berhasil diubah!");
      setPassForm({ newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mengubah password");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse card max-w-xl h-64 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Profil Saya</h1>
          <p className="page-subtitle">Kelola informasi pribadi dan keamanan akun Anda</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card Info */}
        <div className="card shadow-md border border-slate-100 p-6 lg:col-span-2">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6 pb-6 border-b border-slate-100">
            <ProfilePhotoUpload
              currentFoto={alumniDetail?.foto}
              onUploadSuccess={handleUploadSuccess}
              uploadService={(formData) => updateAlumniFoto(user.id, formData)}
              deleteService={() => deleteAlumniFoto(user.id)}
              roleTheme="teal"
            />
            <div className="flex-1 w-full text-center sm:text-left mt-2">
              <h2 className="text-xl font-bold text-slate-800">{alumniDetail?.nama}</h2>
              <p className="text-sm text-slate-500 font-mono mt-0.5">NIM: {alumniDetail?.nim}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Nama Lengkap</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{alumniDetail?.nama}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">NIM</p>
                <p className="text-sm font-mono text-slate-800 mt-0.5">{alumniDetail?.nim}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Jurusan / Program Studi</p>
              <div className="flex items-center gap-2 mt-1">
                <BookOpen size={16} className="text-teal-600 shrink-0" />
                <p className="text-sm font-medium text-slate-800">
                  {alumniDetail?.jurusan ? `${alumniDetail.jurusan.namaJurusan} / ${alumniDetail.jurusan.namaProdi}` : "-"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Jenjang</p>
                <p className="text-sm text-slate-800 mt-0.5">{alumniDetail?.jurusan?.jenjang || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Akreditasi Prodi</p>
                <span className="badge badge-purple mt-1 inline-block">{alumniDetail?.jurusan?.akreditasi || "-"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="card shadow-md border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
              <Lock size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Keamanan Akun</h2>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="form-label">Password Baru</label>
              <input
                type="password"
                name="newPassword"
                value={passForm.newPassword}
                onChange={handlePassChange}
                placeholder="Masukkan password baru"
                className="form-input text-sm"
                required
              />
            </div>

            <div>
              <label className="form-label">Konfirmasi Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passForm.confirmPassword}
                onChange={handlePassChange}
                placeholder="Ulangi password baru"
                className="form-input text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-md mt-6 cursor-pointer border-none"
            >
              <Save size={16} />
              {isSaving ? "Menyimpan..." : "Ubah Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
