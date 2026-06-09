import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";

// Auth
import LoginPage from "../pages/LoginPage";

// Admin Pages
import AdminDashboard from "../pages/admin/DashboardPage";
import AlumniPage from "../pages/admin/AlumniPage";
import AlumniCreatePage from "../pages/admin/AlumniCreatePage";
import AlumniEditPage from "../pages/admin/AlumniEditPage";
import ProgramStudiPage from "../pages/admin/ProgramStudiPage";
import LaporanPage from "../pages/admin/LaporanPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="alumni" element={<AlumniPage />} />
                <Route path="alumni/create" element={<AlumniCreatePage />} />
                <Route path="alumni/edit/:id" element={<AlumniEditPage />} />
                <Route path="program-studi" element={<ProgramStudiPage />} />
                <Route path="laporan" element={<LaporanPage />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}
