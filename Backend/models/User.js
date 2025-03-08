const mongoose = require("mongoose");

class User {
    constructor(id, name, role = "User") {
        this.id = id;
        this.name = name;
        this.role = role;
        this.teamLeader = teamLeader;
        this.isActivated = isActivated;

    }
}

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["Admin", "TeamLeader", "Dev"], default: "User" },
        token: { type: String },
        isActivated: { type: Boolean, default: false },
        teamLeader: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
    },
    { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = { User, UserModel };
