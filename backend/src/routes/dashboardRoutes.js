const express = require("express");
const router = express.Router();
const { getDashboard } = require("../controllers/dashboardController");
const { isAdmin } = require("../middlewares/auth");

router.get("/", isAdmin, getDashboard);

module.exports = router;
