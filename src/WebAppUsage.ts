'use strict';
import Timedoctor from "./Timedoctor";

export type WebAppsQuery = {
    offset?: number,
    limit?: number,
    status?: "all" | "active" | "inactive",
    latest_first?: 0 | 1
}

export type WebAppRespObj = {
    name: string,
    timeSpend: number, //seconds
    timeType: "apps"|"websites"
}

export type WebAppsResponse = {
    full_name: string,
    email: string,
    user_id: number,
    websites_and_apps: WebAppRespObj[]
}

export default class WebApps {
    /**
     * @param td {Timedoctor}
     */
    td: Timedoctor;

    constructor(td: Timedoctor) {
        this.td = td;
    }
    
    get(start_date: Date, end_date: Date, user_id: string, params: WebAppsQuery = {}) {
        if (!start_date || !end_date) {
            return this.td.handleError("Both start_date and end_date are required")
        }

        let query: { [k: string]: any } = Object.assign({
            start_date: this.td.toTDDate(start_date),
            end_date: this.td.toTDDate(end_date),
            user_id
        }, params);

        let options = {
            uri: `/webandapp`,
            qs: query
        };
        return this.td.query<WebAppsResponse>(options);
    }
}