const express = require("express");
const router = express.Router();
const { login, logout, getProfile, checkSession } = require("../controllers/authController");
const { isAuthenticatedAny } = require("../middlewares/auth");

router.post("/login", login);
router.post("/logout", isAuthenticatedAny, logout);
router.get("/profile", isAuthenticatedAny, getProfile);
router.get("/me", checkSession);

module.exports = router;
