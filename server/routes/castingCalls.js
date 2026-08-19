const express = require("express");
const router = express.Router();
const {
  createCall, listMyCalls, updateCall, toggleStatus, deleteCall,
} = require("../controllers/castingCallController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.use(requireAuth, requireRole("producer"));

router.post("/", createCall);
router.get("/", listMyCalls);
router.put("/:id", updateCall);
router.patch("/:id/status", toggleStatus);
router.delete("/:id", deleteCall);

module.exports = router;
