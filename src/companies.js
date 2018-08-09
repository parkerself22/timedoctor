'use strict'
const request = require("request-promise-native");
/**
 * @class Companies
 * @property td {Timedoctor}
 * @property get {function()}
 * @property set {function(company_id)}
 */
class Companies {
    /**
     * @param td {Timedoctor}
     */
    constructor(td) {
        this.td = td;
    }
    /**
     * Get companies that the token can access
     * (this is the only endpoint accessible without company_id)
     * @return {Promise}
     */
    async get() {
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
    set(company_id) {
        this.td.company_id = company_id;
    }
}
module.exports = Companies;