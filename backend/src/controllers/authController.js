const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");
const fs = require("fs");
const path = require("path");

// POST /api/v1/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body; // 'email' field can contain email (Admin) or NIM (Alumni)

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email/NIM dan password wajib diisi" });
    }

    let user = null;
    let role = null;
    let name = null;
    let userEmail = null;
    let userNim = null;

    // Deteksi apakah input email adalah format email (ada karakter '@')
    const isEmail = email.includes("@");

    if (isEmail) {
      // Cari sebagai Admin
      const admin = await prisma.user.findUnique({
        where: { email },
      });

      if (admin) {
        const isMatch = await bcrypt.compare(password, admin.password);
        if (isMatch) {
          user = admin;
          role = "ADMIN";
          name = admin.name;
          userEmail = admin.email;
        }
      }
    } else {
      // Cari sebagai Alumni (NIM)
      const alumni = await prisma.alumni.findUnique({
        where: { nim: email },
      });

      if (alumni) {
        const isMatch = await bcrypt.compare(password, alumni.password);
        if (isMatch) {
          user = alumni;
          role = "ALUMNI";
          name = alumni.nama;
          userNim = alumni.nim;
        }
      }
    }

    if (!user) {
      return res.status(401).json({ success: false, message: "Email/NIM atau password salah" });
    }

    // Simpan ke session
    req.session.userId = user.id;
    req.session.role = role;
    req.session.name = name;
    req.session.foto = user.foto || null;
    if (userEmail) req.session.email = userEmail;
    if (userNim) req.session.nim = userNim;

    return res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: {
        id: user.id,
        name: name,
        email: userEmail,
        nim: userNim,
        role: role,
        foto: user.foto || null,
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
    const role = req.session.role;
    if (role === "ADMIN") {
      const user = await prisma.user.findUnique({
        where: { id: req.session.userId },
        select: {
          id: true,
          name: true,
          email: true,
          foto: true,
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({ success: false, message: "Admin tidak ditemukan" });
      }

      return res.status(200).json({
        success: true,
        data: {
          ...user,
          role: "ADMIN",
        },
      });
    } else if (role === "ALUMNI") {
      const alumni = await prisma.alumni.findUnique({
        where: { id: req.session.userId },
        include: {
          jurusan: true,
        },
      });

      if (!alumni) {
        return res.status(404).json({ success: false, message: "Alumni tidak ditemukan" });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: alumni.id,
          name: alumni.nama,
          nim: alumni.nim,
          jurusan: alumni.jurusan,
          foto: alumni.foto,
          tanggalWisuda: alumni.tanggalWisuda,
          tanggalKelulusan: alumni.tanggalKelulusan,
          nomorIjazah: alumni.nomorIjazah,
          tanggalPengambilanIjazah: alumni.tanggalPengambilanIjazah,
          role: "ALUMNI",
        },
      });
    }

    return res.status(401).json({ success: false, message: "Tidak terautorisasi" });
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
        role: req.session.role,
        name: req.session.name,
        email: req.session.email || null,
        nim: req.session.nim || null,
        foto: req.session.foto || null,
      },
    });
  }
  return res.status(401).json({ success: false, message: "Tidak ada sesi aktif" });
};

// PUT /api/v1/auth/profile/foto (Upload foto profil Admin)
const updateProfileFoto = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId || req.session.role !== "ADMIN") {
      if (req.file) {
        try { fs.unlinkSync(req.file.path); } catch (_) {}
      }
      return res.status(401).json({ success: false, message: "Hanya admin yang dapat memperbarui foto profil ini" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      if (req.file) {
        try { fs.unlinkSync(req.file.path); } catch (_) {}
      }
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Tidak ada file foto yang diunggah" });
    }

    // Hapus foto lama
    if (user.foto) {
      const oldPath = path.join(__dirname, "../../uploads/foto", user.foto);
      if (fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath); } catch (_) {}
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { foto: req.file.filename },
    });

    req.session.foto = updated.foto;

    return res.status(200).json({
      success: true,
      message: "Foto profil admin berhasil diperbarui",
      data: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        foto: updated.foto,
      },
    });
  } catch (error) {
    console.error("Update admin foto error:", error);
    if (req.file) {
      try { fs.unlinkSync(req.file.path); } catch (_) {}
    }
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

const deleteProfileFoto = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId || req.session.role !== "ADMIN") {
      return res.status(401).json({ success: false, message: "Hanya admin yang dapat menghapus foto profil ini" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    // Hapus file fisik jika ada
    if (user.foto) {
      const filePath = path.join(__dirname, "../../uploads/foto", user.foto);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (_) {}
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { foto: null },
    });

    req.session.foto = null;

    return res.status(200).json({
      success: true,
      message: "Foto profil admin berhasil dihapus",
      data: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        foto: null,
      },
    });
  } catch (error) {
    console.error("Delete admin foto error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

module.exports = { login, logout, getProfile, checkSession, updateProfileFoto, deleteProfileFoto };
