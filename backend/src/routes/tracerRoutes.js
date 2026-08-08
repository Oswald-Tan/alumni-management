const express = require("express");
const router = express.Router();
const {
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
  getAlumniResponseDetail,
  getAccreditationReport,
  exportTracerExcel,
} = require("../controllers/tracerController");
const { isAdmin, isAlumni, isAuthenticatedAny, isAdminOrAdminProdi } = require("../middlewares/auth");

// Periode Tracer (Admin + Admin Prodi)
router.get("/periods", isAdminOrAdminProdi, getAllPeriods);
router.post("/periods", isAdmin, createPeriod);
router.put("/periods/:id", isAdmin, updatePeriod);
router.delete("/periods/:id", isAdmin, removePeriod);

// Pertanyaan Dinamis (Admin + Admin Prodi)
router.get("/questions", isAdminOrAdminProdi, getAllQuestions);
router.post("/questions", isAdminOrAdminProdi, createQuestion);
router.put("/questions/:id", isAdminOrAdminProdi, updateQuestion);
router.delete("/questions/:id", isAdminOrAdminProdi, removeQuestion);

// Alumni Portal Flow
router.get("/eligibility", checkEligibility);
router.get("/active-questions", isAuthenticatedAny, getActiveQuestions);
router.post("/responses", isAlumni, submitResponse);

// Monitoring & Laporan (Admin + Admin Prodi)
router.get("/monitoring", isAdminOrAdminProdi, getMonitoringResults);
router.get("/responses/alumni/:alumniId", isAdminOrAdminProdi, getAlumniResponseDetail);
router.get("/report", isAdminOrAdminProdi, getAccreditationReport);
router.get("/export/excel", isAdminOrAdminProdi, exportTracerExcel);

module.exports = router;
