const express = require('express');
const ProjectController = require('../controllers/projectController');
const authvalidator = require("../controllers/authvalidation");

const router = express.Router();
router.post('/',authvalidator, ProjectController.createProject);
router.get('/', ProjectController.getAllProjects);
router.get('/teamleader/with-tasks/:teamLeaderId', ProjectController.getProjectswithtasksByTeamLeader);

router.get('/with-tasks', ProjectController.getAllProjectsWithTasks);
router.get('/project-statistics', ProjectController.getProjectStateStatistics);
router.get('/:id', ProjectController.getProjectById);
router.put('/:id', ProjectController.updateProject);
router.delete('/:id', ProjectController.deleteProject);
router.get('/user/:userId', ProjectController.getProjectsByUser);
router.get('/teamleader/:teamLeaderId', ProjectController.getProjectsByTeamLeader);
router.get('/teamleader/with-tasks/:teamLeaderId', ProjectController.getProjectswithtasksByTeamLeader);
router.get("/user/involved-projects/:userId", ProjectController.getUserInvolvedProjects);
module.exports = router;
