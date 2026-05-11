const mongoose = require("mongoose");

const focusSessionSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: false
    },

    startTime: {
      type: Date,
      required: true
    },

    endTime: {
      type: Date,
      default: null
    },

    durationMinutes: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active"
    },

    notes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("FocusSession", focusSessionSchema);