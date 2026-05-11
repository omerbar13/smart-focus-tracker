require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*"
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// importing routes
const tasksRoutes = require("./routes/tasks");
const focusSessionRoutes = require("./routes/focusSessionRoutes");

// health check
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// connect routes
app.use("/tasks", tasksRoutes);
app.use("/sessions", focusSessionRoutes);

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});