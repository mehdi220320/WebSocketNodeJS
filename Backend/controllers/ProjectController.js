const ProjectService = require("../services/projectService");

class ProjectController {
    static async createProject(req, res) {
        try {
            const { name, description, createdBy, status, tasks } = req.body;
            const newProject = await ProjectService.createProject({ name, description, createdBy, status, tasks });
            res.status(201).json({ message: "Project created successfully", project: newProject });
        } catch (error) {
            console.error("Error creating project:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async getAllProjects(req, res) {
        try {
            const projects = await ProjectService.getAllProjects();
            res.status(200).json(projects);
        } catch (error) {
            console.error("Error fetching projects:", error);
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
            res.status(200).json({ message: "Project deleted successfully" });
        } catch (error) {
            console.error("Error deleting project:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports = ProjectController;
