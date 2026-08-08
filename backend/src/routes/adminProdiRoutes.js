const express = require("express");
const router = express.Router();
const {
  getAll,
  create,
  update,
  remove,
} = require("../controllers/adminProdiController");
const { isAdmin } = require("../middlewares/auth");

// Hanya super admin (ADMIN) yang bisa kelola admin prodi
router.get("/", isAdmin, getAll);
router.post("/", isAdmin, create);
router.put("/:id", isAdmin, update);
router.delete("/:id", isAdmin, remove);

module.exports = router;
