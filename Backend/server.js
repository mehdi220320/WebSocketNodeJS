const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use(cors());
app.get("/", (req, res) => {
    res.send("Socket.IO Server is running...");
});

let users = new Map();
let tasks=new Map();
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join", (username) => {
        users.set(socket.id, username);
        console.log(`${username} joined`);
        io.emit("userList", Array.from(users.values()));
    });
    socket.on("sendTask", ({ id, title, description }) => {
        const author = users.get(socket.id) || "Anonymous";
        const task = new Task(id, title, description, author);
        tasks.set(id, task);
        console.log(`Task created: ${task.displayInfo()}`);
        console.log(tasks)
        io.emit("taskList", task );
    });
    socket.on("sendMessage", (message) => {
        const sender = users.get(socket.id) || "Anonymous";
        console.log(`Message from ${sender}:`, message);
        io.emit("receiveMessage", { sender, text: message.text });
    });


    socket.on("disconnect", () => {
        console.log(`${users.get(socket.id) || "A user"} disconnected`);
        users.delete(socket.id);
        io.emit("userList", Array.from(users.values()));
    });
});

server.listen(3000, () => {
    console.log("Socket.IO server running on port 3000");
});


class Task {
    constructor(id, title, description, author) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.author = author;
    }

    displayInfo() {
        return `Task${this.id}:  ${this.title} by ${this.author}`;
    }
}
