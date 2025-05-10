const express = require('express');
const app = express();
const bodyParser = require('body-parser');
let seedData = require('./seedData.js');
const cors = require('cors');
const datafile = require('./datafile.js');
const flag = require('./Models/Flag.js');
const rule = require('./Models/Rule.js');
const { addNewFlagToDatafile, toggleFlagStatusInDatafile, deleteFlagInDatafile, addNewRuleInDatafile, deleteRuleInDatafile, updateRuleInDatafile } = require('./utils/updateDatafile.js');

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
    
    // save to "db"
    seedData.flags.push(newFlag);

    // if successful, update datafile
    addNewFlagToDatafile(newFlag);

        return res.json({message: "ok", data: seedData.flags})
});

app.get("/cdn/:productID/:sdkKey", (req, res) => {
    return res.json(datafile);
});

app.get("/api/:projectID/flags/:flagID", (req, res) => {
    const {flagID} = req.params;
    const foundFlag = seedData.flags.find(flag => flag.key === flagID);
    if (foundFlag) {
        console.log("fetched flag = ", foundFlag);        

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

    const updatedSeedFlags = seedData.flags.map(flag => {
        if (flag.id == flagID) {
            return {
                ...flag,
                enabled: flag.status === "running" ? false : true, 
                status: flag.status === "running" ? "paused" : "running"
            }
        }
                
        return flag;   
    });
    seedData.flags = updatedSeedFlags;

    // update datafile
    const updatedFlags = datafile.flags.map(flag => {
        if (flag.id == flagID) {
            return {
                ...flag,
                enabled: flag.status === "running" ? false : true, 
                status: flag.status === "running" ? "paused" : "running"
            }
        }
                
        return flag;            
    })
    datafile.flags = updatedFlags;

    return res.json("successfully toggle exp")
})

app.delete("/api/:projectID/flags/:flagID", (req, res) => {

    const {flagID} = req.params;

    // find flag in DB
    const filteredFlags = seedData.flags.filter(flag => flag.id != flagID);
    seedData.flags = filteredFlags

    // // update datafile
    deleteFlagInDatafile(flagID)
    
    return res.json(filteredFlags);
});

app.post("/api/:projectID/rules", (req, res) => {
    const ruleConfig = req.body;
    
    // "create" rule and "save" to db
    const newRule = rule(ruleConfig);
    if (!seedData.rules.includes(ruleConfig.key)) {
        seedData.rules.push(newRule);    
    }

    // add rule key as reference in flag
    const copyFlags = seedData.flags.map(f => {
        if (f.key === newRule.linkedFlag) {
            f.rules.push(newRule.key);
        }
        return f;
    })
    seedData.flags = copyFlags;
  
      // updated datafile
      addNewRuleInDatafile(newRule)

    return res.json(newRule);

    // else handle error...


});

app.patch("/api/:projectID/rules", (req, res) => {
    const updatedRule = req.body;
    const updatedRules = seedData.rules.map(rule => {
        return rule.id == updatedRule.id ? updatedRule : rule;
    });
    seedData.rules = updatedRules;

    // update datafile
    updateRuleInDatafile(updatedRule);

    return res.json({
            "status": "success",
            "message": "Rule updated successfully",
            "data": {
            "rule": updatedRule
        }
        }
      );
});

app.delete("/api/:projectID/flags/:flagId/rules/:ruleId", (req, res) => {
    const {flagId, ruleId} = req.params;

    // remove reference to key for deleted rule from flag
    const foundRule = seedData.rules.find(rule => rule.id === parseInt(ruleId));
    if (foundRule) {
        
        // find linked flag and delete reference to rule on the flag
        const filteredFlags = seedData.flags.filter(flag => {
            
            if (flag.key === foundRule.linkedFlag) {
                
                const updatedFlagRules = flag.rules.filter(ruleKey => ruleKey !== foundRule.key);
                flag.rules = updatedFlagRules;
                
                    const updatedRuleConfigs = flag.rulesConfigs.filter(config => config.key !== foundRule.key);
                    
                    flag.rulesConfigs = updatedRuleConfigs;
                
                
            }
            return flag
        });
        seedData.flags = filteredFlags;
    }

    // delete rule
        const updatedRules = seedData.rules.filter(rule => rule.id !== parseInt(ruleId));
        seedData.rules = updatedRules;

        // update datafile
        deleteRuleInDatafile(foundRule)

        return res.json({status: "success"})
});

app.listen("8080", () => {
    console.log("app listening on port 8080");
});