/**
 * Helper function for getting initial access and redirect tokens locally
 * @param client_key {string}
 * @param client_secret {string}
 * @param redirect_base {string}
 */
import {NextFunction, Request, Response} from "express";

function setup(client_key: string, client_secret: string, redirect_base: string): void {
    function getTokens() {
        return {access_token: false, refresh_token: false};
    }
    function setTokens(access: string, refresh: string) {
        console.log("Access: " + access);
        console.log("Refresh: " + refresh);
    }

    const td = require("../index")(getTokens, setTokens, false, client_key, client_secret),
        express = require('express'),
        app = express();

    const redirectUri = redirect_base + "/auth/timedoctor";

    app.get("/login", (req: Request,res: Response) => {
        res.redirect(td.Base.Auth.getAuthUrl(redirectUri))
    });

    app.use("/auth/timedoctor", async (req: Request,res: Response, next: NextFunction) => {
        await td.Base.Auth.handleCallback(req,res,redirectUri);
    });
    app.get("/", (req: Request,res: Response) => {
        res.send("Ok");
    });

    const port = (process.env.PORT || 3000);

    app.listen(port, () => {
        console.log("running!");
    });
}
export default setup;