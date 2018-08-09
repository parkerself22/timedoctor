require("dotenv").config();
let env = process.env;
console.log(env);

function saveTokens(access_token, refresh_token) {
    console.log("saved tokens")
}

function getTokens() {
    return {
        access_token: "test",
        refresh_token: "test"
    }
}

const td = require("../src")(getTokens, saveTokens, process.env.TD_COMPANY, process.env.TD_CK, process.env.TD_CS);
const company_id = process.env.TD_COMPANY;

module.exports = {td, company_id, saveTokens, getTokens};

