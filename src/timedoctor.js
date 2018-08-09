'use strict'
const request = require("request-promise-native"),
    /** @class Auth */
    Auth = require("./utilities/auth");
/**
 * @class Timedoctor
 * @property Auth {Auth}
 * @property company_id {number}
 *
 */
class Timedoctor {
    constructor(getTokens, setTokens, company_id, client_key, client_secret) {
       this.company_id = company_id;
       this.Auth = new Auth(getTokens, setTokens, client_key, client_secret);
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