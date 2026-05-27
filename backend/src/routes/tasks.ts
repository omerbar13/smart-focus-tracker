import { Router } from "express";

import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
  toggleTask,
} from "../controllers/tasksController";

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);
router.delete("/:id", deleteTask);
router.put("/:id", updateTask);
router.patch("/:id/toggle", toggleTask);

export default router;