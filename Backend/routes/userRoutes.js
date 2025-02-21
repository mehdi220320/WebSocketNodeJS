const express = require("express");
const { User, UserModel } = require("../models/User");

const router = express.Router();
router.post("/create", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate role
        const validRoles = ["Admin", "Team Leader", "Dev"];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role provided" });
        }

        // Create user instance
        const userInstance = new User(null, name, role);

        // Save to database
        const newUser = new UserModel({
            name: userInstance.name,
            email,
            password,
            role: userInstance.role,
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get all users
router.get("/", async (req, res) => {
    try {
        const users = await UserModel.find();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
