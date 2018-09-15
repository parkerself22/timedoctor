import "mocha";
import "chai";
import helpers from "./helpers";
const {describe, it, after, before, afterEach, beforeEach} = require("mocha");
let chai = require('chai');
const {expect} = chai;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(require('sinon-chai'));
const nock = require('nock');
chai.should();


const appUsage = helpers.td.WebAppUsage,
    webResp = require("../../data/mocked-responses/WebAppUsage.json");

describe("WebAppUsage", () => {

    it("LISTS /webandapp", async () => {
        nock(`https://webapi.timedoctor.com/v1.1/companies/${helpers.company_id}`)
            .get(function (uri: string) {
                return uri.indexOf("/webandapp") >= 0;
            })
            .reply(200, webResp);

        let result = await appUsage.get(new Date(), new Date(), "") as any;

        expect(result.error).to.eq(false);
        expect(result.errorMessage).to.eq(false);
        expect(result.response).to.be.an("array");
        expect(result.response[0].websites_and_apps.length).to.eq(1);
    });
});