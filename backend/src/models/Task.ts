import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Task interface — the TypeScript shape of a Task document.
 *
 * Extending `Document` gives us all of Mongoose's built-in document
 * methods and properties (_id, save(), etc.) for free.
 */
export interface ITask extends Document {
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Task: Model<ITask> = mongoose.model<ITask>("Task", taskSchema);

export default Task;