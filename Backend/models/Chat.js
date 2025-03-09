const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    project: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" ,unique:true,required:true}],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
}, { timestamps: true });

chatSchema.statics.findByProjectID = function (projectId) {
    return this.find({ project: projectId })
        .populate("project")
        .populate("messages");
};

module.exports = mongoose.model("Chat", chatSchema);