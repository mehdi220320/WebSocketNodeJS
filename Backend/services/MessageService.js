const MessageModel=require("../models/Message")
class MessageService {
    static async sendMessage(messageData) {
        try {
            const message = new MessageModel(messageData);
            return await message.save();
        } catch (error) {
            throw new Error('Error sending message : ' + error.message);
        }
    }
    static async getMessagesByChat(chatId) {
        try {
            return await MessageModel.findByChatID(chatId)
                .populate('sender', 'name')
        } catch (error) {
            throw new Error('Error fetching project by ID: ' + error.message);
        }
    }
}

module.exports = MessageService;
