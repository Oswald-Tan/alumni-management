import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import AlumniLayout from "../layouts/AlumniLayout";

// Auth
import LoginPage from "../pages/LoginPage";

// Admin Pages
import AdminDashboard from "../pages/admin/DashboardPage";
import AlumniPage from "../pages/admin/AlumniPage";
import AlumniCreatePage from "../pages/admin/AlumniCreatePage";
import AlumniEditPage from "../pages/admin/AlumniEditPage";
import JurusanPage from "../pages/admin/JurusanPage";
import LaporanPage from "../pages/admin/LaporanPage";
import AdminProfil from "../pages/admin/ProfilPage";

// Admin Tracer Pages
import TracerPeriodPage from "../pages/admin/tracer/PeriodePage";
import TracerQuestionPage from "../pages/admin/tracer/PertanyaanPage";
import TracerHasilPage from "../pages/admin/tracer/HasilPage";
import TracerLaporanPage from "../pages/admin/tracer/LaporanTracerPage";

// Alumni Pages
import AlumniDashboard from "../pages/alumni/DashboardPage";
import AlumniProfil from "../pages/alumni/ProfilPage";
import AlumniStatus from "../pages/alumni/StatusPage";
import AlumniTracer from "../pages/alumni/TracerPage";

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
                <Route path="jurusan" element={<JurusanPage />} />
                <Route path="laporan" element={<LaporanPage />} />
                <Route path="profil" element={<AdminProfil />} />
                
                {/* Tracer Study */}
                <Route path="tracer-periode" element={<TracerPeriodPage />} />
                <Route path="tracer-pertanyaan" element={<TracerQuestionPage />} />
                <Route path="tracer-hasil" element={<TracerHasilPage />} />
                <Route path="tracer-laporan" element={<TracerLaporanPage />} />

                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Alumni Routes */}
      <Route
        path="/alumni/*"
        element={
          <ProtectedRoute role="ALUMNI">
            <AlumniLayout>
              <Routes>
                <Route path="dashboard" element={<AlumniDashboard />} />
                <Route path="profil" element={<AlumniProfil />} />
                <Route path="status" element={<AlumniStatus />} />
                <Route path="tracer" element={<AlumniTracer />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </AlumniLayout>
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
