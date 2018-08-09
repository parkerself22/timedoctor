'use strict'

/**
 * @param getTokens
 * @param setTokens
 * @param company_id
 * @param client_key
 * @param client_secret
 * @return {{Auth, AbsentLate, Users, Worklogs}}
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
        Worklogs: require("./worklogs")
    }
    const base = new api.Timedoctor(getTokens, setTokens, company_id, client_key, client_secret);

    return {
        ...base,
        AbsentLate: new api.AbsentLate(getTokens, setTokens, company_id, client_key , client_secret),
        Users: new api.Users(getTokens, setTokens, company_id, client_key , client_secret),
        Worklogs: new api.Worklogs(getTokens, setTokens, company_id, client_key , client_secret)
    }
}
module.exports = timedoctor;