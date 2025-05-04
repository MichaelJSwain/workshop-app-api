const express = require('express');
const app = express();
const bodyParser = require('body-parser');
let seedData = require('./seedData.js');
const cors = require('cors');
const datafile = require('./datafile.js');
const flag = require('./Models/Flag.js');
const rule = require('./Models/Rule.js');

app.use(bodyParser.json());

var corsOptions = {
    origin: [`http://localhost:5173`,`http://localhost:5174`],
    optionsSuccessStatus: 200 // For legacy browser support
    }
    
    app.use(cors(corsOptions));

// app.use(cors({origin: []`http://localhost:5173`, `http://localhost:5174/`]}))

app.get("/api/:projectID/flags", (req, res) => {
    const {projectID} = req.params;

    return res.json(seedData.flags)
});

app.post("/api/:projectID/flags", (req, res) => {
    const {name, key, description} = req.body;

    const newFlag = flag(name, key, description);
    console.log('new flag ', newFlag);
    datafile.flags.push(newFlag);
    // save to "db"
    // try {
        seedData.flags.push(newFlag);

        // if successful, update datafile
        

        return res.json({message: "ok", data: seedData.flags})
    // } catch(e) {
    //     return res.json({message: "error", data: e.message})
    // }

});

app.get("/cdn/:productID/:sdkKey", (req, res) => {
    return res.json(datafile);
});

app.get("/api/:projectID/flags/:flagID", (req, res) => {
    const {flagID} = req.params;
    const foundFlag = seedData.flags.find(flag => flag.key === flagID);
    if (foundFlag) {
        console.log(foundFlag);

        if (foundFlag.rules.length) {
            // "populate" rules array
            const populatedRules = foundFlag.rules.map(ruleKey => {
                const foundRule = seedData.rules.find(ruleInDB => ruleInDB.key == ruleKey);
                return foundRule;
            })
            foundFlag.rulesConfigs = populatedRules;
        } else {
            // no rules
        }
        return res.json(foundFlag);
    }
    // handle error
    return null;
});

app.patch("/api/:projectID/flags/:flagID", (req, res) => {
    const {projectID, flagID} = req.params;

    const copyFlags = datafile.flags.map(flag => {
        const copy = flag.id == flagID ? 
                    {
                        ...flag, 
                        status: flag.status === "running" ? "paused" : "running"
                    } :
                    {...flag};
        return copy;            
    })

    // datafile.flags = copyFlags;
    // console.log('datafile updated =', datafile);
    return res.json("successfully toggle exp")
})

app.delete("/api/:projectID/flags/:flagID", (req, res) => {

    const {flagID} = req.params;

    // find flag in DB
    const filteredFlags = seedData.flags.filter(flag => flag.id != flagID);
    seedData.flags = filteredFlags

    // // update datafile
    // datafile.flags = filteredFlags;
    // const copy = datafile.flags.filter(flag => flag.id != flagID);
    // datafile.flags = copy;
    
    return res.json(filteredFlags);
});

app.post("/api/:projectID/rules", (req, res) => {
    // "create" rule and "save" to db
    const ruleConfig = req.body;
    const newRule = rule(ruleConfig);
    seedData.rules.push(newRule);
    
    // add rule key as reference in flag
    const linkedFlag = seedData.flags.find(flag => {return flag.key === newRule.linkedFlag});
    if (linkedFlag) {
        linkedFlag.rules.push(newRule.key);
        console.log("seed data = ", seedData);
        return res.json(newRule);
    }
    // else handle error...
    
});

app.listen("8080", () => {
    console.log("app listening on port 8080");
});