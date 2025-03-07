const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    teamLeader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
}, { timestamps: true });

const ProjectModel = mongoose.model("Project", projectSchema);

module.exports = ProjectModel;
