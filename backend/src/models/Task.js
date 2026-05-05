const mongoose = require("mongoose");

/**
 * Task Schema
 * Defines how a task is stored in MongoDB
 */
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // optional but very useful (createdAt, updatedAt)
});

module.exports = mongoose.model("Task", taskSchema);