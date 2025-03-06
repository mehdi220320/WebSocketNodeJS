const  TaskModel  = require('../models/Task');
const ProjectModel = require('../models/Project');
const { scheduleReminderEmail } = require("../services/mailService");
class TaskService {
    static async createTask(taskData) {
        try {
            const task = new TaskModel(taskData);
            await task.save();
            await ProjectModel.findByIdAndUpdate(task.project, {
                $push: { tasks: task._id }
            });
            scheduleReminderEmail(task);
            return task;

        } catch (error) {
            throw new Error('Error creating task: ' + error.message);
        }
    }

    static async getAllTasks() {
        try {
            return await TaskModel.find().populate('assignedTo', 'name').populate('project');
        } catch (error) {
            throw new Error('Error fetching tasks: ' + error.message);
        }
    }

    static async getTaskById(taskId) {
        try {
            return await TaskModel.findById(taskId).populate('assignedTo', 'name').populate('project');
        } catch (error) {
            throw new Error('Error fetching task by ID: ' + error.message);
        }
    }

    static async updateTask(taskId, taskData) {
        try {
            return await TaskModel.findByIdAndUpdate(taskId, taskData, { new: true });
        } catch (error) {
            throw new Error('Error updating task: ' + error.message);
        }
    }

    static async deleteTask(taskId) {
        try {
            return await TaskModel.findByIdAndDelete(taskId);
        } catch (error) {
            throw new Error('Error deleting task: ' + error.message);
        }
    }
}

module.exports = TaskService;
