const { User } = require("./User.js");
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

let listUser = [
    new User("1", "Mohamed"),
    new User("2", "geba"),
    new User("3", "semi")
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Store authenticated users
let authenticatedUsers = new Map();

server.on("upgrade", (request, socket, head) => {
    try {
        const params = new URL(request.url, `http://${request.headers.host}`).searchParams;
        const userId = params.get("id");
        const userName = params.get("name");

        // Validate user
        const user = listUser.find(user => user.id === userId && user.name === userName);
        if (!user) {
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
            socket.destroy();
            return;
        }

        wss.handleUpgrade(request, socket, head, (ws) => {
            ws.user = user; // Store user data in WebSocket object
            wss.emit("connection", ws, user);
        });
    } catch (error) {
        console.error("Upgrade error:", error);
        socket.destroy();
    }
});

wss.on("connection", (ws, user) => {
    console.log(`User ${user.name} connected`);

    // Send a welcome message to the user
    ws.send(JSON.stringify({ type: "welcome", message: `Welcome ${user.name}` }));
    console.log("Sent:", JSON.stringify({ type: "welcome", message: `Welcome ${user.name}` }));

    ws.on("message", (data) => {
        try {
            const { sender, text } = JSON.parse(data.toString()); // ✅ Parse JSON
            console.log("Received from", sender, ":", text);

            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ sender, text }));
                }
            });
        } catch (error) {
            console.error("Invalid JSON message received:", data.toString());
        }
    }
    );


    ws.on("close", () => {
        console.log(`User ${user.name} disconnected`);
    });

    ws.on("error", console.error);
});

server.listen(3000, () => console.log("Listening on port: 3000"));

// Serve the main page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/getAll", (req, res) => {
    res.json({ users: listUser });
});

app.get("/AddUser", (req, res) => {
    res.sendFile(path.join(__dirname, "add.html"));
});

app.post("/AddUser", (req, res) => {
    const { id, name } = req.body;

    if (!id || !name) {
        return res.status(400).json({ error: "ID and name are required" });
    }

    const newUser = new User(id, name);
    listUser.push(newUser);
    console.log("User added:", newUser);
    res.json({ message: "User added successfully", user: newUser });
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

app.post("/login", (req, res) => {
    const { id, name } = req.body;

    if (!id || !name) {
        return res.status(400).json({ error: "ID and name are required" });
    }

    const user = listUser.find(user => user.id === id && user.name === name);
    if (user) {
        authenticatedUsers.set(id, user);
        console.log("User logged in:", user);
        res.json({ message: "User logged in successfully", user });
    } else {
        res.status(401).json({ error: "User not found" });
    }
});
app.use(express.static(path.join(__dirname, "public")));

app.get("/chat", (req, res) => {
    res.sendFile(path.join(__dirname, "chat.html"));
});
