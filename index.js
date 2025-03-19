const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const seedData = require('./seedData.js');

app.use(bodyParser.json());

app.get("/api/:projectID/flags", (req, res) => {
    const {projectID} = req.params;

    return res.json({message: "ok", data: seedData})
});

app.post("/api/:projectID/flags", (req, res) => {
    const {name, key, description} = req.body;

    seedData.push({name, key, description});

    return res.json({message: "ok", data: seedData})
});

app.listen("8080", () => {
    console.log("app listening on port 8080");
})