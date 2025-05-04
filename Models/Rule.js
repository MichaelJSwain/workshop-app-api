// placeholder func to imitate data modeling
const rule = (ruleConfig) => {
    console.log("creating rule")
      const rule = {
        ...ruleConfig,
            id: Math.round(Math.random() * 10000000),
          project_id: 29170930006,
          account_id: 29170930006
        }
      return rule;
  }
  
  module.exports = rule;