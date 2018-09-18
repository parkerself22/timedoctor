'use strict';
import {getTokens, setTokens} from "./api/Timedoctor";
import Timedoctor from "./api/Timedoctor"
import AbsentLate from "./api/AbsentLate";
import Payrolls from './api/Payrolls';
import Poortime from './api/Poortime';
import Projects from './api/Projects';
import Tasks from './api/Tasks';
import WebAppUsage from './api/WebAppUsage';
import Users from "./api/Users";
import Worklogs from "./api/Worklogs";
import Companies from "./api/Companies";
import setup from "./setup";

class TDApi {
    Base: Timedoctor;
    Companies: Companies;
    AbsentLate: AbsentLate;
    Users: Users;
    Worklogs: Worklogs;
    Poortime: Poortime;
    Payrolls: Payrolls;
    Projects: Projects;
    Tasks: Tasks;
    WebAppUsage: WebAppUsage;
    constructor(getTokens: getTokens, setTokens: setTokens, company_id: string, client_key: string, client_secret: string) {
        if( !client_secret || !client_key ) {
            throw new Error('You must provide client credentials!')
        }
        if(!getTokens || !setTokens || typeof getTokens !== "function" || typeof setTokens !== "function") {
            throw new Error('You must provide getTokens and setTokens functions')
        }
        const base = new Timedoctor(getTokens, setTokens, company_id, client_key, client_secret);

        this.Base = base;
        this.Companies = new Companies(base);
        this.AbsentLate = new AbsentLate(base);
        this.Users = new Users(base);
        this.Worklogs = new Worklogs(base);
        this.Poortime = new Poortime(base);
        this.Payrolls = new Payrolls(base);
        this.Projects = new Projects(base);
        this.Tasks = new Tasks(base);
        this.WebAppUsage = new WebAppUsage(base);
    }
    static setup = setup;
}
export = TDApi;