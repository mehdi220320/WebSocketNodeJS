const TaskService = require("../services/taskService");

class TaskController {
    static async createTask(req, res) {
        try {
            const { title, description, assignedTo, project, status, dueDate } = req.body;
            const newTask = await TaskService.createTask({ title, description, assignedTo, project, status, dueDate });
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
            res.status(200).json({ message: "Task updated successfully", task: updatedTask });
        } catch (error) {
            console.error("Error updating task:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async deleteTask(req, res) {
        try {
            const taskId = req.params.id;
            await TaskService.deleteTask(taskId);
            res.status(200).json({ message: "Task deleted successfully" });
        } catch (error) {
            console.error("Error deleting task:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports = TaskController;
