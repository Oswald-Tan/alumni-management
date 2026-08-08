const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const alumniRoutes = require("./alumniRoutes");
const jurusanRoutes = require("./jurusanRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const tracerRoutes = require("./tracerRoutes");
const adminProdiRoutes = require("./adminProdiRoutes");

router.use("/auth", authRoutes);
router.use("/alumni", alumniRoutes);
router.use("/jurusan", jurusanRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/tracer", tracerRoutes);
router.use("/admin-prodi", adminProdiRoutes);

module.exports = router;
