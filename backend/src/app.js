require("dotenv").config();

console.log("file is executing");


const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// 🔥 CONNECT TO MONGODB (MISSING PIECE)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// importing routes
const tasksRoutes = require("./routes/tasks");

// health check
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// connect routes
app.use("/tasks", tasksRoutes);

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});