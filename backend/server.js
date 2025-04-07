import express, { Router } from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import pkg from 'body-parser';
const { json } = pkg;
import { successResponse, notFound, serverError, alreadyExist } from './responseService.js';

const port = 2000;
const router = Router();
const app = express();
app.use(cors());
app.use(json());

const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "proses"
});
app.get("/", (req, res) => {
    return res.json("From user's backend");
});

//to get all users
app.get("/getAllUsers", async (req, res) => {
    const getQuery = "SELECT * FROM user";
    let [rows] = await db.query(getQuery); 
    successResponse(res, rows);
});

//to get user by id
app.get("/getUserById/:id", async (req, res) => {
    const { id } = req.params;
    const getByIdquery = "SELECT * FROM user WHERE id = ?";
    const [rows] = await db.query(getByIdquery, [id]);

    if (rows.length === 0) {
        notFound(res, `User with id ${id} not found`);
    } else {
        successResponse(res, rows);
    }   
});

// Add a new user
app.post('/addUser', async (req, res) => {
    try {
        const { name, email, gender, password } = req.body;

        const checkQuery = "SELECT * FROM user WHERE email = ?";
        let [rows] = await db.query(checkQuery, [email]);

        if (rows && rows.length > 0) {
            throw alreadyExist(res, rows, `${email} already exists`);
        } else {
            const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

            const query = "INSERT INTO user (name, email, gender, password) VALUES (?, ?, ?, ?)";
            const values = [name, email, gender, hashedPassword];
            let [rows] = await db.query(query, values);

            successResponse(res, rows, `User ${name} added successfully`);
        }
    } catch (error) {
        console.error("Error adding user:", error);
        serverError(res, error, "Error occurred while adding user");
    }
});

// Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const query = "SELECT * FROM user WHERE email = ?";
        const [rows] = await db.query(query, [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password,user.password );

        console.log({isPasswordValid})

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "An error occurred during login" });
    }
});

// Update user
app.put("/updateUser/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(req.params)
        const { name, email, gender, password } = req.body;
        const checkQuery = "SELECT * FROM user WHERE email = ? AND id != ?";
        const [rows] = await db.query(checkQuery, [email, id]);

        if (rows && rows.length > 0) {
            return alreadyExist(res, rows, `${email} already exists for another user`);
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); 
        const updateQuery = "UPDATE user SET name = ?, email = ?, gender = ?, password = ? WHERE id = ?";
        const values = [name, email, gender, hashedPassword, id];
        const [result] = await db.query(updateQuery, values);

        if (result.affectedRows === 0) {
            return notFound(res, `User with id ${id} not found`);
        }
        successResponse(res, { id, name, email, gender }, "User updated successfully");
    } catch (error) {
        console.error("Error updating user:", error);
        serverError(res, error, "An error occurred while updating the user");
    }
}); 

// Delete user
app.delete("/deleteUser/:id", async (req, res) => {
    const { id } = req.params;
    const deleteQuery = "DELETE FROM user WHERE id = ?";
    const [result] = await db.query(deleteQuery, [id]);

    if (result.affectedRows === 0) {
        notFound(res, `User with id ${id} not found`);
    } else {
        successResponse(res, `Successfully deleted user with id ${id}`);
    }
});

app.listen(port, () => {
    console.log(`Running on http//:localhost:${port}`);
});

export default router;