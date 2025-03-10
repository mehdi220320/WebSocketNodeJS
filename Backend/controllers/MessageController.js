const MessageService = require("../services/MessageService");
const { getSocket } = require("../socket/socket");

class MessageController {
    static async sendMessage(req, res) {
        try {
            const { sender, content } = req.body;
            const chat = req.params.id;

            const newMessage = await MessageService.sendMessage({ chat, sender, content });

            const populatedMessage = await newMessage.populate("sender", "name");

            const io = getSocket();
            if (io) {
                io.to(chat).emit("newMessage", populatedMessage);
            }

            res.status(201).json(populatedMessage);
        } catch (error) {
            console.error("Error sending message:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async getMessagesByChat(req, res) {
        try {
            const chatID = req.params.id;
            console.log("Fetching messages for chatID:", chatID);

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
