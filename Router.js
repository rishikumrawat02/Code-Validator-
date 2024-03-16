const express = require('express');
const app = express();
const ValidateController = require('./Controller/validateController');

app.get('/', function (req, res) {
    return res.status(200).json({ message: "Welcome to GFG Internship Task" });
});

app.post("/validate", ValidateController.validateHtml);

module.exports = app;