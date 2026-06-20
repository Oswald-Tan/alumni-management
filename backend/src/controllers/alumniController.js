const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const puppeteer = require("puppeteer-core");
const ExcelJS = require("exceljs");
const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");

const statusLabel = {
  TERDAFTAR_WISUDA: "Terdaftar Wisuda",
  LULUS: "Lulus",
  IJAZAH_TERBIT: "Ijazah Terbit",
  IJAZAH_DIAMBIL: "Ijazah Diambil",
};

const deriveStatus = (alumni) => {
  if (alumni.tanggalPengambilanIjazah) return "IJAZAH_DIAMBIL";
  if (alumni.nomorIjazah && alumni.nomorIjazah.trim() !== "") return "IJAZAH_TERBIT";
  if (alumni.tanggalKelulusan) return "LULUS";
  if (alumni.tanggalWisuda) return "TERDAFTAR_WISUDA";
  return "TERDAFTAR_WISUDA";
};

// Deteksi otomatis Google Chrome atau Microsoft Edge di Windows
const getChromePath = () => {
  const paths = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
};

// GET /api/v1/alumni
const getAll = async (req, res) => {
  try {
    const { search, jurusanId, status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { nama: { contains: search } },
        { nim: { contains: search } },
        { nomorIjazah: { contains: search } },
      ];
    }
    if (jurusanId) where.jurusanId = parseInt(jurusanId);

    // Filter by derived status
    if (status) {
      if (status === "IJAZAH_DIAMBIL") {
        where.tanggalPengambilanIjazah = { not: null };
      } else if (status === "IJAZAH_TERBIT") {
        where.tanggalPengambilanIjazah = null;
        where.nomorIjazah = { not: null, not: "" };
      } else if (status === "LULUS") {
        where.tanggalPengambilanIjazah = null;
        where.nomorIjazah = null;
        where.tanggalKelulusan = { not: null };
      } else if (status === "TERDAFTAR_WISUDA") {
        where.tanggalPengambilanIjazah = null;
        where.nomorIjazah = null;
        where.tanggalKelulusan = null;
        where.tanggalWisuda = { not: null };
      }
    }

    const [alumni, total] = await Promise.all([
      prisma.alumni.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          jurusan: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.alumni.count({ where }),
    ]);

    // Map to include derived statusAlumni
    const mappedAlumni = alumni.map((a) => ({
      ...a,
      statusAlumni: deriveStatus(a),
    }));

    return res.status(200).json({
      success: true,
      data: mappedAlumni,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get alumni error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// GET /api/v1/alumni/:id
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const alumni = await prisma.alumni.findUnique({
      where: { id: parseInt(id) },
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
        ...alumni,
        statusAlumni: deriveStatus(alumni),
      },
    });
  } catch (error) {
    console.error("Get alumni by id error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// POST /api/v1/alumni
const create = async (req, res) => {
  try {
    const { nim, nama, jurusanId, tanggalWisuda, tanggalKelulusan, nomorIjazah, tanggalPengambilanIjazah, password } = req.body;

    if (!nim || !nama || !jurusanId) {
      return res.status(400).json({ success: false, message: "NIM, nama, dan Jurusan/Program Studi wajib diisi" });
    }

    // Cek duplikat NIM
    const existingAlumni = await prisma.alumni.findUnique({ where: { nim } });
    if (existingAlumni) {
      return res.status(409).json({ success: false, message: "NIM sudah digunakan" });
    }

    // Hash password (default ke NIM jika tidak diisi)
    const pwdToHash = password || nim;
    const hashedPassword = await bcrypt.hash(pwdToHash, 10);

    const alumni = await prisma.alumni.create({
      data: {
        nim,
        nama,
        password: hashedPassword,
        jurusanId: parseInt(jurusanId),
        tanggalWisuda: tanggalWisuda ? new Date(tanggalWisuda) : null,
        tanggalKelulusan: tanggalKelulusan ? new Date(tanggalKelulusan) : null,
        nomorIjazah: nomorIjazah || null,
        tanggalPengambilanIjazah: tanggalPengambilanIjazah ? new Date(tanggalPengambilanIjazah) : null,
      },
      include: { jurusan: true },
    });

    return res.status(201).json({
      success: true,
      message: "Alumni berhasil ditambahkan",
      data: {
        ...alumni,
        statusAlumni: deriveStatus(alumni),
      },
    });
  } catch (error) {
    console.error("Create alumni error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// PUT /api/v1/alumni/:id
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nim, nama, jurusanId, tanggalWisuda, tanggalKelulusan, nomorIjazah, tanggalPengambilanIjazah, password } = req.body;

    const alumni = await prisma.alumni.findUnique({ where: { id: parseInt(id) } });
    if (!alumni) {
      return res.status(404).json({ success: false, message: "Alumni tidak ditemukan" });
    }

    const isAlumni = req.session.role === "ALUMNI";
    const updateData = {};

    if (isAlumni) {
      if (password && password.trim() !== "") {
        updateData.password = await bcrypt.hash(password, 10);
      } else {
        return res.status(400).json({ success: false, message: "Tidak ada data yang diubah" });
      }
    } else {
      // Cek NIM duplikat (kalau diubah)
      if (nim && nim !== alumni.nim) {
        const existing = await prisma.alumni.findUnique({ where: { nim } });
        if (existing) {
          return res.status(409).json({ success: false, message: "NIM sudah digunakan alumni lain" });
        }
      }

      updateData.nama = nama;
      updateData.nim = nim;
      updateData.jurusanId = jurusanId ? parseInt(jurusanId) : undefined;
      updateData.tanggalWisuda = tanggalWisuda !== undefined ? (tanggalWisuda ? new Date(tanggalWisuda) : null) : undefined;
      updateData.tanggalKelulusan = tanggalKelulusan !== undefined ? (tanggalKelulusan ? new Date(tanggalKelulusan) : null) : undefined;
      updateData.nomorIjazah = nomorIjazah !== undefined ? (nomorIjazah || null) : undefined;
      updateData.tanggalPengambilanIjazah = tanggalPengambilanIjazah !== undefined ? (tanggalPengambilanIjazah ? new Date(tanggalPengambilanIjazah) : null) : undefined;

      if (password && password.trim() !== "") {
        updateData.password = await bcrypt.hash(password, 10);
      }
    }

    const updated = await prisma.alumni.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { jurusan: true },
    });

    return res.status(200).json({
      success: true,
      message: "Data alumni berhasil diupdate",
      data: {
        ...updated,
        statusAlumni: deriveStatus(updated),
      },
    });
  } catch (error) {
    console.error("Update alumni error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// DELETE /api/v1/alumni/:id
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const alumni = await prisma.alumni.findUnique({ where: { id: parseInt(id) } });

    if (!alumni) {
      return res.status(404).json({ success: false, message: "Alumni tidak ditemukan" });
    }

    await prisma.alumni.delete({ where: { id: parseInt(id) } });

    return res.status(200).json({ success: true, message: "Alumni berhasil dihapus" });
  } catch (error) {
    console.error("Delete alumni error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// GET /api/v1/alumni/export/excel
const exportExcel = async (req, res) => {
  try {
    const { jurusanId, year, statusIjazah } = req.query;

    const where = {};
    if (jurusanId) where.jurusanId = parseInt(jurusanId);
    if (year) {
      const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
      const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
      where.tanggalKelulusan = {
        gte: startOfYear,
        lte: endOfYear,
      };
    }
    if (statusIjazah) {
      if (statusIjazah === "SUDAH") {
        where.tanggalPengambilanIjazah = { not: null };
      } else if (statusIjazah === "BELUM") {
        where.tanggalPengambilanIjazah = null;
      }
    }

    const alumni = await prisma.alumni.findMany({
      where,
      include: { jurusan: true },
      orderBy: { nama: "asc" },
    });

    const mappedAlumni = alumni.map((a) => ({
      ...a,
      statusAlumni: deriveStatus(a),
    }));

    let prodiName = "Semua Jurusan / Prodi";
    if (jurusanId) {
      const p = await prisma.jurusan.findUnique({ where: { id: parseInt(jurusanId) } });
      if (p) prodiName = `${p.namaJurusan} / ${p.namaProdi}`;
    }

    const formattedDate = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laporan Alumni");

    // Title & Headers
    worksheet.mergeCells("A1:I1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "LAPORAN REKAPITULASI DATA ALUMNI";
    titleCell.font = { name: "Arial", size: 16, bold: true };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.mergeCells("A2:I2");
    const subtitleCell = worksheet.getCell("A2");
    subtitleCell.value = "POLITEKNIK NEGERI MANADO";
    subtitleCell.font = { name: "Arial", size: 11, italic: true };
    subtitleCell.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.addRow([]); // Blank row 3

    // Metadata
    worksheet.getCell("A4").value = "Jurusan / Prodi:";
    worksheet.getCell("A4").font = { bold: true, color: { argb: "FF475569" } };
    worksheet.getCell("B4").value = prodiName;

    worksheet.getCell("G4").value = "Tanggal Ekspor:";
    worksheet.getCell("G4").font = { bold: true, color: { argb: "FF475569" } };
    worksheet.getCell("H4").value = formattedDate;

    worksheet.getCell("A5").value = "Tahun Kelulusan:";
    worksheet.getCell("A5").font = { bold: true, color: { argb: "FF475569" } };
    worksheet.getCell("B5").value = year || "Semua Tahun";

    worksheet.getCell("G5").value = "Status Ijazah:";
    worksheet.getCell("G5").font = { bold: true, color: { argb: "FF475569" } };
    worksheet.getCell("H5").value = statusIjazah === "SUDAH" ? "Sudah Diambil" : statusIjazah === "BELUM" ? "Belum Diambil" : "Semua Status";

    worksheet.addRow([]); // Blank row 6

    // Columns
    const headerRowNumber = 7;
    const columns = [
      { header: "No", key: "no", width: 6 },
      { header: "Nama Lengkap", key: "nama", width: 30 },
      { header: "NIM", key: "nim", width: 16 },
      { header: "Jurusan / Program Studi", key: "prodi", width: 35 },
      { header: "Tanggal Kelulusan", key: "tglLulus", width: 18 },
      { header: "Tanggal Wisuda", key: "tglWisuda", width: 18 },
      { header: "Nomor Ijazah", key: "nomorIjazah", width: 18 },
      { header: "Tanggal Pengambilan", key: "tglAmbil", width: 22 },
      { header: "Status Arsip", key: "status", width: 18 },
    ];

    worksheet.columns = columns;

    // Header styling
    const headerRow = worksheet.getRow(headerRowNumber);
    headerRow.values = columns.map(c => c.header);
    headerRow.height = 26;
    headerRow.eachCell((cell) => {
      cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF2563EB" }, // Primary blue color
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin", color: { argb: "FF1E3A8A" } },
        bottom: { style: "thin", color: { argb: "FF1E3A8A" } },
        left: { style: "thin", color: { argb: "FF1E3A8A" } },
        right: { style: "thin", color: { argb: "FF1E3A8A" } },
      };
    });

    // Add data
    mappedAlumni.forEach((a, idx) => {
      const tglLulus = a.tanggalKelulusan ? new Date(a.tanggalKelulusan).toLocaleDateString("id-ID") : "-";
      const tglWisuda = a.tanggalWisuda ? new Date(a.tanggalWisuda).toLocaleDateString("id-ID") : "-";
      const tglAmbil = a.tanggalPengambilanIjazah ? new Date(a.tanggalPengambilanIjazah).toLocaleDateString("id-ID") : "-";
      const statusText = statusLabel[a.statusAlumni] || a.statusAlumni;
      const displayProdi = a.jurusan ? `${a.jurusan.namaJurusan} / ${a.jurusan.namaProdi}` : "-";

      const row = worksheet.addRow({
        no: idx + 1,
        nama: a.nama,
        nim: a.nim, // write literally as string to prevent loss of leading zeros
        prodi: displayProdi,
        tglLulus: tglLulus,
        tglWisuda: tglWisuda,
        nomorIjazah: a.nomorIjazah || "-",
        tglAmbil: tglAmbil,
        status: statusText,
      });

      row.height = 20;

      // Cell formatting
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.font = { name: "Arial", size: 10 };
        cell.border = {
          top: { style: "thin", color: { argb: "FFCBD5E1" } },
          bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
          left: { style: "thin", color: { argb: "FFCBD5E1" } },
          right: { style: "thin", color: { argb: "FFCBD5E1" } },
        };

        // Alignments
        if (colNumber === 1 || colNumber === 3 || colNumber === 5 || colNumber === 6 || colNumber === 7 || colNumber === 8 || colNumber === 9) {
          cell.alignment = { horizontal: "center", vertical: "middle" };
        } else {
          cell.alignment = { horizontal: "left", vertical: "middle" };
        }

        // Force string type for NIM and Nomor Ijazah to prevent truncation in Excel
        if (colNumber === 3 || colNumber === 7) {
          cell.numFmt = "@";
        }
      });
    });

    // Auto-fit column widths
    worksheet.columns.forEach((column) => {
      let maxLen = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        // Skip title row and metadata rows when calculating widths
        if (cell.row > 6) {
          const val = cell.value ? String(cell.value) : "";
          if (val.length > maxLen) {
            maxLen = val.length;
          }
        }
      });
      column.width = Math.max(column.width || 10, maxLen + 4);
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=laporan_alumni_${new Date().getFullYear()}.xlsx`);

    await workbook.xlsx.write(res);
    return res.end();
  } catch (error) {
    console.error("Export Excel error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengekspor Excel: " + error.message });
  }
};

// GET /api/v1/alumni/export/pdf
const exportPdf = async (req, res) => {
  try {
    const { jurusanId, year, statusIjazah } = req.query;

    const where = {};
    if (jurusanId) where.jurusanId = parseInt(jurusanId);
    if (year) {
      const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
      const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
      where.tanggalKelulusan = {
        gte: startOfYear,
        lte: endOfYear,
      };
    }
    if (statusIjazah) {
      if (statusIjazah === "SUDAH") {
        where.tanggalPengambilanIjazah = { not: null };
      } else if (statusIjazah === "BELUM") {
        where.tanggalPengambilanIjazah = null;
      }
    }

    const alumni = await prisma.alumni.findMany({
      where,
      include: { jurusan: true },
      orderBy: { nama: "asc" },
    });

    const mappedAlumni = alumni.map((a) => ({
      ...a,
      statusAlumni: deriveStatus(a),
    }));

    const stats = {
      total: mappedAlumni.length,
      sudahAmbil: mappedAlumni.filter((a) => a.statusAlumni === "IJAZAH_DIAMBIL").length,
      belumAmbil: mappedAlumni.filter((a) => a.statusAlumni !== "IJAZAH_DIAMBIL").length,
    };

    let prodiName = "Semua Jurusan / Prodi";
    if (jurusanId) {
      const p = await prisma.jurusan.findUnique({ where: { id: parseInt(jurusanId) } });
      if (p) prodiName = `${p.namaJurusan} / ${p.namaProdi}`;
    }

    const filterInfo = {
      prodiName,
      year: year || "Semua Tahun",
      statusIjazah: statusIjazah === "SUDAH" ? "Sudah Diambil" : statusIjazah === "BELUM" ? "Belum Diambil" : "Semua Status",
      downloadDate: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };

    // Compile EJS template
    const templatePath = path.join(__dirname, "../templates/laporan.ejs");
    const html = await ejs.renderFile(templatePath, {
      alumni: mappedAlumni,
      stats,
      filterInfo,
    });

    const executablePath = getChromePath();
    if (!executablePath) {
      return res.status(500).json({
        success: false,
        message: "Browser Google Chrome atau Microsoft Edge tidak ditemukan di server untuk menjalankan ekspor PDF.",
      });
    }

    const browser = await puppeteer.launch({
      executablePath,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    
    const pdfBuffer = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
      margin: {
        top: "20px",
        bottom: "20px",
        left: "20px",
        right: "20px",
      },
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=laporan_alumni_${new Date().getFullYear()}.pdf`);
    return res.end(pdfBuffer);
  } catch (error) {
    console.error("Export PDF error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengekspor PDF: " + error.message });
  }
};

const updateProfileFoto = async (req, res) => {
  try {
    const { id } = req.params;
    const alumni = await prisma.alumni.findUnique({ where: { id: parseInt(id) } });

    if (!alumni) {
      if (req.file) {
        try { fs.unlinkSync(req.file.path); } catch (_) {}
      }
      return res.status(404).json({ success: false, message: "Alumni tidak ditemukan" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Tidak ada file foto yang diunggah" });
    }

    // Hapus foto lama
    if (alumni.foto) {
      const oldPath = path.join(__dirname, "../../uploads/foto", alumni.foto);
      if (fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath); } catch (_) {}
      }
    }

    const updated = await prisma.alumni.update({
      where: { id: parseInt(id) },
      data: { foto: req.file.filename },
    });

    if (req.session.role === "ALUMNI" && req.session.userId === alumni.id) {
      req.session.foto = updated.foto;
    }

    return res.status(200).json({
      success: true,
      message: "Foto profil alumni berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    console.error("Update alumni foto error:", error);
    if (req.file) {
      try { fs.unlinkSync(req.file.path); } catch (_) {}
    }
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

const deleteProfileFoto = async (req, res) => {
  try {
    const { id } = req.params;
    const alumni = await prisma.alumni.findUnique({ where: { id: parseInt(id) } });

    if (!alumni) {
      return res.status(404).json({ success: false, message: "Alumni tidak ditemukan" });
    }

    // Hapus file fisik jika ada
    if (alumni.foto) {
      const filePath = path.join(__dirname, "../../uploads/foto", alumni.foto);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (_) {}
      }
    }

    const updated = await prisma.alumni.update({
      where: { id: parseInt(id) },
      data: { foto: null },
    });

    if (req.session.role === "ALUMNI" && req.session.userId === alumni.id) {
      req.session.foto = null;
    }

    return res.status(200).json({
      success: true,
      message: "Foto profil alumni berhasil dihapus",
      data: updated,
    });
  } catch (error) {
    console.error("Delete alumni foto error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

module.exports = { getAll, getById, create, update, remove, exportExcel, exportPdf, updateProfileFoto, deleteProfileFoto };
