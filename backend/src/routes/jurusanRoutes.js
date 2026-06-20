const express = require("express");
const router = express.Router();
const { getAll, create, update, remove } = require("../controllers/jurusanController");
const { isAdmin, isAuthenticatedAny } = require("../middlewares/auth");

router.get("/", isAuthenticatedAny, getAll);
router.post("/", isAdmin, create);
router.put("/:id", isAdmin, update);
router.delete("/:id", isAdmin, remove);

module.exports = router;
