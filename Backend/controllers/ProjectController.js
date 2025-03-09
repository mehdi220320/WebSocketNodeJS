const ProjectService = require("../services/projectService");
const ChatService = require("../services/ChatService");
const { getSocket } = require("../socket/socket");
const ProjectModel = require('../models/Project');

class ProjectController {
    static async createProject(req, res) {
        try {
            const { name, description, createdBy, teamLeader, status, tasks } = req.body;
            const newProject = await ProjectService.createProject({ name, description, createdBy, teamLeader, status, tasks });
            const newChat=await  ChatService.createChat({project:newProject,messages:[]})
            const io = getSocket();
            if (io) {
                io.emit("projectCreated", newProject);
                io.emit("ChatCreated", newChat);
            }

            res.status(201).json({ message: "Project created successfully", project: newProject });
        } catch (error) {
            console.error("Error creating project:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    static async getProjectsByUser(req, res) {
        try {
            const userId = req.params.userId;
            const projects = await ProjectService.getProjectsByUser(userId);

            res.status(200).json(projects);
        } catch (error) {
            console.error("Error fetching projects:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    static async getAllProjects(req, res) {
        try {
            const projects = await ProjectService.getAllProjects();
            const io = getSocket();
            if (io) {
                io.emit("projectsFetched", projects);
            }
            res.status(200).json(projects);
        } catch (error) {
            console.error("Error fetching projects:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    static async getUserInvolvedProjects(req, res) {
        try {
            const userId = req.params.userId;
            const projects = await ProjectService.getUserInvolvedProjects(userId);
            res.status(200).json(projects);
        } catch (error) {
            console.error("Error fetching user's involved projects:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }}
    static async getProjectsByTeamLeader(req, res) {
        try {
            const teamLeaderId = req.params.teamLeaderId;

            const projects = await ProjectService.getProjectsByTeamLeader(teamLeaderId);
            res.status(200).json(projects);
        } catch (error) {
            console.error("Error fetching projects for team leader:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    static async getProjectById(req, res) {
        try {
            const projectId = req.params.id;
            const project = await ProjectService.getProjectById(projectId);
            if (!project) {
                return res.status(404).json({ message: "Project not found" });
            }
            res.status(200).json(project);
        } catch (error) {
            console.error("Error fetching project:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async updateProject(req, res) {
        try {
            const projectId = req.params.id;
            const updatedProject = await ProjectService.updateProject(projectId, req.body);

            const io = getSocket();
            if (io) {
                io.emit("projectUpdated", updatedProject);
            }

            res.status(200).json({ message: "Project updated successfully", project: updatedProject });
        } catch (error) {
            console.error("Error updating project:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async deleteProject(req, res) {
        try {
            const projectId = req.params.id;
            await ProjectService.deleteProject(projectId);

            const io = getSocket();
            if (io) {
                io.emit("projectDeleted", { id: projectId });
            }

            res.status(200).json({ message: "Project deleted successfully" });
        } catch (error) {
            console.error("Error deleting project:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    static async getAllProjectsWithTasks(req, res) {
        try {
            const projects = await ProjectModel.find()
                .populate({
                    path: "tasks",
                    model: "Task",
                    select: "title assignedTo dueDate status progress",
                })
                .exec();

            const io = getSocket();
            if (io) {
                io.emit("projectsFetchedWithTasks", projects);
            }

            res.status(200).json(projects);
        } catch (error) {
            console.error("Error fetching projects with tasks:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

}

module.exports = ProjectController;
