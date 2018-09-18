import "mocha";
import helpers from "./helpers";
const {td, company_id} = helpers;
const {describe, it, after, before, afterEach, beforeEach} = require("mocha");
let chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(require('sinon-chai'));
const nock = require('nock');
chai.should();

const AbsentLate = td.AbsentLate,
    absentJson = require("../../data/mocked-responses/AbsentLate.json");

describe("AbsentLate", () => {
    before(() => {
        nock.cleanAll();
    });
    it("GET /absent-and-late", async () => {
        nock(`https://webapi.timedoctor.com/v1.1/companies/${company_id}`)
            .get(function(uri: string) {
                return uri.indexOf("/absent") >= 0;
            })
            .reply(200, absentJson);

        let result = await AbsentLate.get(new Date(), new Date()) as any;

        result.error.should.eq(false);
        result.errorMessage.should.eq(false);
        result.response.should.be.an("array");
        result.response[0].should.have.property("fullname");
        result.response[0].should.have.property("schedules");
    });

    it("PUT /absent-and-late", async () => {
        nock(`https://webapi.timedoctor.com/v1.1/companies/${company_id}`)
            .put(function(uri: string) {
                return uri.indexOf("/absent") >= 0;
            })
            .reply(200, absentJson);

        let result = await AbsentLate.put(["test"]) as any;
        result.error.should.eq(false);
        result.errorMessage.should.eq(false);
    });

});