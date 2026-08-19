const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/actorProfileController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.get("/", requireAuth, requireRole("actor"), getProfile);
router.put("/", requireAuth, requireRole("actor"), updateProfile);

module.exports = router;
