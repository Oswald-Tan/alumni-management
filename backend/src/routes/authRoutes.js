const express = require("express");
const router = express.Router();
const { login, logout, getProfile, checkSession, updateProfileFoto, deleteProfileFoto } = require("../controllers/authController");
const { isAuthenticatedAny, isAdmin } = require("../middlewares/auth");
const { uploadFoto, handleMulterError } = require("../middlewares/upload");

router.post("/login", login);
router.post("/logout", isAuthenticatedAny, logout);
router.get("/profile", isAuthenticatedAny, getProfile);
router.get("/me", checkSession);
router.put("/profile/foto", isAdmin, uploadFoto, handleMulterError, updateProfileFoto);
router.delete("/profile/foto", isAdmin, deleteProfileFoto);

module.exports = router;
