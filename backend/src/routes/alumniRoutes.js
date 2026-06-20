const express = require("express");
const router = express.Router();
const { getAll, getById, create, update, remove, exportExcel, exportPdf, updateProfileFoto, deleteProfileFoto } = require("../controllers/alumniController");
const { isAdmin, canUpdateAlumni, isAuthenticatedAny } = require("../middlewares/auth");
const { uploadFoto, handleMulterError } = require("../middlewares/upload");

// Export endpoints (placed before /:id parameter)
router.get("/export/excel", isAuthenticatedAny, exportExcel);
router.get("/export/pdf", isAuthenticatedAny, exportPdf);

// Admin: CRUD alumni
router.get("/", isAuthenticatedAny, getAll);
router.get("/:id", isAuthenticatedAny, getById);
router.post("/", isAdmin, create);
router.put("/:id", canUpdateAlumni, update);
router.put("/:id/foto", canUpdateAlumni, uploadFoto, handleMulterError, updateProfileFoto);
router.delete("/:id/foto", canUpdateAlumni, deleteProfileFoto);
router.delete("/:id", isAdmin, remove);

module.exports = router;
