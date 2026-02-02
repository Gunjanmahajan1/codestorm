const express = require("express");
const router = express.Router();

const {
  createContest,
  getAllContests,
  updateContest,
  deleteContest,
} = require("../controllers/contest.controller");

const { protect } = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

/* PUBLIC */
router.get("/", getAllContests);

/* ADMIN */
router.post("/", protect, roleMiddleware("admin"), createContest);
router.put("/:id", protect, roleMiddleware("admin"), updateContest);
router.delete("/:id", protect, roleMiddleware("admin"), deleteContest);

module.exports = router;
