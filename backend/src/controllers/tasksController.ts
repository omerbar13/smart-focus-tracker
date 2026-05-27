import { Request, Response } from "express";
import mongoose from "mongoose";

import * as tasksService from "../services/tasksService";

/**
 * GET /tasks — return all tasks, newest first.
 */
export async function getTasks(req: Request, res: Response): Promise<void> {
  try {
    const tasks = await tasksService.getAllTasks();
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
}

/**
 * POST /tasks — create a new task.
 */
export async function createTask(req: Request, res: Response): Promise<void> {
  try {
    const { title } = req.body;

    if (!title || typeof title !== "string") {
      res.status(400).json({ error: "Title is required and must be a string" });
      return;
    }

    const newTask = await tasksService.createTask(title);
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create task" });
  }
}

/**
 * DELETE /tasks/:id — delete a task.
 */
export async function deleteTask(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid task ID" });
      return;
    }

    const deleted = await tasksService.deleteTask(id);

    if (!deleted) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete task" });
  }
}

/**
 * PUT /tasks/:id — update a task's title.
 */
export async function updateTask(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const { title } = req.body;

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid task ID" });
      return;
    }

    if (!title || typeof title !== "string") {
      res.status(400).json({ error: "Title is required and must be a string" });
      return;
    }

    const updatedTask = await tasksService.updateTask(id, title);

    if (!updatedTask) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update task" });
  }
}

/**
 * PATCH /tasks/:id/toggle — flip a task's completed status.
 */
export async function toggleTask(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid task ID" });
      return;
    }

    const updatedTask = await tasksService.toggleTask(id);

    if (!updatedTask) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to toggle task" });
  }
}