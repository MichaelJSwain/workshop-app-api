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

app.patch("/api/:projectID/flags/:flagID", (req, res) => {
    const {projectID, flagID} = req.params;

    const copyFlags = datafile.flags.map(flag => {
        console.log(flag);
        const copy = flag.id == flagID ? 
                    {
                        ...flag, 
                        status: flag.status === "running" ? "paused" : "running"
                    } :
                    {...flag};
        return copy;            
    })

    datafile.flags = copyFlags;
    console.log(copyFlags);
    return res.json("successfully toggle exp")
})

app.listen("8080", () => {
    console.log("app listening on port 8080");
});