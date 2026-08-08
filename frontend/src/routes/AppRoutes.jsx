import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import AlumniLayout from "../layouts/AlumniLayout";
import AdminProdiLayout from "../layouts/AdminProdiLayout";

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
import AdminProdiPage from "../pages/admin/AdminProdiPage";

// Admin Tracer Pages
import TracerPeriodPage from "../pages/admin/tracer/PeriodePage";
import TracerQuestionPage from "../pages/admin/tracer/PertanyaanPage";
import TracerHasilPage from "../pages/admin/tracer/HasilPage";
import TracerLaporanPage from "../pages/admin/tracer/LaporanTracerPage";

// Admin Prodi Pages
import AdminProdiDashboard from "../pages/admin-prodi/DashboardPage";
import AdminProdiAlumniPage from "../pages/admin-prodi/AlumniPage";
import AdminProdiPertanyaanPage from "../pages/admin-prodi/PertanyaanPage";
import AdminProdiHasilPage from "../pages/admin-prodi/HasilPage";
import AdminProdiProfil from "../pages/admin-prodi/ProfilPage";

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
                <Route path="admin-prodi" element={<AdminProdiPage />} />
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

      {/* Admin Prodi Routes */}
      <Route
        path="/admin-prodi/*"
        element={
          <ProtectedRoute role="ADMIN_PRODI">
            <AdminProdiLayout>
              <Routes>
                <Route path="dashboard" element={<AdminProdiDashboard />} />
                <Route path="alumni" element={<AdminProdiAlumniPage />} />
                <Route path="alumni/create" element={<AlumniCreatePage />} />
                <Route path="alumni/edit/:id" element={<AlumniEditPage />} />
                <Route path="tracer-pertanyaan" element={<AdminProdiPertanyaanPage />} />
                <Route path="tracer-hasil" element={<AdminProdiHasilPage />} />
                <Route path="profil" element={<AdminProdiProfil />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </AdminProdiLayout>
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

