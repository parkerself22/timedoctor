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


const payrolls = helpers.td.Payrolls;

describe("Payrolls", () => {
    before(() => {
        nock.cleanAll();
    });
    it("GET /payrolls", async () => {
        nock(`https://webapi.timedoctor.com/v1.1/companies/${helpers.company_id}`)
            .get(function (uri: string) {
                return uri.indexOf("/payrolls") >= 0;
            })
            .reply(200, []);

        let result = await payrolls.list();

        expect(result.error).to.eq(false);
        expect(result.errorMessage).to.eq(false);
        expect(result.response).to.be.an("array");
    });
});