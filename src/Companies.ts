'use strict';
import Timedoctor, {TDResponse} from "./Timedoctor";
import {UserResponse} from "./Users";

const request = require("request-promise-native");

export type CompanyItem = {
    user_id: number,
    company_id: number,
    type: string,
    company_name: string,
    url: string,
    company_time_zone_id: number,
    company_time_zone: string,
    company_subdomain: string,
    company_logo: string,
    new_user: 0|1,
    force_project: boolean,
    managers_add_edit_projects: boolean
}
export type CompaniesResponse = {
    user: UserResponse,
    accounts: CompanyItem[]
}
/**
 * @class Companies
 * @property td {Timedoctor}
 * @property get {function()}
 * @property set {function(company_id)}
 */
export default class Companies {
    /**
     * @param td {Timedoctor}
     */
    td: Timedoctor;
    constructor(td: Timedoctor) {
        this.td = td;
    }
    /**
     * Get companies that the token can access
     * (this is the only endpoint accessible without company_id)
     * @return {Promise}
     */
    async get(): Promise<TDResponse<CompaniesResponse>> {
        try {
            let response = await request({
                method: 'GET',
                url: `https://webapi.timedoctor.com/v1.1/companies`,
                json: true,
                qs: { access_token: this.td.Auth.access_token }
            });
            return {
                error: false,
                errorMessage: false,
                response
            };
        } catch(e) {
            return {
                error: true,
                errorMessage: e,
                response: null
            }
        }
    }

    /**
     * Set the company_id
     * @param company_id {number}
     */
    set(company_id: string) {
        this.td.company_id = company_id;
    }
}