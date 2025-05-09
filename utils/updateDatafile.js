import datafile from "../datafile.js";

export const addNewFlagToDatafile = (newFlag) => {
    datafile.flags.push(newFlag);
}

export const toggleFlagStatusInDatafile = (flagID) => {
    
}

export const deleteFlagInDatafile = (flagID) => {
    // delete any associated rules
    const foundFlag = datafile.flags.find(f => f.id == flagID);
    if (foundFlag.rules.length) {
        const updatedRules = datafile.rules.filter(rule => {
           return !foundFlag.rules.some(ruleKey => ruleKey == rule.key)
        })
        datafile.rules = updatedRules;
    }

    const updatedFlags = datafile.flags.filter(f => f.id != flagID);
    datafile.flags = updatedFlags;
}

export const addNewRuleInDatafile = (newRule) => {
    datafile.rules.push(newRule);
    datafile.flags = datafile.flags.map(flag => {
        if (newRule.linkedFlag === flag.key) {
            flag.rules.push(newRule.key);
        }
        return flag;
    });
}

export const updateRuleInDatafile = (updatedRule) => {
    const updatedRules = datafile.rules.map(r => {
        if (r.id == updatedRule.id) {
            return updatedRule;
        }
        return r;
    })
    datafile.rules = updatedRules;
}

export const deleteRuleInDatafile = (rule) => {
    // delete rule
    datafile.rules = datafile.rules.filter(r => r.key !== rule.key)

    // delete reference to rule in flag
    datafile.flags.map(flag => {
        if (flag.key === rule.linkedFlag) {
            flag.rules = flag.rules.filter(r => r !== rule.key);
        }
        return flag
    })
    
}