const MessageService = require("../services/MessageService");
const { getSocket } = require("../socket/socket");
const ProjectService = require("../services/ProjectService");
const ChatService = require("../services/ChatService");
class MessageController {
    static async sendMessage(req, res) {
        try {
            const { sender, content } = req.body;
            const chat=req.params.id;
            const newMessage = await MessageService.sendMessage({ chat, sender, content });
            const io = getSocket();
            if (io) {
                io.emit("newMessage", newMessage);
            }
            res.status(201).json({ message: "Message sent successfully", Message: newMessage });
        } catch (error) {
            console.error("Error creating project:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async getMessagesByChat(req, res) {
        try {
            const chatID = req.params.id;
            console.log("chatid : "+ chatID)
            const messages = await MessageService.getMessagesByChat(chatID);
            const io = getSocket();
            if (io) {
                io.to(chatID).emit("messagesFetched", messages);
            }
            res.status(200).json(messages);
        } catch (error) {
            console.error("Error fetching messages:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports = MessageController;