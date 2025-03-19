const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const seedData = require('./seedData.js');
const cors = require('cors');
const datafile = require('./datafile.js');

app.use(bodyParser.json());

app.use(cors({origin: `http://localhost:5173`}))

app.get("/api/:projectID/flags", (req, res) => {
    const {projectID} = req.params;

    return res.json(seedData)
});

app.post("/api/:projectID/flags", (req, res) => {
    const {name, key, description} = req.body;

    seedData.push({name, key, description});

    return res.json({message: "ok", data: seedData})
});

app.get("/cdn/:productID/:sdkKey", (req, res) => {
    return res.json(datafile);
});

app.listen("8080", () => {
    console.log("app listening on port 8080");
});