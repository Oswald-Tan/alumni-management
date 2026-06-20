import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from "../../features/auth/authSlice";
import { getProfile, updateAdminFoto, deleteAdminFoto } from "../../services/authService";
import { User, Mail, Shield, BookOpen } from "lucide-react";
import { toast } from "react-toastify";
import ProfilePhotoUpload from "../../components/ProfilePhotoUpload";

export default function ProfilPage() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [adminDetail, setAdminDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((res) => {
        setAdminDetail(res.data.data);
      })
      .catch(() => {
        toast.error("Gagal memuat profil admin");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleUploadSuccess = (newFoto) => {
    setAdminDetail((prev) => ({ ...prev, foto: newFoto }));
    dispatch(setUser({ ...user, foto: newFoto }));
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
          <h1 className="page-title">Profil Saya (Admin)</h1>
          <p className="page-subtitle">Kelola foto profil dan informasi akun administrator Anda</p>
        </div>
      </div>

      <div className="max-w-3xl">
        {/* Profile Card Info */}
        <div className="card shadow-md border border-slate-100 p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8 pb-6 border-b border-slate-100">
            <ProfilePhotoUpload
              currentFoto={adminDetail?.foto}
              onUploadSuccess={handleUploadSuccess}
              uploadService={updateAdminFoto}
              deleteService={deleteAdminFoto}
              roleTheme="blue"
            />
            <div className="flex-1 w-full text-center sm:text-left mt-2">
              <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Administrator
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-3">{adminDetail?.name}</h2>
              <p className="text-sm text-slate-500 font-mono mt-0.5">{adminDetail?.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-800 border-l-4 border-blue-600 pl-3">Informasi Akun</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Nama Administrator</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{adminDetail?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Email Kontak</p>
                  <p className="text-sm font-mono font-medium text-slate-800 mt-0.5">{adminDetail?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 sm:col-span-2">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Role Sistem</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">Admin Utama (Akses Penuh)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
