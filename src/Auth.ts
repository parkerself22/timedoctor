const request = require('request-promise-native');
import {getTokens, setTokens} from "./Timedoctor";
import {Request, Response} from "express";

/**
 * @class Auth
 * @property getTokens {function}
 * @property setTokens {function(access_token, refresh_token)}
 * @property refresh {function}
 * @property getAuthUrl {function}
 * @property handleCallback {function}
 */
export default class Auth {
    getTokens: getTokens;
    setTokens: setTokens;
    client_key: string;
    client_secret: string;
    access_token: string|undefined;
    refresh_token: string|undefined;
    /**
     * @param getTokens {function}
     * @param setTokens {function(access_token, refresh_token)}
     * @param client_key
     * @param client_secret
     */
    constructor(getTokens: getTokens, setTokens: setTokens, client_key: string, client_secret: string) {
        this.getTokens = getTokens;
        this.setTokens = setTokens;

        this.client_key = client_key;
        this.client_secret = client_secret
    }

    async getAuth() {
        if(this.access_token) {
            return {
                access_token: this.access_token,
                refresh_token: this.refresh_token
            }
        } else {
            try {
                return await this.getTokens();
            } catch(e) {
                return false;
            }
        }
    }

    async refresh() {
        try {
            let response = await request({
                method: 'GET',
                baseUrl: `https://webapi.timedoctor.com/oauth/v2/`,
                uri: '/token',
                json: true,
                qs: {
                    client_id: this.client_key,
                    client_secret: this.client_secret,
                    grant_type: "refresh_token",
                    refresh_token: this.refresh_token
                }
            });
            if(response.error) {
                console.error(response.error);
                return;
            }
            this.access_token = response.access_token;
            this.refresh_token = response.refresh_token;
            if(this.access_token && this.refresh_token) {
                await this.setTokens(this.access_token, this.refresh_token);
            }
        } catch(e) {
            console.error(e);
        }
    }

    getAuthUrl(redirect_uri: string) {
        return `https://webapi.timedoctor.com/oauth/v2/auth?client_id=${this.client_key}&response_type=code&redirect_uri=${redirect_uri}`
    }

    async handleCallback(req: Request, res: Response, redirectUri: string) {
        let code = req.query.code;
        try {
            let response = await request({
                method: 'GET',
                url: `https://webapi.timedoctor.com/oauth/v2/token`,
                json: true,
                qs: {
                    client_id: this.client_key,
                    client_secret: this.client_secret,
                    redirect_uri: redirectUri,
                    grant_type: "authorization_code",
                    code: code
                }
            });

            if (response.error) {
                res.send(`Error: ${response.error}`);
                return;
            }
            res.send(`Access Token: ${response.access_token} \nRefresh Token: ${response.refresh_token}`)
        } catch(e) {
            res.json(e);
        }
    }
}