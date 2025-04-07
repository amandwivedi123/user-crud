// import express from 'express';
// import mySql from 'mysql';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import { successResponse } from './responseService';

const express = require('express');
const mySql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const { successResponse } = require('./responseService');
const port = 2000;
const router = express.Router();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mySql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "proses"
});

app.get("/", (req, res) => {
    return res.json("From user's backend")
})

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});
app.get("/getAllUsers", (req, res) => {
    console.log("Step1");

    const query = "SELECT * FROM user";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        // return res.json(results)
        successResponse(res, results)
    })
})
app.post("/addUser", (req, res) => {
    const { name, email, gender } = req.body;
    const query = "INSERT INTO user (name, email , gender) VALUES (?, ?, ? )";
    db.query(query, [name, email, gender], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "User added", userId: result.insertId });
        successResponse(res, result)
    });
});

app.get("/getUserById/:id", (req, res) => {
    const { id } = req.params;
    console.log(id);
    const query = "SELECT * FROM user WHERE id = ?"
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        console.log(result);
        successResponse(res, result)
        // return res.json(result)
    })
})


app.put("/updateUser/:id", (req, res) => {
    const { id } = req.params;
    const { name, email, gender } = req.body;

    const query = "UPDATE user SET name = ?, email = ?, gender = ? WHERE id = ?";
    const values = [name, email, gender, id];

    db.query(query, values, (err, result) => {
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        successResponse(res, result)
        // res.json({ message: `User ${id} updated successfully` });
    });
});
app.listen(port, () => {
    console.log(`Running on http//:localhost:${port}`)
});

module.exports = router;