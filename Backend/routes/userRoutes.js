const express = require("express");
const UserController = require("../controllers/userController");
const authvalidator = require("../controllers/authvalidation");
const router = express.Router();


router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

module.exports = router;