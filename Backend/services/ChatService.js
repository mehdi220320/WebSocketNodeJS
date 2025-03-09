const ChatModel = require('../models/Chat');
const MessageModel = require("../models/Message");
const ProjectService=require("../services/ProjectService");

class ChatService {
    static async createChat(chatData) {
        try {
            const chat = new ChatModel(chatData);
            return await chat.save();
        } catch (error) {
            throw new Error('Error creating chat: ' + error.message);
        }
    }

    static async getAllChats() {
        try {
            return await ChatModel.find().populate('project', 'name tasks')
        } catch (error) {
            throw new Error('Error fetching projects: ' + error.message);
        }
    }

    static async getChatByProjectId(projectId) {
        try {
            let chat=await ChatModel.findByProjectID(projectId)
            if (!chat || chat.length === 0) {
                const project =await ProjectService.getProjectById(projectId);
                if(!project || project.length===0){
                    throw new Error("No project found by this ID"+projectId);
                }
                const chatData={project:projectId,messages:[]}
                chat=this.createChat(chatData)
            }
            return chat;
        } catch (error) {
            throw new Error('Error fetching chat by project ID: ' + error.message);
        }
    }
}

module.exports = ProjectService;