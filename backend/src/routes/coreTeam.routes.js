const express = require("express");
const router = express.Router();

const {
    getTeamMembers,
    addMember,
    updateMember,
    deleteMember,
} = require("../controllers/coreTeam.controller");

const { protect, adminOnly } = require("../middleware/auth.middleware");

// Public: Get all members
router.get("/", getTeamMembers);

// Admin: Add member
router.post("/", protect, adminOnly, addMember);

// Admin: Update member
router.put("/:id", protect, adminOnly, updateMember);

// Admin: Delete member
router.delete("/:id", protect, adminOnly, deleteMember);

module.exports = router;
