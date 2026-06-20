const express = require("express");
const router = express.Router();
const { getDashboard } = require("../controllers/dashboardController");
const { isAuthenticatedAny } = require("../middlewares/auth");

router.get("/", isAuthenticatedAny, getDashboard);

module.exports = router;
