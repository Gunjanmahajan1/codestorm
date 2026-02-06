const express = require("express");
const router = express.Router();

const {
  createContest,
  getAllContests,
  updateContest,
  deleteContest,
} = require("../controllers/contest.controller");

const { protect, adminOnly } = require("../middleware/auth.middleware");

/* PUBLIC */
router.get("/", getAllContests);

/* ADMIN */
router.post("/", protect, adminOnly, createContest);
router.put("/:id", protect, adminOnly, updateContest);
router.delete("/:id", protect, adminOnly, deleteContest);

module.exports = router;
