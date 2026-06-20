const prisma = require("../config/prisma");

// GET /api/v1/jurusan
const getAll = async (req, res) => {
  try {
    const jurusan = await prisma.jurusan.findMany({
      orderBy: { namaProdi: "asc" },
      include: { _count: { select: { alumni: true } } },
    });
    return res.status(200).json({ success: true, data: jurusan });
  } catch (error) {
    console.error("Get jurusan error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// POST /api/v1/jurusan
const create = async (req, res) => {
  try {
    const { namaJurusan, namaProdi, jenjang, akreditasi } = req.body;
    if (!namaJurusan || !namaJurusan.trim()) {
      return res.status(400).json({ success: false, message: "Nama jurusan wajib diisi" });
    }
    if (!namaProdi || !namaProdi.trim()) {
      return res.status(400).json({ success: false, message: "Nama program studi wajib diisi" });
    }

    const existing = await prisma.jurusan.findFirst({
      where: {
        namaProdi: { equals: namaProdi.trim() },
        namaJurusan: { equals: namaJurusan.trim() },
      },
    });
    if (existing) {
      return res.status(409).json({ success: false, message: "Program studi di jurusan tersebut sudah ada" });
    }

    const newJurusan = await prisma.jurusan.create({
      data: {
        namaJurusan: namaJurusan.trim(),
        namaProdi: namaProdi.trim(),
        jenjang: jenjang ? jenjang.trim() : null,
        akreditasi: akreditasi ? akreditasi.trim() : null,
      },
    });
    return res.status(201).json({ success: true, message: "Jurusan berhasil ditambahkan", data: newJurusan });
  } catch (error) {
    console.error("Create jurusan error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// PUT /api/v1/jurusan/:id
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { namaJurusan, namaProdi, jenjang, akreditasi } = req.body;

    if (!namaJurusan || !namaJurusan.trim()) {
      return res.status(400).json({ success: false, message: "Nama jurusan wajib diisi" });
    }
    if (!namaProdi || !namaProdi.trim()) {
      return res.status(400).json({ success: false, message: "Nama program studi wajib diisi" });
    }

    const jurusan = await prisma.jurusan.findUnique({ where: { id: parseInt(id) } });
    if (!jurusan) {
      return res.status(404).json({ success: false, message: "Jurusan tidak ditemukan" });
    }

    const updated = await prisma.jurusan.update({
      where: { id: parseInt(id) },
      data: {
        namaJurusan: namaJurusan.trim(),
        namaProdi: namaProdi.trim(),
        jenjang: jenjang ? jenjang.trim() : null,
        akreditasi: akreditasi ? akreditasi.trim() : null,
      },
    });
    return res.status(200).json({ success: true, message: "Jurusan berhasil diupdate", data: updated });
  } catch (error) {
    console.error("Update jurusan error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// DELETE /api/v1/jurusan/:id
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const jurusan = await prisma.jurusan.findUnique({
      where: { id: parseInt(id) },
      include: { _count: { select: { alumni: true } } },
    });

    if (!jurusan) {
      return res.status(404).json({ success: false, message: "Jurusan tidak ditemukan" });
    }
    if (jurusan._count.alumni > 0) {
      return res.status(400).json({
        success: false,
        message: `Tidak dapat menghapus. Masih ada ${jurusan._count.alumni} alumni di jurusan/prodi ini.`,
      });
    }

    await prisma.jurusan.delete({ where: { id: parseInt(id) } });
    return res.status(200).json({ success: true, message: "Jurusan berhasil dihapus" });
  } catch (error) {
    console.error("Delete jurusan error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

module.exports = { getAll, create, update, remove };
