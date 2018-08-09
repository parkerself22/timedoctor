const request = require("request-promise-native");

class Auth {
    /**
     *
     * @param getTokens {Function}
     * @param setTokens {Function}
     * @param client_key
     * @param client_secret
     */
    constructor(getTokens, setTokens, client_key, client_secret) {
        this.getTokens = getTokens;
        this.setTokens = setTokens;

        let tokens = this.getTokens();

        this.access_token = tokens.access_token;
        this.refresh_token = tokens.refresh_token;



        this.client_key = client_key
        this.client_secret = client_secret
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
            })
            if(response.error) {
                return;
            }
            this.access_token = response.access_token
            this.refresh_token = response.refresh_token
            this.setTokens(this.access_token, this.refresh_token);
        } catch(e) {
            console.error(e);
        }
    }

    getAuthUrl(redirect_uri) {
        return `https://webapi.timedoctor.com/oauth/v2/auth?client_id=${this.client_key}&response_type=code&redirect_uri=${redirect_uri}`
    }

    async handleCallback(req, res, redirectUri) {
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
            })

            if (response.error) {
                res.send(`Error: ${response.error}`)
                return;
            }
            res.send(`Access Token: ${response.access_token} \nRefresh Token: ${response.refresh_token}`)
        } catch(e) {
            res.json(e);
        }
    }
}

module.exports = Auth