const Message = require("../models/Message");

class MessageService {
    static async sendMessage({ chat, sender, content }) {
        return await Message.create({ chat, sender, content });
    }

    static async getMessagesByChat(chatID) {
        return await Message.find({ chat: chatID }).populate("sender", "name").sort({ createdAt: 1 });
    }
}

module.exports = MessageService;
