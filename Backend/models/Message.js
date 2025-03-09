const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    chat: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
    sender: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    content: { type: String },
}, { timestamps: true });

messageSchema.statics.findByChatID = function (chatId) {
    return this.find({ chat: chatId })
};
module.exports = mongoose.model("Message", messageSchema);