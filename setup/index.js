/**
 * Helper function for getting initial access and redirect tokens locally
 * @param client_key {string}
 * @param client_secret {string}
 * @param redirect_base {string}
 */
function setup(client_key, client_secret, redirect_base) {
    function getTokens() {
        return {access_token: false, refresh_token: false};
    }
    function setTokens(access, refresh) {
        console.log("Access: " + access);
        console.log("Refresh: " + refresh);
    }

    const td = require("../src/index")(getTokens, setTokens, false, client_key, client_secret),
        express = require('express'),
        app = express();

    const redirectUri = redirect_base + "/auth/timedoctor";

    app.get("/login", (req,res) => {
        res.redirect(td.Base.Auth.getAuthUrl(redirectUri))
    });

    app.use("/auth/timedoctor", async (req,res,next) => {
        await td.Base.Auth.handleCallback(req,res,redirectUri);
    });
    app.get("/", (req,res) => {
        res.send("Ok");
    })

    const port = (process.env.PORT || 3000);

    app.listen(port, () => {
        console.log("running!");
    });
}
module.exports = setup;