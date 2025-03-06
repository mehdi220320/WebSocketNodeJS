const mongoose = require("mongoose");

class User {
    constructor(id, name, role = "User") {
        this.id = id;
        this.name = name;
        this.role = role;
        this.isActivated = isActivated;
    }
}

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["Admin", "Team Leader", "Dev"], default: "User" },
        token: { type: String },
        isActivated: { type: Boolean, default: false }
    },
    { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = { User, UserModel };
