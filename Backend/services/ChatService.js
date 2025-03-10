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
    static async getChatsByUserId(userId) {
        try {
            const projects = await ProjectService.getUserInvolvedProjects(userId);
            let chats = [];

            for (let proj of projects) {
                const chat = await this.getChatByProjectId(proj._id);
                if (Array.isArray(chat)) {
                    chats = chats.concat(chat);
                } else {
                    chats.push(chat);
                }
            }

            return chats;

        } catch (error) {
            throw new Error('Error fetching chats: ' + error.message);
        }
    }
    static async getAllChats() {
        try {
            return await ChatModel.find().populate('project', 'name')
        } catch (error) {
            throw new Error('Error fetching projects: ' + error.message);
        }
    }
    static async getChatByID(chatId){
        try {
            return await ChatModel.findById(chatId)
                .populate('project', 'name')
        }catch (error) {
            throw new Error('Error fetching chat by project ID: ' + error.message);
        }
    }
    static async getChatByProjectId(projectId) {
        try {
            let chat=await ChatModel.findByProjectID(projectId).populate('project', 'name')
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

module.exports = ChatService;