'use strict';
import {getTokens, setTokens} from "./Timedoctor";
import Timedoctor from "./Timedoctor"
import AbsentLate from "./AbsentLate";
import Payrolls from './Payrolls';
import Poortime from './Poortime';
import Projects from './Projects';
import Tasks from './Tasks';
import WebAppUsage from './WebAppUsage';
import Users from "./Users";
import Worklogs from "./Worklogs";
import Companies from "./Companies";
/**
 * @param getTokens {getTokens}
 * @param setTokens {setTokens}
 * @param company_id {string}
 * @param client_key {string}
 * @param client_secret {string}
 * @return {{Companies, AbsentLate, Users, Worklogs, Base: Timedoctor}}
 */
function timedoctor(getTokens: getTokens, setTokens: setTokens, company_id: string, client_key: string, client_secret: string) {
    if( !client_secret || !client_key ) {
        throw new Error('You must provide client credentials!')
    }
    if(!getTokens || !setTokens || typeof getTokens !== "function" || typeof setTokens !== "function") {
        throw new Error('You must provide getTokens and setTokens functions')
    }
    const api = {
        Timedoctor,
        AbsentLate,
        Users,
        Worklogs,
        Payrolls,
        Poortime,
        Projects,
        Tasks,
        WebAppUsage,
        Companies
    };
    const base = new api.Timedoctor(getTokens, setTokens, company_id, client_key, client_secret);

    return {
        Base: base,
        Companies: new api.Companies(base),
        AbsentLate: new api.AbsentLate(base),
        Users: new api.Users(base),
        Worklogs: new api.Worklogs(base),
        Poortime: new api.Poortime(base),
        Payrolls: new api.Payrolls(base),
        Projects: new api.Projects(base),
        Tasks: new api.Tasks(base),
        WebAppUsage: new api.WebAppUsage(base),

    }
}
export default timedoctor;