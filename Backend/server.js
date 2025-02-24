require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { setupChat } = require("./socket/socket");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const app = express();
const server = http.createServer(app);
const ProjectController = require("./controllers/ProjectController");

app.use(cors());
app.use(express.json());

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


app.use("/users", userRoutes);
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);



app.get("/", (req, res) => {
    res.send(" Project & Task Manager API is running...");
});


setupChat(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});