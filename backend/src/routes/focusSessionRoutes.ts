import { Router } from "express";

import {
  startSession,
  stopSession,
  getSessions,
  deleteSession,
} from "../controllers/focusSessionController";

const router = Router();

router.post("/start", startSession);
router.patch("/:id/stop", stopSession);
router.get("/", getSessions);
router.delete("/:id", deleteSession);

export default router;