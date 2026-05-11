const express = require("express");
const router = express.Router();

const focusSessionController = require("../controllers/focusSessionController");

router.post("/start", focusSessionController.startSession);
router.patch("/:id/stop", focusSessionController.stopSession);
router.get("/", focusSessionController.getSessions);

module.exports = router;