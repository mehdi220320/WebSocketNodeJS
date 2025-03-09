const ChatService = require("../services/ChatService");
const { getSocket } = require("../socket/socket"); // Import the socket instance
const ProjectService=require("../services/ProjectService")
class ChatController {
    static async getChatByProjectID(req, res) {
        try {
            const projectId = req.params.id;
            const chat = await ChatService.getChatByProjectId(projectId);

            res.status(200).json(chat);
        } catch (error) {
            console.error("Error fetching chat:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    static async getAllChats(req, res) {
        try {
            const chats = await ChatService.getAllChats();
            const io = getSocket();
            if (io) {
                io.emit("chatFetched", chats);
            }
            res.status(200).json(chats);
        } catch (error) {
            console.error("Error fetching chats:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

}

module.exports = ChatController;