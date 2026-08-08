const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");

// GET /api/v1/admin-prodi — Daftar semua admin prodi
const getAll = async (req, res) => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN_PRODI" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        jurusanId: true,
        foto: true,
        createdAt: true,
        jurusan: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ success: true, data: admins });
  } catch (error) {
    console.error("Get all admin prodi error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// POST /api/v1/admin-prodi — Buat akun admin prodi baru
const create = async (req, res) => {
  try {
    const { name, email, password, jurusanId } = req.body;

    if (!name || !email || !password || !jurusanId) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, password, dan jurusan/prodi wajib diisi",
      });
    }

    // Cek email duplikat
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email sudah digunakan" });
    }

    // Cek jurusan valid
    const jurusan = await prisma.jurusan.findUnique({ where: { id: parseInt(jurusanId) } });
    if (!jurusan) {
      return res.status(404).json({ success: false, message: "Jurusan/Prodi tidak ditemukan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN_PRODI",
        jurusanId: parseInt(jurusanId),
      },
      include: { jurusan: true },
    });

    return res.status(201).json({
      success: true,
      message: "Admin Prodi berhasil ditambahkan",
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        jurusanId: admin.jurusanId,
        jurusan: admin.jurusan,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    console.error("Create admin prodi error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// PUT /api/v1/admin-prodi/:id — Update akun admin prodi
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, jurusanId } = req.body;

    const existing = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!existing || existing.role !== "ADMIN_PRODI") {
      return res.status(404).json({ success: false, message: "Admin Prodi tidak ditemukan" });
    }

    // Cek email duplikat jika diubah
    if (email && email !== existing.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email } });
      if (emailTaken) {
        return res.status(409).json({ success: false, message: "Email sudah digunakan" });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (jurusanId) updateData.jurusanId = parseInt(jurusanId);
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { jurusan: true },
    });

    return res.status(200).json({
      success: true,
      message: "Admin Prodi berhasil diupdate",
      data: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        jurusanId: updated.jurusanId,
        jurusan: updated.jurusan,
      },
    });
  } catch (error) {
    console.error("Update admin prodi error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// DELETE /api/v1/admin-prodi/:id — Hapus akun admin prodi
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!existing || existing.role !== "ADMIN_PRODI") {
      return res.status(404).json({ success: false, message: "Admin Prodi tidak ditemukan" });
    }

    await prisma.user.delete({ where: { id: parseInt(id) } });

    return res.status(200).json({ success: true, message: "Admin Prodi berhasil dihapus" });
  } catch (error) {
    console.error("Delete admin prodi error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

module.exports = { getAll, create, update, remove };
