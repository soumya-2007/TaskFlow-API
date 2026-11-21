
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = 3000;

app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to TaskFlow API"
    });
});

// User routes
app.use("/users", userRoutes);

// Task routes
app.use("/tasks", taskRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
