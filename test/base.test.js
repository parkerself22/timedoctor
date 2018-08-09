let sinon = require('sinon');
let chai = require('chai');
let { expect } = chai;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(require('sinon-chai'));
const nock = require('nock')
chai.should();

const Timedoctor = require("../src/timedoctor");
const {company_id, saveTokens, getTokens} = require("./helpers");
const companyJson = require("./mocked-responses/company.json");


describe("Timedoctor", () => {
    it("has a default props", async () => {
        const instance = new Timedoctor(getTokens, saveTokens(), company_id, "test", "test")
        expect(instance).to.have.property("company_id");
        expect(instance).to.have.property("Auth");
    });

    it("handles errors", async () => {
        const instance = new Timedoctor(getTokens, saveTokens, company_id, "test", "test");
        return instance.handleError(new Error("test")).should.be.rejected;
    });

    it("requires company id to call an endpoint", async () => {
        const instance = new Timedoctor(getTokens, saveTokens, false, "test", "test");
        return instance.query().should.be.rejected;
    });

    it("ensures token is on the API call", async() => {
        const mockGetTokens = sinon.spy(getTokens);
        const instance = new Timedoctor(mockGetTokens, saveTokens, 12233, "test", "test");

        nock(`https://webapi.timedoctor.com/v1.1`)
            .get(function(uri) {
                return uri.indexOf("/companies") >= 0;
            })
            .reply(200, companyJson);
        await instance.query();
        mockGetTokens.called.should.eq(true);
    });

    it("attempts to refresh on invalid grant errors", async () => {
        const instance = new Timedoctor(getTokens, saveTokens, 12233, "test", "test");
        instance.handleInvalidGrant = sinon.spy();
        nock(`https://webapi.timedoctor.com/v1.1`)
            .get(function(uri) {
                return uri.indexOf("/companies") >= 0;
            })
            .reply(401, {error: "invalid_grant"});
        await instance.query();
        instance.handleInvalidGrant.called.should.eq(true);
    });

    it("calls the API again after refreshing token", async () => {
        const instance = new Timedoctor(getTokens, saveTokens, 12233, "test", "test");
        instance.Auth.refresh = sinon.spy();

        //first call invalid grant
        nock(`https://webapi.timedoctor.com/v1.1`)
            .get(function(uri) {
                return uri.indexOf("/companies") >= 0;
            }).reply(401, {error: "invalid_grant"});

        nock(`https://webapi.timedoctor.com/v1.1`)
            .get(function(uri) {
                return uri.indexOf("/companies") >= 0;
            }).reply(200, companyJson);

        let result = await instance.query();

        instance.Auth.refresh.called.should.eq(true);
        result.error.should.eq(false);
    });

    it("returns an error elsewise", async () => {
        const instance = new Timedoctor(getTokens, saveTokens, 12233, "test", "test");
        nock(`https://webapi.timedoctor.com/v1.1`)
            .get(function(uri) {
                return uri.indexOf("/companies") >= 0;
            })
            .reply(404, {error: "not invalid_grant"});

        let response = await instance.query();
        response.error.should.eq(true);
    })

});