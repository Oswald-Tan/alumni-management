import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  LogOut,
  GraduationCap,
  ChevronDown,
  ChevronRight,
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
    path: "/admin-prodi/dashboard",
  },
  {
    label: "Data Alumni",
    icon: BookOpen,
    path: "/admin-prodi/alumni",
  },
  {
    label: "Tracer Study",
    icon: BarChart3,
    children: [
      { label: "Pertanyaan Kuisioner", path: "/admin-prodi/tracer-pertanyaan" },
      { label: "Monitoring Hasil", path: "/admin-prodi/tracer-hasil" },
    ],
  },
];

export default function AdminProdiLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [openMenus, setOpenMenus] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Otomatis tutup sidebar di mobile jika rute berubah
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (path) => location.pathname === path;
  const isParentActive = (children) =>
    children?.some((c) => location.pathname.startsWith(c.path));

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
      <header className="bg-linear-to-r from-[#065f46] via-[#059669] to-[#10b981] text-white py-4 px-6 flex items-center justify-between lg:hidden border-b border-white/10 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 hover:bg-emerald-800 rounded-lg text-emerald-200 hover:text-white transition-colors cursor-pointer"
          >
            <Menu size={22} />
          </button>
          <span className="font-extrabold text-sm tracking-wide">
            SiAlumni Admin Prodi
          </span>
        </div>
        {user?.foto ? (
          <img
            src={`http://localhost:5000/uploads/foto/${user.foto}`}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover shadow-md shadow-emerald-900/20"
          />
        ) : (
          <div className="w-8 h-8 bg-emerald-700 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md shadow-emerald-700/25">
            {user?.name?.charAt(0) || "A"}
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
      <aside className={`sidebar sidebar-admin-prodi ${isSidebarOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-tight">
                SiAlumni
              </p>
              <p className="text-emerald-200/80 text-xs">Admin Prodi</p>
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

            if (item.children) {
              const isOpen =
                openMenus[item.label] ?? isParentActive(item.children);
              return (
                <div key={item.label}>
                  <div
                    role="button"
                    onClick={() => toggleMenu(item.label)}
                    className={`sidebar-nav-item justify-between ${
                      isParentActive(item.children) ? "text-white" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </div>
                    {isOpen ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </div>
                  {isOpen && (
                    <div className="ml-4 border-l border-white/15 pl-2 mt-1 mb-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`sidebar-nav-item text-xs py-2 ${
                            isActive(child.path) ? "active" : ""
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

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
        <div className="border-t border-white/15 p-4">
          <Link
            to="/admin-prodi/profil"
            className="flex items-center gap-3 mb-3 hover:opacity-80 transition-opacity"
          >
            {user?.foto ? (
              <img
                src={`http://localhost:5000/uploads/foto/${user.foto}`}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                {user?.name?.charAt(0) || "A"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user?.name || "Admin Prodi"}
              </p>
              {user?.jurusan && (
                <p className="text-emerald-300 text-[10px] font-semibold uppercase tracking-wider truncate">
                  {user.jurusan.namaProdi}
                </p>
              )}
              <p className="text-emerald-200/60 text-xs truncate mt-0.5">{user?.email}</p>
            </div>
          </Link>
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
      <main className="main-content flex-1">{children}</main>
    </div>
  );
}
