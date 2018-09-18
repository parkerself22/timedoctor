'use strict';
const request = require("request-promise-native");

/** @class Auth */
import Auth from "./Auth";

export type GetTokenRes = {
    access_token: string,
    refresh_token: string
}

export type getTokens = () => Promise<GetTokenRes>

export type setTokens = (access_token: string, refresh_token: string) => void;

export type TDResponse<ResponseType> = {
    error: boolean,
    errorMessage: false,
    response: ResponseType|null
}

/**
 * @class Timedoctor
 * @property Auth {Auth}
 * @property company_id {number}
 *
 */
export default class Timedoctor {
    company_id: string;
    Auth: Auth;
    constructor(getTokens: getTokens, setTokens: setTokens, company_id: any, client_key: string, client_secret: string) {
       this.company_id = company_id;
       this.Auth = new Auth(getTokens, setTokens, client_key, client_secret);
    }

    /**
     * handle Errors
     *
     * @param  message {String?}
     * @return {Promise}
     */
    handleError(message:string = 'Fatal error occured') {
        return Promise.reject(message);
    }

    /**
     * Convert a Date instance to TD format
     * @param date {Date}
     * @return {String}
     */
    toTDDate(date: Date) {
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
    async query<R>(options: {[k:string]: any} = {}, company_id = this.company_id): Promise<TDResponse<R>> {
        const tokens = await this.Auth.getTokens();
        if(!company_id || !tokens) {
            return this.handleError("You must provide a company ID!")
        }

        if(options.qs && !options.qs.access_token) {
            options.qs.access_token = tokens.access_token;
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
                return await this.handleInvalidGrant<R>(options);
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
    async handleInvalidGrant<R>(options: {[k:string]: any}): Promise<TDResponse<R>> {
        try {
            await this.Auth.refresh();
            if(!options.qs) {
                options.qs = {};
            }
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