const { Server } = require("socket.io");

let io;

function setupChat(server) {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("joinChat", (chatID) => {
            socket.join(chatID);
            console.log(`User ${socket.id} joined chat ${chatID}`);
        });

        socket.on("leaveChat", (chatID) => {
            socket.leave(chatID);
            console.log(`User ${socket.id} left chat ${chatID}`);
        });

        socket.on("disconnect", () => {
            console.log(`${socket.id} disconnected`);
        });
    });
}

function getSocket() {
    return io;
}

module.exports = { setupChat, getSocket };

