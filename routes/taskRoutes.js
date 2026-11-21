
const express = require("express");
const fs = require("fs");
const path = require("path");

const { validate } = require("@soumya_jalihal/express-input-guard");

const router = express.Router();

const tasksFile = path.join(__dirname, "../data/tasks.json");

// Create task
router.post(
    "/",
    validate({
        body: {
            userId: {
                required: true,
                type: "number"
            },
            title: {
                required: true,
                type: "string",
                minLength: 3
            },
            description: {
                required: true,
                type: "string"
            }
        }
    }),
    (req, res) => {
        try {
            const { userId, title, description } = req.body;

            const tasks = JSON.parse(
                fs.readFileSync(tasksFile, "utf-8")
            );

            const newTask = {
                id: Date.now(),
                userId,
                title,
                description,
                completed: false,
                createdAt: new Date().toISOString()
            };

            tasks.push(newTask);

            fs.writeFileSync(
                tasksFile,
                JSON.stringify(tasks, null, 2)
            );

            res.status(201).json({
                success: true,
                message: "Task created successfully",
                task: newTask
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
);

// Get all tasks for a user
router.get(
    "/",
    validate({
        query: {
            userId: {
                required: true,
                type: "string"
            }
        }
    }),
    (req, res) => {
        try {
            const userId = Number(req.query.userId);

            const tasks = JSON.parse(
                fs.readFileSync(tasksFile, "utf-8")
            );

            const userTasks = tasks.filter(
                task => task.userId === userId
            );

            res.json({
                success: true,
                count: userTasks.length,
                tasks: userTasks
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
);

// Get a single task by ID
router.get(
    "/:id",
    validate({
        params: {
            id: {
                required: true,
                type: "string"
            }
        }
    }),
    (req, res) => {
        try {
            const taskId = Number(req.params.id);

            const tasks = JSON.parse(
                fs.readFileSync(tasksFile, "utf-8")
            );

            const task = tasks.find(
                task => task.id === taskId
            );

            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: "Task not found"
                });
            }

            res.json({
                success: true,
                task
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
);

// Update a task
router.put(
    "/:id",
    validate({
        params: {
            id: {
                required: true,
                type: "string"
            }
        },
        body: {
            title: {
                type: "string",
                minLength: 3
            },
            description: {
                type: "string"
            },
            completed: {
                type: "boolean"
            }
        }
    }),
    (req, res) => {
        try {
            const taskId = Number(req.params.id);

            const tasks = JSON.parse(
                fs.readFileSync(tasksFile, "utf-8")
            );

            const taskIndex = tasks.findIndex(
                task => task.id === taskId
            );

            if (taskIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: "Task not found"
                });
            }

            const { title, description, completed } = req.body;

            if (title !== undefined) {
                tasks[taskIndex].title = title;
            }

            if (description !== undefined) {
                tasks[taskIndex].description = description;
            }

            if (completed !== undefined) {
                tasks[taskIndex].completed = completed;
            }

            fs.writeFileSync(
                tasksFile,
                JSON.stringify(tasks, null, 2)
            );

            res.json({
                success: true,
                message: "Task updated successfully",
                task: tasks[taskIndex]
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
);

// Delete a task
router.delete(
    "/:id",
    validate({
        params: {
            id: {
                required: true,
                type: "string"
            }
        }
    }),
    (req, res) => {
        try {
            const taskId = Number(req.params.id);

            const tasks = JSON.parse(
                fs.readFileSync(tasksFile, "utf-8")
            );

            const taskIndex = tasks.findIndex(
                task => task.id === taskId
            );

            if (taskIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: "Task not found"
                });
            }

            const deletedTask = tasks.splice(taskIndex, 1)[0];

            fs.writeFileSync(
                tasksFile,
                JSON.stringify(tasks, null, 2)
            );

            res.json({
                success: true,
                message: "Task deleted successfully",
                task: deletedTask
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
);



module.exports = router;
