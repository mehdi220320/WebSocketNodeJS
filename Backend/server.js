require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { setupChat } = require("./socket/socket"); // Import chat module
const userRoutes = require("./routes/userRoutes");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB  yekhdem"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.get("/test", (req, res) => {
    res.send("Test route is working!");
});

// User routes
app.use("/users", userRoutes);

// Home route
app.get("/", (req, res) => {
    res.send(" Project & Task Manager API is running...");
});

// Setup WebSocket chat server
setupChat(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
