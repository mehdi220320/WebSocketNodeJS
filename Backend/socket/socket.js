const { Server } = require("socket.io");

let users = new Map();
let
function setupChat(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

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
            socket.emit("taskList", Array.from(tasks.values()));
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

    return io;
}

module.exports = { setupChat };
