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
            return await ProjectModel.find().populate('createdBy', 'name')
                .populate('tasks')
                .populate('teamLeader', 'name email')
        } catch (error) {
            throw new Error('Error fetching projects: ' + error.message);
        }
    }

    static async getProjectById(projectId) {
        try {
            return await ProjectModel.findById(projectId)
                .populate('createdBy', 'name')
                .populate('tasks')
                .populate('teamLeader', 'name email') ;
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
                })
                .populate('teamLeader', 'name email');

            return projects;
        } catch (error) {
            throw new Error("Error fetching user projects: " + error.message);
        }
    }

    static async getProjectsByTeamLeader(teamLeaderId) {
        try {
            const projects = await ProjectModel.find({ teamLeader: teamLeaderId })
                .populate("createdBy", "name email")
                .populate("tasks")
                .populate("teamLeader", "name email");

            return projects;
        } catch (error) {
            throw new Error("Error fetching projects for team leader: " + error.message);
        }
    }
    static async getProjectsByUser(userId) {
        try {
            const userProjects = await ProjectModel.find({
                $or: [{ createdBy: userId }, { teamLeader: userId }]
            });

            const userTasks = await TaskModel.find({ assignedTo: userId }).select("project");
            const taskProjectIds = [...new Set(userTasks.map(task => task.project.toString()))];

            const taskProjects = await ProjectModel.find({ _id: { $in: taskProjectIds } });

            const allProjects = [...userProjects, ...taskProjects];
            const distinctProjects = Array.from(new Map(allProjects.map(proj => [proj._id.toString(), proj])).values());

            return distinctProjects;
        } catch (error) {
            console.error("Error fetching user projects:", error);
            throw error;
        }
    }
    static async getUserInvolvedProjects(userId) {
        try {
            // Fetch projects where the user is the creator or team leader
            const directProjects = await ProjectModel.find({
                $or: [{ createdBy: userId }, { teamLeader: userId }]
            });

            // Fetch tasks assigned to the user and get distinct project IDs
            const tasks = await TaskModel.find({ assignedTo: userId }).select("project");
            const taskProjectIds = [...new Set(tasks.map(task => task.project.toString()))];

            // Fetch the projects from those tasks
            const taskProjects = await ProjectModel.find({ _id: { $in: taskProjectIds } });

            // Merge the results and remove duplicates
            const allProjects = [...directProjects, ...taskProjects];
            const uniqueProjects = Array.from(new Map(allProjects.map(p => [p._id.toString(), p])).values());

            return uniqueProjects;
        } catch (error) {
            console.error("Error fetching user's involved projects:", error);
            throw error;
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
