import mongoose, { Schema, Document, Model, Types } from "mongoose";

/**
 * FocusSession interface — the TypeScript shape of a FocusSession document.
 */
export interface IFocusSession extends Document {
  taskId: Types.ObjectId | null;
  startTime: Date;
  endTime: Date | null;
  durationMinutes: number;
  status: "active" | "completed";
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const focusSessionSchema = new Schema<IFocusSession>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      default: null,
    },
    durationMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    notes: {
      type: String,
      default: "",
      maxlength: 1000,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const FocusSession: Model<IFocusSession> = mongoose.model<IFocusSession>(
  "FocusSession",
  focusSessionSchema
);

export default FocusSession;