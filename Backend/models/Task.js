const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    status: { type: String, enum: ["To Do", "In Progress", "Completed"], default: "To Do" },
    dueDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);