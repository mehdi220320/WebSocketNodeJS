const { UserModel } = require("../models/User");

class UserService {
    static async createUser(userData) {
        try {
            const user = new UserModel(userData);
            return await user.save();
        } catch (error) {
            throw new Error("Error creating user");
        }
    }

    static async getAllUsers() {
        try {
            return await UserModel.find();
        } catch (error) {
            throw new Error("Error fetching users");
        }
    }

    static async getUserById(userId) {
        try {
            return await UserModel.findById(userId);
        } catch (error) {
            throw new Error("Error fetching user by ID");
        }
    }

    static async updateUser(userId, userData) {
        try {
            return await UserModel.findByIdAndUpdate(userId, userData, { new: true });
        } catch (error) {
            throw new Error("Error updating user");
        }
    }

    static async deleteUser(userId) {
        try {
            return await UserModel.findByIdAndDelete(userId);
        } catch (error) {
            throw new Error("Error deleting user");
        }
    }
}

module.exports = UserService;
