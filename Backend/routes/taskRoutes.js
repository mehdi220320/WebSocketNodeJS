const express = require('express');
const TaskController = require('../controllers/taskController');

const router = express.Router();

router.post('/', TaskController.createTask);
router.get('/', TaskController.getAllTasks);
router.get('/:id', TaskController.getTaskById);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);
router.get("/user/:userId", TaskController.getTasksByUser);
router.get("/team-leader/:teamLeaderId", TaskController.getTasksByTeamLeader);
module.exports = router;
