import datafile from "../datafile.js";

export const addNewFlagToDatafile = (newFlag) => {
    datafile.flags.push(newFlag);
}

export const toggleFlagStatusInDatafile = (updatedFlags) => {
    datafile.flags = updatedFlags;
    
}

export const deleteFlagInDatafile = (updatedFlags) => {
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