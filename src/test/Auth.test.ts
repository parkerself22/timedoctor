import "mocha";
import "chai";
import helpers from "./helpers";
import {Request, Response} from "express";

const {td} = helpers;
const {describe, it} = require("mocha");
let chai = require('chai');
const {should, expect} = chai;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(require('sinon-chai'));
const nock = require('nock');
chai.should();
const sinon = require('sinon');

const Auth = td.Base.Auth;

describe("utilities/Auth", () => {
    it("get the OAuth Url", async () => {
        let url = Auth.getAuthUrl("r");
        expect(url).to.eq(`https://webapi.timedoctor.com/oauth/v2/auth?client_id=${td.Base.Auth.client_key}&response_type=code&redirect_uri=r`)
    });

    it("calls saveToken after refreshing", async () => {
        nock(`https://webapi.timedoctor.com/oauth/v2/}`)
            .get(function (uri: string) {
                return uri.indexOf("/token") >= 0;
            })
            .reply(200, {access_token: "1234", refresh_token: "1234"});
        let stub = sinon.stub(td.Base.Auth, "setTokens");
        await td.Base.Auth.refresh();

        expect(td.Base.Auth.refresh_token).to.eq("1234");
        expect(td.Base.Auth.access_token).to.eq("1234");
        stub.called.should.eq(true);
    });

    it("handles the OAuth callback SUCCESS", async () => {
        nock(`https://webapi.timedoctor.com/oauth/v2/}`)
            .get(function (uri: string) {
                return uri.indexOf("/token") >= 0 && uri.indexOf("test.com") >= 0;
            })
            .reply(200, {access_token: "1234", refresh_token: "1234"});
        const res = {
            send: sinon.spy()
        } as Response;
        const req = {
            query: {code: "1234"},
        } as Request;
        await td.Base.Auth.handleCallback(req, res, "test.com");

        let responseSpy = res.send as any;
        expect(responseSpy.called).to.eq(true);
        expect(responseSpy.getCall(0).args[0]).to.eq("Access Token: 1234 \nRefresh Token: 1234")
    });

    it("handles the OAuth callback ERROR", async () => {
        nock(`https://webapi.timedoctor.com/oauth/v2/}`)
            .get(function (uri: string) {
                return uri.indexOf("/token") >= 0 && uri.indexOf("test.com") >= 0;
            })
            .reply(200, {error: "test"});
        const res = {
            send: sinon.spy()
        } as Response;
        const req = {
            query: {code: "1234"}
        } as Request;
        await td.Base.Auth.handleCallback(req, res, "test.com");

        let responseSpy = res.send as any;
        expect(responseSpy.called).to.eq(true);
        expect(responseSpy.getCall(0).args[0]).to.eq("Error: test")
    })
});