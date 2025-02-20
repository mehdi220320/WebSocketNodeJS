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

// Store connected users
let users = new Map();

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join", (username) => {
        users.set(socket.id, username);
        console.log(`${username} joined`);
        io.emit("userList", Array.from(users.values()));
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
