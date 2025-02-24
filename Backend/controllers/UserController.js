const UserService = require("../services/userService");

class UserController {
    static async createUser(req, res) {
        try {
            const { name, email, password, role } = req.body;
            const newUser = await UserService.createUser({ name, email, password, role });
            res.status(201).json({ message: "User created successfully", user: newUser });
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async getUserById(req, res) {
        try {
            const userId = req.params.id;
            const user = await UserService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(user);
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const updatedUser = await UserService.updateUser(userId, req.body);
            res.status(200).json({ message: "User updated successfully", user: updatedUser });
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            await UserService.deleteUser(userId);
            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports = UserController;
