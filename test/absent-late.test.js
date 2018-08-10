let chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(require('sinon-chai'));
const nock = require('nock')
chai.should();

const {td, company_id} = require("./helpers");
const AbsentLate = td.AbsentLate,
    absentJson = require("./mocked-responses/absentLate.json");

describe("AbsentLate", () => {
    it("GET /absent-and-late", async () => {
        nock(`https://webapi.timedoctor.com/v1.1/companies/${company_id}`)
            .get(function(uri) {
                return uri.indexOf("/absent") >= 0;
            })
            .reply(200, absentJson);

        let result = await AbsentLate.get(new Date(), new Date());

        result.error.should.eq(false);
        result.errorMessage.should.eq(false);
        result.response.should.be.an("array");
        result.response[0].should.have.property("fullname");
        result.response[0].should.have.property("schedules");
    });

    it("PUT /absent-and-late", async () => {
        nock(`https://webapi.timedoctor.com/v1.1/companies/${company_id}`)
            .put(function(uri) {
                return uri.indexOf("/absent") >= 0;
            })
            .reply(200, absentJson);

        let result = await AbsentLate.put(["test"]);

        result.error.should.eq(false);
        result.errorMessage.should.eq(false);

    });

});