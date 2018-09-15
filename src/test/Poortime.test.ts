import "mocha";
import "chai";
import helpers from "./helpers";
const {td, company_id} = helpers;
const {describe, it, after, before, afterEach, beforeEach} = require("mocha");
let chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(require('sinon-chai'));
const nock = require('nock');
chai.should();


const poortime = td.Poortime,
    poortimeResponse = require("../../data/mocked-responses/Poortime.json");

describe("Poortime", () => {
    it("GET /poortime", async () => {
        nock(`https://webapi.timedoctor.com/v1.1/companies/${company_id}`)
            .get(function (uri: string) {
                return uri.indexOf("/poortime") >= 0;
            })
            .reply(200, poortimeResponse);

        let result = await poortime.get(new Date(), new Date()) as any;

        result.error.should.eq(false);
        result.errorMessage.should.eq(false);
        result.response.should.be.an("array");
    });
});