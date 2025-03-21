// placeholder func to imitate data modeling
const flag = (name, key, description) => {
    const flag = {
        key,
        name,
        description,
        variable_definitions: {},
        enabled: false,
        status: "paused",
        rules: [],
        id: Math.round(Math.random() * 10000000),
        project_id: 29170930006,
        account_id: 29170930006
      }
    return flag;
}

module.exports = flag;