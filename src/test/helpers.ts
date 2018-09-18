import TDApi = require("../index");
require("dotenv").config();

function saveTokens(access_token: string, refresh_token: string) {
    console.log("saved tokens");
}
async function getTokens() {
    return {
        access_token: "test",
        refresh_token: "test"
    }
}
const td = new TDApi(getTokens, saveTokens,
    process.env.TD_COMPANY ? process.env.TD_COMPANY : "", process.env.TD_CK ? process.env.TD_CK : "",
    process.env.TD_CS ? process.env.TD_CS : ""),
    company_id = process.env.TD_COMPANY;

const helpers = {td, company_id, saveTokens, getTokens};

export default helpers;

