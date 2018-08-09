let sinon = require('sinon');
let chai = require('chai');
let { expect } = chai;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(require('sinon-chai'));
const nock = require('nock')
chai.should();

const {td, company_id} = require("./helpers");
const Auth = td.Auth,
    worklogsJson = require("./mocked-responses/worklogs.json");

describe("utilities/Auth", () => {
    it("get the OAuth Url", async () => {
        let url = Auth.getAuthUrl("r");
        url.should.eq(`https://webapi.timedoctor.com/oauth/v2/auth?client_id=${td.Auth.client_key}&response_type=code&redirect_uri=r`)

    });

    it("calls saveToken after refreshing", async () => {
        nock(`https://webapi.timedoctor.com/oauth/v2/}`)
            .get(function(uri) {
                return uri.indexOf("/token") >= 0;
            })
            .reply(200, {access_token: "1234", refresh_token: "1234"});
        let stub = sinon.stub(td.Auth, "setTokens");
        await td.Auth.refresh();

        td.Auth.refresh_token.should.eq("1234")
        td.Auth.access_token.should.eq("1234")
        stub.called.should.eq(true);
    });

    it("handles the OAuth callback SUCCESS", async () => {
        nock(`https://webapi.timedoctor.com/oauth/v2/}`)
            .get(function(uri) {
                return uri.indexOf("/token") >= 0 && uri.indexOf("test.com") >= 0;
            })
            .reply(200, {access_token: "1234", refresh_token: "1234"});
        const res = {
            send: sinon.spy()
        }
        const req = {
            query: {code: "1234"}
        }
        await td.Auth.handleCallback(req, res, "test.com");

        res.send.called.should.eq(true);
        res.send.getCall(0).args[0].should.eq("Access Token: 1234 \nRefresh Token: 1234")
    });

    it("handles the OAuth callback ERROR", async () => {
        nock(`https://webapi.timedoctor.com/oauth/v2/}`)
            .get(function(uri) {
                return uri.indexOf("/token") >= 0 && uri.indexOf("test.com") >= 0;
            })
            .reply(200, {error: "test"});
        const res = {
            send: sinon.spy()
        }
        const req = {
            query: {code: "1234"}
        }
        await td.Auth.handleCallback(req, res, "test.com");

        res.send.called.should.eq(true);
        res.send.getCall(0).args[0].should.eq("Error: test")
    })
});