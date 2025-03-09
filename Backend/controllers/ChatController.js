const ChatService = require("../services/ChatService");
class ChatController {
    static async getChatByProjectID(req, res) {
        try {
            const projectId = req.params.projectId;
            const chat = await ChatService.getChatByProjectId(projectId);

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
}

module.exports = ChatController;