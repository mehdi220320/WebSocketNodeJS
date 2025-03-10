const TaskService = require("../services/taskService");
const { getSocket } = require("../socket/socket");
const  TaskModel  = require('../models/Task');

const ProjectService = require("../services/projectService");

class TaskController {
    static async createTask(req, res) {
        try {
            const { title, description, assignedTo, project, status, dueDate , teamLeader } = req.body;
            const newTask = await TaskService.createTask({ title, description, assignedTo, project, status, dueDate , teamLeader });

            const updatedProject = await ProjectService.getProjectById(project);

            const io = getSocket();
            if (io) {
                io.emit("taskCreated", newTask);
                io.emit("projectUpdated", updatedProject);
            }

            res.status(201).json({ message: "Task created successfully", task: newTask });
        } catch (error) {
            console.error("Error creating task:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async getAllTasks(req, res) {
        try {
            const tasks = await TaskService.getAllTasks();
            res.status(200).json(tasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async getTaskById(req, res) {
        try {
            const taskId = req.params.id;
            const task = await TaskService.getTaskById(taskId);
            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }
            res.status(200).json(task);
        } catch (error) {
            console.error("Error fetching task:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async updateTask(req, res) {
        try {
            const taskId = req.params.id;
            const updatedTask = await TaskService.updateTask(taskId, req.body);

            const io = getSocket();
            if (io) {
                io.emit("taskUpdated", updatedTask);
            }

            res.status(200).json({ message: "Task updated successfully", task: updatedTask });
        } catch (error) {
            console.error("Error updating task:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    static async getTasksByUser(req, res) {
        try {
            const userId = req.params.userId;
            const tasks = await TaskService.getTasksByUserId(userId);

            res.status(200).json(tasks);
        } catch (error) {
            console.error("Error fetching tasks for user:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    static async deleteTask(req, res) {
        try {
            const taskId = req.params.id;
            await TaskService.deleteTask(taskId);

            const io = getSocket();
            if (io) {
                io.emit("taskDeleted", { id: taskId });
            }

            res.status(200).json({ message: "Task deleted successfully" });
        } catch (error) {
            console.error("Error deleting task:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    static async getTasksByTeamLeader(req, res) {
        try {
            const { teamLeaderId } = req.params;

            const tasks = await TaskModel.find({ teamLeader: teamLeaderId })
                .populate("assignedTo", "email name")
                .populate("project", "name");

            if (!tasks || tasks.length === 0) {
                return res.status(404).json({ message: "No tasks found for this team leader" });
            }

            res.status(200).json(tasks);
        } catch (error) {
            console.error("Error fetching tasks by team leader:", error.message);
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }
    static async getTaskStateStatistics(req, res) {
        try {
            const statistics = await TaskService.getTaskStateStatistics();
            res.status(200).json({ statistics });
        } catch (error) {
            console.error("Error fetching task statistics:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports = TaskController;
