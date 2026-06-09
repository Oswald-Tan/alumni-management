const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");

// POST /api/v1/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email dan password wajib diisi" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "Email atau password salah" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Email atau password salah" });
    }

    // Simpan ke session (Hardcode role ADMIN untuk kecocokan frontend)
    req.session.userId = user.id;
    req.session.role = "ADMIN";
    req.session.name = user.name;
    req.session.email = user.email;

    return res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: "ADMIN",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// POST /api/v1/auth/logout
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Gagal logout" });
    }
    res.clearCookie("alumni.sid");
    return res.status(200).json({ success: true, message: "Logout berhasil" });
  });
};

// GET /api/v1/auth/profile
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    // Kembalikan objek yang kompatibel dengan frontend
    return res.status(200).json({
      success: true,
      data: {
        ...user,
        role: "ADMIN",
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// GET /api/v1/auth/me (cek session)
const checkSession = (req, res) => {
  if (req.session && req.session.userId) {
    return res.status(200).json({
      success: true,
      data: {
        id: req.session.userId,
        role: "ADMIN",
        name: req.session.name,
        email: req.session.email,
      },
    });
  }
  return res.status(401).json({ success: false, message: "Tidak ada sesi aktif" });
};

module.exports = { login, logout, getProfile, checkSession };
