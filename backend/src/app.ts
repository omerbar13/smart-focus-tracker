import "dotenv/config";

import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";

import tasksRoutes from "./routes/tasks";
import focusSessionRoutes from "./routes/focusSessionRoutes";

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ ok: true });
});

// Routes
app.use("/tasks", tasksRoutes);
app.use("/sessions", focusSessionRoutes);

// Startup sequence
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

async function start(): Promise<void> {
  if (!MONGO_URI) {
    console.error("FATAL: MONGO_URI is not set in environment");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();