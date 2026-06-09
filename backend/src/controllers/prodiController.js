const prisma = require("../config/prisma");

// GET /api/v1/prodi
const getAll = async (req, res) => {
  try {
    const prodi = await prisma.programStudi.findMany({
      orderBy: { namaProdi: "asc" },
      include: { _count: { select: { alumni: true } } },
    });
    return res.status(200).json({ success: true, data: prodi });
  } catch (error) {
    console.error("Get prodi error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// POST /api/v1/prodi
const create = async (req, res) => {
  try {
    const { namaProdi } = req.body;
    if (!namaProdi || !namaProdi.trim()) {
      return res.status(400).json({ success: false, message: "Nama program studi wajib diisi" });
    }

    const existing = await prisma.programStudi.findFirst({
      where: { namaProdi: { equals: namaProdi.trim() } },
    });
    if (existing) {
      return res.status(409).json({ success: false, message: "Program studi sudah ada" });
    }

    const prodi = await prisma.programStudi.create({
      data: { namaProdi: namaProdi.trim() },
    });
    return res.status(201).json({ success: true, message: "Program studi berhasil ditambahkan", data: prodi });
  } catch (error) {
    console.error("Create prodi error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// PUT /api/v1/prodi/:id
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { namaProdi } = req.body;

    if (!namaProdi || !namaProdi.trim()) {
      return res.status(400).json({ success: false, message: "Nama program studi wajib diisi" });
    }

    const prodi = await prisma.programStudi.findUnique({ where: { id: parseInt(id) } });
    if (!prodi) {
      return res.status(404).json({ success: false, message: "Program studi tidak ditemukan" });
    }

    const updated = await prisma.programStudi.update({
      where: { id: parseInt(id) },
      data: { namaProdi: namaProdi.trim() },
    });
    return res.status(200).json({ success: true, message: "Program studi berhasil diupdate", data: updated });
  } catch (error) {
    console.error("Update prodi error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// DELETE /api/v1/prodi/:id
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const prodi = await prisma.programStudi.findUnique({
      where: { id: parseInt(id) },
      include: { _count: { select: { alumni: true } } },
    });

    if (!prodi) {
      return res.status(404).json({ success: false, message: "Program studi tidak ditemukan" });
    }
    if (prodi._count.alumni > 0) {
      return res.status(400).json({
        success: false,
        message: `Tidak dapat menghapus. Masih ada ${prodi._count.alumni} alumni di program studi ini.`,
      });
    }

    await prisma.programStudi.delete({ where: { id: parseInt(id) } });
    return res.status(200).json({ success: true, message: "Program studi berhasil dihapus" });
  } catch (error) {
    console.error("Delete prodi error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

module.exports = { getAll, create, update, remove };
