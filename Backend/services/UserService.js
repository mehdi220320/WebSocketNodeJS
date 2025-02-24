const bcrypt = require("bcryptjs");
const { UserModel } = require("../models/User");

class UserService {
    static async createUser(userData) {
        try {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);

            const user = new UserModel(userData);
            return await user.save();
        } catch (error) {
            throw new Error("Error creating user");
        }
    }

    static async getAllUsers() {
        try {
            return await UserModel.find().select("-password");
        } catch (error) {
            throw new Error("Error fetching users");
        }
    }

    static async getUserById(userId) {
        try {
            return await UserModel.findById(userId).select("-password");
        } catch (error) {
            throw new Error("Error fetching user by ID");
        }
    }

    static async updateUser(userId, userData) {
        try {
            if (userData.password) {
                // Hash new password if updated
                const salt = await bcrypt.genSalt(10);
                userData.password = await bcrypt.hash(userData.password, salt);
            }

            return await UserModel.findByIdAndUpdate(userId, userData, { new: true }).select("-password");
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
    static async getUserByEmail(email) {
        return await UserModel.findOne({ email });
    }
}

module.exports = UserService;
