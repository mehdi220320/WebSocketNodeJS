const express = require("express");
const UserController = require("../controllers/userController");
const authvalidator = require("../controllers/authvalidation");
const router = express.Router();


router.post("/create", UserController.createUser);
router.get("/",authvalidator, UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

module.exports = router;