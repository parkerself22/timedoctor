import "mocha";
import "chai";
import helpers from "./helpers";
const {describe, it, before} = require("mocha");
let chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(require('sinon-chai'));
const nock = require('nock');
chai.should();

const {td} = helpers;
const companyJson = require("../../data/mocked-responses/Company.json");

describe("Companies", () => {
    before(() => {
        nock.cleanAll();
    });
    it("GET /companies", async() => {
        const instance = td.Companies;
        nock(`https://webapi.timedoctor.com/v1.1`)
            .get(function(uri:string) {
                return uri.indexOf("/companies") >= 0;
            })
            .reply(200, companyJson);

        let result = await instance.get() as any;

        result.error.should.eq(false);
        result.errorMessage.should.eq(false);
        result.response.should.be.an("object");
        result.response.accounts.should.be.an("array");
        result.response.user.should.be.an("object");
    });

    it("sets company id for the base instance", () => {
        const fakeTd = td as any;
        const instance = fakeTd.Companies as any;
        let newId = Math.random() as any;
        instance.set(newId);

        instance.td.company_id.should.eq(newId);
        Object.keys(td).forEach((key) => {
            let k = key as any;
            if(k !== "Base") {
                fakeTd[k].td.company_id.should.eq(newId);
            } else {
                fakeTd[k].company_id.should.eq(newId);
            }
        })
    });
});