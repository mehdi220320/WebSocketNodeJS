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

        socket.on("disconnect", () => {
            console.log(`${socket.id} disconnected`);
        });
    });
}

function getSocket() {
    return io;
}

module.exports = { setupChat, getSocket };
