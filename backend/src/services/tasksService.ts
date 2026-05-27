import Task, { ITask } from "../models/Task";

/**
 * Get all tasks from the database.
 */
export async function getAllTasks(): Promise<ITask[]> {
  return Task.find().sort({ createdAt: -1 });
}

/**
 * Create a new task.
 */
export async function createTask(title: string): Promise<ITask> {
  return Task.create({ title });
}

/**
 * Delete a task by ID. Returns the deleted document, or null if not found.
 */
export async function deleteTask(id: string): Promise<ITask | null> {
  return Task.findByIdAndDelete(id);
}

/**
 * Update a task's title. Returns the updated document, or null if not found.
 */
export async function updateTask(
  id: string,
  title: string
): Promise<ITask | null> {
  return Task.findByIdAndUpdate(id, { title }, { new: true });
}

/**
 * Toggle a task's completed status. Returns the updated document,
 * or null if the task does not exist.
 */
export async function toggleTask(id: string): Promise<ITask | null> {
  const task = await Task.findById(id);
  if (!task) {
    return null;
  }

  task.completed = !task.completed;
  return task.save();
}