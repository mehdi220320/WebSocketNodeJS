const express = require('express');
const ProjectController = require('../controllers/projectController');
const authvalidator = require("../controllers/authvalidation");

const router = express.Router();

router.post('/',authvalidator, ProjectController.createProject);
router.get('/', ProjectController.getAllProjects);
router.get('/:id', ProjectController.getProjectById);
router.put('/:id', ProjectController.updateProject);
router.delete('/:id', ProjectController.deleteProject);
router.get('/user/:userId', ProjectController.getProjectsByUser);
router.get('/teamleader/:teamLeaderId', ProjectController.getProjectsByTeamLeader);
module.exports = router;
