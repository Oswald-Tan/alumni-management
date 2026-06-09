import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  LogOut,
  GraduationCap,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, selectUser } from "../features/auth/authSlice";
import { logout } from "../services/authService";
import { toast } from "react-toastify";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    label: "Master Data",
    icon: BookOpen,
    children: [
      { label: "Program Studi", path: "/admin/program-studi" },
      { label: "Data Alumni", path: "/admin/alumni" },
    ],
  },
  {
    label: "Laporan",
    icon: BarChart3,
    path: "/admin/laporan",
  },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [openMenus, setOpenMenus] = useState({});

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
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-tight">SiAlumni</p>
              <p className="text-slate-400 text-xs">Politeknik Negeri Manado</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            if (item.children) {
              const isOpen = openMenus[item.label] ?? isParentActive(item.children);
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
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </div>
                  {isOpen && (
                    <div className="ml-4 border-l border-slate-700 pl-2 mt-1 mb-1">
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
        <div className="border-t border-slate-700 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name || "Admin"}</p>
              <p className="text-slate-400 text-xs truncate">{user?.email}</p>
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
