'use strict'

/**
 * @param getTokens
 * @param setTokens
 * @param company_id
 * @param client_key
 * @param client_secret
 * @return {{Companies, AbsentLate, Users, Worklogs, Base: Timedoctor}}
 */
function timedoctor(getTokens, setTokens, company_id, client_key, client_secret) {
    if( !client_secret || !client_key ) {
        throw new Error('You must provide client credentials!')
    }
    if(!getTokens || !setTokens || typeof getTokens !== "function" || typeof setTokens !== "function") {
        throw new Error('You must provide getTokens and setTokens functions')
    }

    const api = {
        Timedoctor: require("./timedoctor"),
        AbsentLate: require("./absent-late"),
        Users: require("./users"),
        Worklogs: require("./worklogs"),
        Companies: require("./companies")
    }
    const base = new api.Timedoctor(getTokens, setTokens, company_id, client_key, client_secret);

    return {
        Base: base,
        Companies: new api.Companies(base),
        AbsentLate: new api.AbsentLate(base),
        Users: new api.Users(base),
        Worklogs: new api.Worklogs(base)
    }
}
module.exports = timedoctor;