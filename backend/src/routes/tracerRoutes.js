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
  getAccreditationReport,
  exportTracerExcel,
} = require("../controllers/tracerController");
const { isAdmin, isAlumni, isAuthenticatedAny } = require("../middlewares/auth");

// Periode Tracer (Admin)
router.get("/periods", isAdmin, getAllPeriods);
router.post("/periods", isAdmin, createPeriod);
router.put("/periods/:id", isAdmin, updatePeriod);
router.delete("/periods/:id", isAdmin, removePeriod);

// Pertanyaan Dinamis (Admin)
router.get("/questions", isAdmin, getAllQuestions);
router.post("/questions", isAdmin, createQuestion);
router.put("/questions/:id", isAdmin, updateQuestion);
router.delete("/questions/:id", isAdmin, removeQuestion);

// Alumni Portal Flow
router.get("/eligibility", checkEligibility);
router.get("/active-questions", isAuthenticatedAny, getActiveQuestions);
router.post("/responses", isAlumni, submitResponse);

// Monitoring & Laporan (Admin)
router.get("/monitoring", isAdmin, getMonitoringResults);
router.get("/report", isAdmin, getAccreditationReport);
router.get("/export/excel", isAdmin, exportTracerExcel);

module.exports = router;
