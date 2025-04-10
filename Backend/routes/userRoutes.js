const express = require("express");
const UserController = require("../controllers/userController");
const authvalidator = require("../controllers/authvalidation");
const router = express.Router();



router.get("/",authvalidator, UserController.getAllUsers);
router.get('/inactive-users', UserController.getInactiveUsers);

router.get("/:id", UserController.getUserById);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);
router.put("/:id/activate", UserController.activateUser);
router.put("/:id/assign-team-leader", UserController.assignTeamLeader);
router.get("/team-leader/:teamLeaderId", UserController.getUsersByTeamLeader);
router.get('/inactive-users', UserController.getInactiveUsers);
module.exports = router;