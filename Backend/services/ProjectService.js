const ProjectModel = require('../models/Project');
const TaskModel = require("../models/Task");
class ProjectService {
    static async createProject(projectData) {
        try {
            const project = new ProjectModel(projectData);
            return await project.save();
        } catch (error) {
            throw new Error('Error creating project: ' + error.message);
        }
    }

    static async getAllProjects() {
        try {
            return await ProjectModel.find().populate('createdBy', 'name').populate('tasks');
        } catch (error) {
            throw new Error('Error fetching projects: ' + error.message);
        }
    }

    static async getProjectById(projectId) {
        try {
            return await ProjectModel.findById(projectId).populate('createdBy', 'name').populate('tasks');
        } catch (error) {
            throw new Error('Error fetching project by ID: ' + error.message);
        }
    }

    static async updateProject(projectId, projectData) {
        try {
            return await ProjectModel.findByIdAndUpdate(projectId, projectData, { new: true });
        } catch (error) {
            throw new Error('Error updating project: ' + error.message);
        }
    }
    static async getProjectsByUser(userId) {
        try {
            const userTaskProjects = await TaskModel.find({ assignedTo: userId }).distinct("project");

            if (!userTaskProjects.length) {
                return [];
            }

            const projects = await ProjectModel.find({ _id: { $in: userTaskProjects } })
                .populate("createdBy", "name email")
                .populate({
                    path: "tasks",
                    populate: { path: "assignedTo", select: "name email" }
                });

            return projects;
        } catch (error) {
            throw new Error("Error fetching user projects: " + error.message);
        }
    }



static async deleteProject(projectId) {
        try {
            return await ProjectModel.findByIdAndDelete(projectId);
        } catch (error) {
            throw new Error('Error deleting project: ' + error.message);
        }
    }
}

module.exports = ProjectService;
