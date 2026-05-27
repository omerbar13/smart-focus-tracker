import { Request, Response } from "express";
import mongoose from "mongoose";

import * as focusSessionService from "../services/focusSessionService";

/**
 * POST /sessions/start — start a new focus session.
 */
export async function startSession(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { taskId, notes } = req.body;

    if (taskId !== undefined && taskId !== null) {
      if (typeof taskId !== "string" || !mongoose.Types.ObjectId.isValid(taskId)) {
        res.status(400).json({ error: "Invalid taskId" });
        return;
      }
    }

    if (notes !== undefined && typeof notes !== "string") {
      res.status(400).json({ error: "Notes must be a string" });
      return;
    }

    const session = await focusSessionService.startSession(taskId ?? null, notes ?? "");
    res.status(201).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to start session" });
  }
}

/**
 * PATCH /sessions/:id/stop — stop an active focus session.
 */
export async function stopSession(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid session ID" });
      return;
    }

    const session = await focusSessionService.stopSession(id);
    res.json(session);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    }
    console.error(error);
    res.status(500).json({ error: "Failed to stop session" });
  }
}

/**
 * GET /sessions — list all focus sessions, newest first.
 */
export async function getSessions(req: Request, res: Response): Promise<void> {
  try {
    const sessions = await focusSessionService.getSessions();
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
}

/**
 * DELETE /sessions/:id — delete a focus session.
 */
export async function deleteSession(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid session ID" });
      return;
    }

    await focusSessionService.deleteSession(id);
    res.json({ message: "Session deleted" });
  } catch (error) {
    if (error instanceof Error && error.message === "Focus session not found") {
      res.status(404).json({ error: error.message });
      return;
    }
    console.error(error);
    res.status(500).json({ error: "Failed to delete session" });
  }
}