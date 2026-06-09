/**
 * Middleware untuk autentikasi berbasis session
 */

// Cek apakah user sudah login
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: "Silakan login terlebih dahulu",
  });
};

// Cek apakah user adalah Admin
const isAdmin = (req, res, next) => {
  if (req.session && req.session.userId && req.session.role === "ADMIN") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Akses ditolak. Hanya admin yang dapat mengakses fitur ini.",
  });
};

// Cek apakah user adalah Alumni
const isAlumni = (req, res, next) => {
  if (req.session && req.session.userId && req.session.role === "ALUMNI") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Akses ditolak. Hanya alumni yang dapat mengakses fitur ini.",
  });
};

// Cek apakah sudah login (admin atau alumni)
const isAuthenticatedAny = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: "Silakan login terlebih dahulu",
  });
};

module.exports = { isAuthenticated, isAdmin, isAlumni, isAuthenticatedAny };
