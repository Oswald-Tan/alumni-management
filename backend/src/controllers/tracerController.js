const prisma = require("../config/prisma");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const puppeteer = require("puppeteer-core");

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

// ==========================================
// 1. PERIODE TRACER (ADMIN)
// ==========================================

const getAllPeriods = async (req, res) => {
  try {
    const periods = await prisma.tracerPeriod.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ success: true, data: periods });
  } catch (error) {
    console.error("Get all periods error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

const createPeriod = async (req, res) => {
  try {
    const { namaPeriode, tanggalMulai, tanggalSelesai, status, modePengisian } = req.body;
    if (!namaPeriode || !tanggalMulai || !tanggalSelesai || !status || !modePengisian) {
      return res.status(400).json({ success: false, message: "Semua field periode wajib diisi" });
    }

    // Jika status "Aktif", nonaktifkan periode lain terlebih dahulu
    if (status === "Aktif") {
      await prisma.tracerPeriod.updateMany({
        where: { status: "Aktif" },
        data: { status: "Tidak Aktif" },
      });
    }

    const period = await prisma.tracerPeriod.create({
      data: {
        namaPeriode,
        tanggalMulai: new Date(tanggalMulai),
        tanggalSelesai: new Date(tanggalSelesai),
        status,
        modePengisian,
      },
    });

    return res.status(201).json({ success: true, message: "Periode tracer berhasil dibuat", data: period });
  } catch (error) {
    console.error("Create period error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

const updatePeriod = async (req, res) => {
  try {
    const { id } = req.params;
    const { namaPeriode, tanggalMulai, tanggalSelesai, status, modePengisian } = req.body;

    const existing = await prisma.tracerPeriod.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Periode tidak ditemukan" });
    }

    // Jika status diubah ke "Aktif", nonaktifkan periode aktif lain
    if (status === "Aktif" && existing.status !== "Aktif") {
      await prisma.tracerPeriod.updateMany({
        where: { status: "Aktif" },
        data: { status: "Tidak Aktif" },
      });
    }

    const updated = await prisma.tracerPeriod.update({
      where: { id: parseInt(id) },
      data: {
        namaPeriode,
        tanggalMulai: tanggalMulai ? new Date(tanggalMulai) : undefined,
        tanggalSelesai: tanggalSelesai ? new Date(tanggalSelesai) : undefined,
        status,
        modePengisian,
      },
    });

    return res.status(200).json({ success: true, message: "Periode tracer berhasil diupdate", data: updated });
  } catch (error) {
    console.error("Update period error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

const removePeriod = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.tracerPeriod.delete({ where: { id: parseInt(id) } });
    return res.status(200).json({ success: true, message: "Periode tracer berhasil dihapus" });
  } catch (error) {
    console.error("Delete period error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// ==========================================
// 2. PERTANYAAN DINAMIS (ADMIN)
// ==========================================

const getAllQuestions = async (req, res) => {
  try {
    const questions = await prisma.tracerQuestion.findMany({
      orderBy: { urutan: "asc" },
    });
    return res.status(200).json({ success: true, data: questions });
  } catch (error) {
    console.error("Get all questions error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

const createQuestion = async (req, res) => {
  try {
    const { pertanyaan, tipe, opsi, isRequired, urutan, isActive } = req.body;
    if (!pertanyaan || !tipe) {
      return res.status(400).json({ success: false, message: "Pertanyaan dan tipe wajib diisi" });
    }

    const question = await prisma.tracerQuestion.create({
      data: {
        pertanyaan,
        tipe,
        opsi: opsi || null,
        isRequired: isRequired !== undefined ? isRequired : true,
        urutan: urutan !== undefined ? parseInt(urutan) : 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return res.status(201).json({ success: true, message: "Pertanyaan berhasil ditambahkan", data: question });
  } catch (error) {
    console.error("Create question error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { pertanyaan, tipe, opsi, isRequired, urutan, isActive } = req.body;

    const updated = await prisma.tracerQuestion.update({
      where: { id: parseInt(id) },
      data: {
        pertanyaan,
        tipe,
        opsi: opsi !== undefined ? opsi : undefined,
        isRequired: isRequired !== undefined ? isRequired : undefined,
        urutan: urutan !== undefined ? parseInt(urutan) : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    });

    return res.status(200).json({ success: true, message: "Pertanyaan berhasil diupdate", data: updated });
  } catch (error) {
    console.error("Update question error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

const removeQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.tracerQuestion.delete({ where: { id: parseInt(id) } });
    return res.status(200).json({ success: true, message: "Pertanyaan berhasil dihapus" });
  } catch (error) {
    console.error("Delete question error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// ==========================================
// 3. ALUMNI PORTAL FLOW (CHECK & SUBMIT)
// ==========================================

const checkEligibility = async (req, res) => {
  try {
    const alumniId = req.session.userId;
    if (!alumniId || req.session.role !== "ALUMNI") {
      return res.status(401).json({ success: false, message: "Hanya alumni yang dapat mengecek status tracer" });
    }

    const alumni = await prisma.alumni.findUnique({
      where: { id: alumniId },
    });

    if (!alumni) {
      return res.status(404).json({ success: false, message: "Data alumni tidak ditemukan" });
    }

    const activePeriod = await prisma.tracerPeriod.findFirst({
      where: { status: "Aktif" },
    });

    if (!activePeriod) {
      return res.status(200).json({
        success: true,
        eligible: false,
        status: "TIDAK_ADA_PERIODE",
        message: "Tidak ada periode tracer study yang aktif saat ini.",
      });
    }

    const now = new Date();
    if (now < new Date(activePeriod.tanggalMulai) || now > new Date(activePeriod.tanggalSelesai)) {
      return res.status(200).json({
        success: true,
        eligible: false,
        status: "EXPIRED",
        message: "Periode pengisian tracer study telah berakhir atau belum dimulai.",
      });
    }

    // Validasi Ganjil/Genap NIM
    const lastDigit = parseInt(alumni.nim.slice(-1));
    if (isNaN(lastDigit)) {
      return res.status(400).json({ success: false, message: "Digit terakhir NIM tidak valid" });
    }

    if (activePeriod.modePengisian === "Ganjil" && ![1, 3, 5, 7, 9].includes(lastDigit)) {
      return res.status(200).json({
        success: true,
        eligible: false,
        status: "NOT_ELIGIBLE",
        message: "Anda belum dapat mengisi tracer study pada periode ini (Khusus NIM Ganjil).",
      });
    }

    if (activePeriod.modePengisian === "Genap" && ![0, 2, 4, 6, 8].includes(lastDigit)) {
      return res.status(200).json({
        success: true,
        eligible: false,
        status: "NOT_ELIGIBLE",
        message: "Anda belum dapat mengisi tracer study pada periode ini (Khusus NIM Genap).",
      });
    }

    // Cek apakah sudah pernah mengisi periode ini
    const existingResponse = await prisma.tracerResponse.findFirst({
      where: {
        tracerPeriodId: activePeriod.id,
        alumniId: alumni.id,
      },
    });

    if (existingResponse) {
      return res.status(200).json({
        success: true,
        eligible: false,
        status: "SUDAH_MENGISI",
        message: "Tracer study berhasil dikirim. Anda tidak dapat mengubah jawaban lagi.",
        submittedAt: existingResponse.submittedAt,
      });
    }

    // Jika lolos semua pengecekan
    return res.status(200).json({
      success: true,
      eligible: true,
      status: "BELUM_MENGISI",
      message: "Anda berhak mengisi tracer study periode ini.",
      period: activePeriod,
    });
  } catch (error) {
    console.error("Check eligibility error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

const getActiveQuestions = async (req, res) => {
  try {
    const questions = await prisma.tracerQuestion.findMany({
      where: { isActive: true },
      orderBy: { urutan: "asc" },
    });
    return res.status(200).json({ success: true, data: questions });
  } catch (error) {
    console.error("Get active questions error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

const submitResponse = async (req, res) => {
  try {
    const alumniId = req.session.userId;
    if (!alumniId || req.session.role !== "ALUMNI") {
      return res.status(401).json({ success: false, message: "Hanya alumni yang dapat mengisi tracer" });
    }

    const { answers, job } = req.body; // answers: [{questionId, jawaban}], job: {namaPerusahaan, jabatan, bidangPekerjaan, statusPekerjaan, tahunMulai, gajiPertama, kesesuaianBidang, waktuTunggu}

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ success: false, message: "Jawaban kuisioner wajib dikirim" });
    }

    const activePeriod = await prisma.tracerPeriod.findFirst({
      where: { status: "Aktif" },
    });

    if (!activePeriod) {
      return res.status(400).json({ success: false, message: "Tidak ada periode tracer yang aktif" });
    }

    // Cek pengisian ganda
    const existing = await prisma.tracerResponse.findFirst({
      where: {
        tracerPeriodId: activePeriod.id,
        alumniId: alumniId,
      },
    });

    if (existing) {
      return res.status(400).json({ success: false, message: "Anda sudah mengisi kuisioner tracer study pada periode ini." });
    }

    // Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Simpan Response
      const response = await tx.tracerResponse.create({
        data: {
          tracerPeriodId: activePeriod.id,
          alumniId: alumniId,
        },
      });

      // 2. Simpan Jawaban
      const answerData = answers.map((ans) => ({
        responseId: response.id,
        questionId: parseInt(ans.questionId),
        jawaban: ans.jawaban,
      }));

      await tx.tracerAnswer.createMany({
        data: answerData,
      });

      // 3. Simpan Pekerjaan (Jika bekerja dan data job dikirim)
      let pekerjaan = null;
      if (job && job.namaPerusahaan) {
        pekerjaan = await tx.pekerjaanAlumni.create({
          data: {
            alumniId: alumniId,
            namaPerusahaan: job.namaPerusahaan,
            jabatan: job.jabatan || "",
            bidangPekerjaan: job.bidangPekerjaan || "",
            statusPekerjaan: job.statusPekerjaan || "Tetap",
            tahunMulai: parseInt(job.tahunMulai) || new Date().getFullYear(),
            gajiPertama: job.gajiPertama ? parseFloat(job.gajiPertama) : null,
            kesesuaianBidang: job.kesesuaianBidang || "Sesuai",
            waktuTunggu: parseInt(job.waktuTunggu) || 0,
          },
        });
      }

      return { response, pekerjaan };
    });

    return res.status(201).json({
      success: true,
      message: "Tracer study berhasil dikirim. Anda tidak dapat mengubah jawaban lagi.",
      data: result,
    });
  } catch (error) {
    console.error("Submit tracer response error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// ==========================================
// 4. MONITORING HASIL TRACER (ADMIN)
// ==========================================

const getMonitoringResults = async (req, res) => {
  try {
    const { jurusanId, status, periodId } = req.query;

    const where = {};
    if (jurusanId) where.jurusanId = parseInt(jurusanId);

    // Ambil semua alumni
    const alumniList = await prisma.alumni.findMany({
      where,
      include: {
        jurusan: true,
        pekerjaanAlumni: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { nama: "asc" },
    });

    // Ambil periode filter atau periode aktif
    let targetPeriod = null;
    if (periodId) {
      targetPeriod = await prisma.tracerPeriod.findUnique({ where: { id: parseInt(periodId) } });
    } else {
      targetPeriod = await prisma.tracerPeriod.findFirst({ where: { status: "Aktif" } });
    }

    if (!targetPeriod) {
      // Jika tidak ada periode aktif/terpilih, kembalikan dengan status "Belum Mengisi" untuk semua
      const result = alumniList.map((a) => ({
        id: a.id,
        nama: a.nama,
        nim: a.nim,
        jurusan: a.jurusan,
        statusTracer: "Belum Mengisi",
        tanggalSubmit: null,
      }));
      return res.status(200).json({ success: true, data: result });
    }

    // Ambil semua response untuk periode target
    const responses = await prisma.tracerResponse.findMany({
      where: { tracerPeriodId: targetPeriod.id },
    });
    const respondedAlumniIds = new Set(responses.map((r) => r.alumniId));
    const responseMap = Object.fromEntries(responses.map((r) => [r.alumniId, r.submittedAt]));

    let results = alumniList.map((a) => {
      const sudahMengisi = respondedAlumniIds.has(a.id);
      return {
        id: a.id,
        nama: a.nama,
        nim: a.nim,
        jurusan: a.jurusan,
        statusTracer: sudahMengisi ? "Sudah Mengisi" : "Belum Mengisi",
        tanggalSubmit: sudahMengisi ? responseMap[a.id] : null,
      };
    });

    // Filter berdasarkan status pengisian jika diminta
    if (status) {
      results = results.filter((r) => r.statusTracer === status);
    }

    return res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error("Get monitoring results error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// ==========================================
// 5. LAPORAN AKREDITASI (ADMIN)
// ==========================================

const getAccreditationReport = async (req, res) => {
  try {
    const { jurusanId, periodId } = req.query;

    // Ambil periode target
    let targetPeriod = null;
    if (periodId) {
      targetPeriod = await prisma.tracerPeriod.findUnique({ where: { id: parseInt(periodId) } });
    } else {
      targetPeriod = await prisma.tracerPeriod.findFirst({ where: { status: "Aktif" } });
    }

    const where = {};
    if (jurusanId) where.id = parseInt(jurusanId);

    // Ambil program studi/jurusan yang aktif
    const jurusans = await prisma.jurusan.findMany({
      where,
      include: {
        alumni: {
          include: {
            pekerjaanAlumni: true,
            tracerResponses: targetPeriod ? { where: { tracerPeriodId: targetPeriod.id } } : false,
          },
        },
      },
    });

    const report = jurusans.map((j) => {
      const alumni = j.alumni;
      const totalAlumni = alumni.length;

      // Filter target alumni sesuai ganjil/genap (jika ada periode aktif)
      let targetAlumni = alumni;
      if (targetPeriod) {
        if (targetPeriod.modePengisian === "Ganjil") {
          targetAlumni = alumni.filter((a) => [1, 3, 5, 7, 9].includes(parseInt(a.nim.slice(-1))));
        } else if (targetPeriod.modePengisian === "Genap") {
          targetAlumni = alumni.filter((a) => [0, 2, 4, 6, 8].includes(parseInt(a.nim.slice(-1))));
        }
      }

      const totalTarget = targetAlumni.length;

      // Hitung pengisian
      let sudahMengisi = 0;
      if (targetPeriod) {
        sudahMengisi = targetAlumni.filter((a) => a.tracerResponses && a.tracerResponses.length > 0).length;
      }
      const belumMengisi = Math.max(0, totalTarget - sudahMengisi);

      // Hitung statistik pekerjaan
      const pekerjaanList = targetAlumni.flatMap((a) => a.pekerjaanAlumni).filter(Boolean);
      const bekerja = pekerjaanList.length;
      const belumBekerja = Math.max(0, totalTarget - bekerja);

      // Kesesuaian bidang
      const sesuaiBidang = pekerjaanList.filter((p) => p.kesesuaianBidang === "Sesuai").length;
      const tidakSesuaiBidang = bekerja - sesuaiBidang;

      // Rata-rata waktu tunggu kerja (dalam bulan)
      const totalWaktuTunggu = pekerjaanList.reduce((acc, curr) => acc + curr.waktuTunggu, 0);
      const rataWaktuTunggu = bekerja > 0 ? parseFloat((totalWaktuTunggu / bekerja).toFixed(1)) : 0;

      return {
        jurusanId: j.id,
        namaJurusan: j.namaJurusan,
        namaProdi: j.namaProdi,
        jenjang: j.jenjang,
        akreditasi: j.akreditasi,
        totalAlumni,
        totalTarget,
        sudahMengisi,
        belumMengisi,
        persentaseMengisi: totalTarget > 0 ? Math.round((sudahMengisi / totalTarget) * 100) : 0,
        bekerja,
        belumBekerja,
        sesuaiBidang,
        tidakSesuaiBidang,
        rataWaktuTunggu,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        periode: targetPeriod ? targetPeriod.namaPeriode : "Tidak ada periode tracer",
        report,
      },
    });
  } catch (error) {
    console.error("Get accreditation report error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// ==========================================
// 6. EXPORT LAPORAN TRACER (EXCEL & PDF)
// ==========================================

const exportTracerExcel = async (req, res) => {
  try {
    const { jurusanId, periodId } = req.query;

    let targetPeriod = null;
    if (periodId) {
      targetPeriod = await prisma.tracerPeriod.findUnique({ where: { id: parseInt(periodId) } });
    } else {
      targetPeriod = await prisma.tracerPeriod.findFirst({ where: { status: "Aktif" } });
    }

    const where = {};
    if (jurusanId) where.jurusanId = parseInt(jurusanId);

    // Ambil data alumni beserta jawaban tracer dan pekerjaan
    const alumniList = await prisma.alumni.findMany({
      where,
      include: {
        jurusan: true,
        pekerjaanAlumni: true,
        tracerResponses: targetPeriod ? {
          where: { tracerPeriodId: targetPeriod.id },
          include: {
            answers: {
              include: { question: true },
            },
          },
        } : false,
      },
      orderBy: { nama: "asc" },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tracer Study");

    // Header dan Judul
    worksheet.mergeCells("A1:K1");
    const title = worksheet.getCell("A1");
    title.value = "LAPORAN TRACER STUDY ALUMNI POLIMDO";
    title.font = { name: "Arial", size: 16, bold: true };
    title.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.mergeCells("A2:K2");
    const subtitle = worksheet.getCell("A2");
    subtitle.value = `Periode: ${targetPeriod ? targetPeriod.namaPeriode : "Semua Periode"}`;
    subtitle.font = { name: "Arial", size: 11, italic: true };
    subtitle.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.addRow([]); // Row 3 blank

    // Columns definition
    const columns = [
      { header: "No", key: "no", width: 6 },
      { header: "Nama Alumni", key: "nama", width: 25 },
      { header: "NIM", key: "nim", width: 16 },
      { header: "Jurusan / Prodi", key: "prodi", width: 30 },
      { header: "Status Pengisian", key: "status", width: 18 },
      { header: "Perusahaan Tempat Bekerja", key: "perusahaan", width: 25 },
      { header: "Jabatan", key: "jabatan", width: 20 },
      { header: "Status Kerja", key: "statusKerja", width: 15 },
      { header: "Tahun Mulai", key: "tahunMulai", width: 12 },
      { header: "Waktu Tunggu (Bulan)", key: "waktuTunggu", width: 18 },
      { header: "Kesesuaian Bidang", key: "kesesuaian", width: 18 },
    ];
    worksheet.columns = columns;

    // Header styling
    const headerRow = worksheet.getRow(4);
    headerRow.values = columns.map(c => c.header);
    headerRow.height = 24;
    headerRow.eachCell((cell) => {
      cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0F766E" }, // Teal theme
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    // Menulis data
    alumniList.forEach((a, idx) => {
      const response = a.tracerResponses && a.tracerResponses[0];
      const statusPengisian = response ? "Sudah Mengisi" : "Belum Mengisi";
      const job = a.pekerjaanAlumni && a.pekerjaanAlumni[0];

      const row = worksheet.addRow({
        no: idx + 1,
        nama: a.nama,
        nim: a.nim,
        prodi: a.jurusan ? `${a.jurusan.namaJurusan} / ${a.jurusan.namaProdi}` : "-",
        status: statusPengisian,
        perusahaan: job ? job.namaPerusahaan : "-",
        jabatan: job ? job.jabatan : "-",
        statusKerja: job ? job.statusPekerjaan : "-",
        tahunMulai: job ? job.tahunMulai : "-",
        waktuTunggu: job ? job.waktuTunggu : "-",
        kesesuaian: job ? job.kesesuaianBidang : "-",
      });

      row.height = 20;
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.font = { name: "Arial", size: 9 };
        cell.border = {
          top: { style: "thin", color: { argb: "FFCBD5E1" } },
          bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
          left: { style: "thin", color: { argb: "FFCBD5E1" } },
          right: { style: "thin", color: { argb: "FFCBD5E1" } },
        };
        if ([1, 3, 5, 8, 9, 10, 11].includes(colNumber)) {
          cell.alignment = { horizontal: "center", vertical: "middle" };
        } else {
          cell.alignment = { horizontal: "left", vertical: "middle" };
        }
        if (colNumber === 3) {
          cell.numFmt = "@";
        }
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=laporan_tracer_${new Date().getFullYear()}.xlsx`);

    await workbook.xlsx.write(res);
    return res.end();
  } catch (error) {
    console.error("Export tracer excel error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengekspor Excel: " + error.message });
  }
};

module.exports = {
  getAllPeriods,
  createPeriod,
  updatePeriod,
  removePeriod,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  removeQuestion,
  checkEligibility,
  getActiveQuestions,
  submitResponse,
  getMonitoringResults,
  getAccreditationReport,
  exportTracerExcel,
};
