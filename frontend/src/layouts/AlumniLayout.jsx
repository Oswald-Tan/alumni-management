import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  GraduationCap,
  ClipboardCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, selectUser } from "../features/auth/authSlice";
import { logout } from "../services/authService";
import { toast } from "react-toastify";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/alumni/dashboard",
  },
  {
    label: "Profil Saya",
    icon: User,
    path: "/alumni/profil",
  },
  {
    label: "Status Kelulusan",
    icon: GraduationCap,
    path: "/alumni/status",
  },
  {
    label: "Tracer Study",
    icon: ClipboardCheck,
    path: "/alumni/tracer",
  },
];

export default function AlumniLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Otomatis tutup sidebar di mobile jika rute berubah
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (_) {}
    dispatch(clearUser());
    navigate("/login");
    toast.success("Berhasil logout");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="bg-slate-900 text-white py-4 px-6 flex items-center justify-between lg:hidden border-b border-slate-800 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <Menu size={22} />
          </button>
          <span className="font-extrabold text-sm tracking-wide">Portal Alumni</span>
        </div>
        {user?.foto ? (
          <img
            src={`http://localhost:5000/uploads/foto/${user.foto}`}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover shadow-md shadow-teal-900/20"
          />
        ) : (
          <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md shadow-teal-500/25">
            {user?.name?.charAt(0) || "U"}
          </div>
        )}
      </header>

      {/* Sidebar Backdrop Overlay on Mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center">
              <ClipboardCheck size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-tight">Portal Alumni</p>
              <p className="text-slate-400 text-xs">Politeknik Negeri Manado</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-nav-item ${isActive(item.path) ? "active" : ""}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="border-t border-slate-700 p-4">
          <div className="flex items-center gap-3 mb-3">
            {user?.foto ? (
              <img
                src={`http://localhost:5000/uploads/foto/${user.foto}`}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                {user?.name?.charAt(0) || "U"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name || "Alumni"}</p>
              <p className="text-slate-400 text-xs truncate">NIM: {user?.nim}</p>
            </div>
          </div>
          <div
            role="button"
            onClick={handleLogout}
            className="sidebar-nav-item text-red-400 hover:bg-red-900/20 hover:text-red-300"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content flex-1">
        {children}
      </main>
    </div>
  );
}
