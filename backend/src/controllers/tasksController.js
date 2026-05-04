const tasksService = require("../services/tasksService");
const mongoose = require("mongoose");

/**
 * GET /tasks
 * 
 * Returns all tasks.
 * No input required.
 */
exports.getTasks = async (req, res) => {
    try {
        const tasks = await tasksService.getAllTasks();
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
};

/**
 * POST /tasks
 * 
 * Creates a new task.
 * 
 * Body:
 * - title (string) → required
 * 
 * Responses:
 * - 201 → created task
 * - 400 → missing title
 */
exports.createTask = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        const newTask = await tasksService.createTask(title);

        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create task" });
    }
};


/**
 * DELETE /tasks/:id
 * 
 * Deletes a task by ID.
 * 
 * Params:
 * - id (string - MongoDB ObjectId)
 * 
 * Responses:
 * - 200 → success message
 * - 404 → task not found
 */
exports.deleteTask = async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid task ID" });
        }

        const deleted = await tasksService.deleteTask(id);

        if (!deleted) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json({ message: "Task deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete task" });
    }
};

/**
 * PUT /tasks/:id
 * 
 * Updates a task completely (in this case, only the title).
 * 
 * Params:
 * - id (string - MongoDB ObjectId)
 * 
 * Body:
 * - title (string) → required
 * 
 * Responses:
 * - 200 → updated task
 * - 400 → missing title
 * - 404 → task not found
 */
exports.updateTask = async (req, res) => {
    try {
        const id = req.params.id;
        const { title } = req.body;

        // Validate MongoDB ObjectId
        if (!require("mongoose").Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid task ID" });
        }

        // Validate input
        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        const updatedTask = await tasksService.updateTask(id, title);

        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update task" });
    }
};