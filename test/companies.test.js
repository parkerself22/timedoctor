let sinon = require('sinon');
let chai = require('chai');
let { expect } = chai;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(require('sinon-chai'));
const nock = require('nock')
chai.should();

const {td, company_id} = require("./helpers");
const companyJson = require("./mocked-responses/company.json");

describe("Companies", () => {
    it("GET /companies", async() => {
        const instance = td.Companies;
        nock(`https://webapi.timedoctor.com/v1.1`)
            .get(function(uri) {
                return uri.indexOf("/companies") >= 0;
            })
            .reply(200, companyJson);

        let result = await instance.get();

        result.error.should.eq(false);
        result.errorMessage.should.eq(false);
        result.response.should.be.an("object");
        result.response.accounts.should.be.an("array")
        result.response.user.should.be.an("object")
    });

    it("sets company id for the base instance", () => {
        const instance = td.Companies;
        let newId = Math.random()
        instance.set(newId);

        instance.td.company_id.should.eq(newId);
        Object.keys(td).forEach(key => {
            if(key !== "Base") {
                td[key].td.company_id.should.eq(newId);
            } else {
                td[key].company_id.should.eq(newId);
            }
        })
    });
});