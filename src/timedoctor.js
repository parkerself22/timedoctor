'use strict'
const request = require("request-promise-native"),
    Auth = require("./utilities/auth");
/**
 * @class Timedoctor
 * @property Auth
 * @property company_id
 *
 */
class Timedoctor {
    constructor(getTokens, setTokens, company_id, client_key, client_secret) {
       this.company_id = company_id;
       this.Auth = new Auth(getTokens, setTokens, client_key, client_secret);
       this.Companies = {
           get: this.getCompanies,
           set: this.setCompany
       }
    }

    /**
     * handle Errors
     *
     * @param  message {String?}
     * @return {Promise}
     */
    handleError(message = 'Fatal error occured') {
        return Promise.reject(message);
    }

    /**
     * Get companies that the token can access
     * (this is the only endpoint accessible without company_id)
     * @return {Promise}
     */
    async getCompanies() {
        try {
            let response = await request({
                method: 'GET',
                url: `https://webapi.timedoctor.com/v1.1/companies`,
                json: true,
                qs: { access_token: this.Auth.access_token }
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
    setCompany(company_id) {
        this.company_id = company_id;
    }

    /**
     * Convert a Date instance to TD format
     * @param date {Date}
     * @return {String}
     */
    toTDDate(date) {
        if(isNaN(date.valueOf())) {
            return date;
        }
        return date.toJSON().split("T")[0];
    }

    /**
     * Execute api query
     *
     * @param  options {Object}
     * @param company_id {number?}
     * @return {Promise}
     */
    async query(options = {}, company_id = this.company_id) {
        if(!company_id) {
            return this.handleError("You must provide a company ID!")
        }

        if(options.qs && !options.qs.access_token) {
            options.qs.access_token = this.Auth.access_token ? this.Auth.access_token : await this.Auth.getTokens().access_token;
        }

        options = Object.assign({
            method: 'GET',
            baseUrl: `https://webapi.timedoctor.com/v1.1/companies/${company_id}`,
            uri: '/',
            json: true,
            qs: {access_token: this.Auth.access_token}
        }, options);

        try {
            let result = await request(options);
            return {
                error: false,
                errorMessage: false,
                response: result
            };
        } catch(e) {
            if(e.statusCode === 401 && e.error.error === "invalid_grant") {
                return await this.handleInvalidGrant(options);
            }
            return {
                error: true,
                errorMessage: e,
                response: null
            }
        }
    };

    /**
     * Handle error thrown from invalid grant
     * @param options {Object}
     * @return {Promise.<*>}
     */
    async handleInvalidGrant(options) {
        try {
            await this.Auth.refresh();
            options.qs.access_token = this.Auth.access_token;
            let result = await request(options);
            return {
                error: false,
                errorMessage: false,
                response: result
            };
        } catch(e) {
            return {
                error: true,
                errorMessage: e,
                response: null
            }
        }
    }
}
module.exports = Timedoctor;