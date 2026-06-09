const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const alumniRoutes = require("./alumniRoutes");
const prodiRoutes = require("./prodiRoutes");
const dashboardRoutes = require("./dashboardRoutes");

router.use("/auth", authRoutes);
router.use("/alumni", alumniRoutes);
router.use("/prodi", prodiRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
