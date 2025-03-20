const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const seedData = require('./seedData.js');
const cors = require('cors');
const datafile = require('./datafile.js');
const flag = require('./Models/Flag.js');

app.use(bodyParser.json());

var corsOptions = {
    origin: [`http://localhost:5173`,`http://localhost:5174`],
    optionsSuccessStatus: 200 // For legacy browser support
    }
    
    app.use(cors(corsOptions));

// app.use(cors({origin: []`http://localhost:5173`, `http://localhost:5174/`]}))

app.get("/api/:projectID/flags", (req, res) => {
    const {projectID} = req.params;

    return res.json(seedData)
});

app.post("/api/:projectID/flags", (req, res) => {
    const {name, key, description} = req.body;

    const newFlag = flag(name, key, description);

    // save to "db"
    // try {
        seedData.push(newFlag);

        // if successful, update datafile
        datafile.flags.push(newFlag);

        return res.json({message: "ok", data: seedData})
    // } catch(e) {
    //     return res.json({message: "error", data: e.message})
    // }

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