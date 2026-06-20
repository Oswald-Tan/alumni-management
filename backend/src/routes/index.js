const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const alumniRoutes = require("./alumniRoutes");
const jurusanRoutes = require("./jurusanRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const tracerRoutes = require("./tracerRoutes");

router.use("/auth", authRoutes);
router.use("/alumni", alumniRoutes);
router.use("/jurusan", jurusanRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/tracer", tracerRoutes);

module.exports = router;
