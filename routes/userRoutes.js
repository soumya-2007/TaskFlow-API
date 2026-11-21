
const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const { validate } = require("@soumya_jalihal/express-input-guard");

const router = express.Router();

const usersFile = path.join(__dirname, "../data/users.json");

// Register user
router.post(
    "/register",
    validate({
        body: {
            name: {
                required: true,
                type: "string",
                minLength: 3
            },
            email: {
                required: true,
                type: "email"
            },
            password: {
                required: true,
                type: "string",
                minLength: 6
            }
        }
    }),
    async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const users = JSON.parse(
                fs.readFileSync(usersFile, "utf-8")
            );

            const existingUser = users.find(
                user => user.email === email
            );

            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "Email already registered"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = {
                id: Date.now(),
                name,
                email,
                password: hashedPassword
            };

            users.push(newUser);

            fs.writeFileSync(
                usersFile,
                JSON.stringify(users, null, 2)
            );

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email
                }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
);

// Login user
router.post(
    "/login",
    validate({
        body: {
            email: {
                required: true,
                type: "email"
            },
            password: {
                required: true,
                type: "string",
                minLength: 6
            }
        }
    }),
    async (req, res) => {
        try {
            const { email, password } = req.body;

            const users = JSON.parse(
                fs.readFileSync(usersFile, "utf-8")
            );

            const user = users.find(
                user => user.email === email
            );

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );

            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });
            }

            res.json({
                success: true,
                message: "Login successful",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
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
