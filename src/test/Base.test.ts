import "mocha";
import "chai";
const {describe, it, after, before, afterEach, beforeEach} = require("mocha");
let chai = require('chai');
const {should, expect} = chai;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(require('sinon-chai'));
const nock = require('nock');
chai.should();
const sinon = require('sinon');
import Timedoctor from "../Timedoctor";
import helpers from './helpers';
const {company_id, saveTokens, getTokens} = helpers;
const companyJson = require("../../data/mocked-responses/Company.json");


describe("Timedoctor", () => {
    it("has a default props", async () => {
        const instance = new Timedoctor(getTokens, saveTokens, company_id, "test", "test")
        expect(instance).to.have.property("company_id");
        expect(instance).to.have.property("Auth");
    });

    it("handles errors", async () => {
        const instance = new Timedoctor(getTokens, saveTokens, company_id, "test", "test");
        expect(instance.handleError("test")).to.be.rejected;
    });

    it("requires company id to call an endpoint", async () => {
        const instance = new Timedoctor(getTokens, saveTokens, null, "test", "test");
        return expect(instance.query()).to.be.rejected;
    });

    it("ensures token is on the API call", async() => {
        const mockGetTokens = sinon.spy(getTokens);
        const instance = new Timedoctor(mockGetTokens, saveTokens, "12233", "test", "test");

        nock(`https://webapi.timedoctor.com/v1.1`)
            .get(function(uri: string) {
                return uri.indexOf("/companies") >= 0;
            })
            .reply(200, companyJson);
        await instance.query();
        mockGetTokens.called.should.eq(true);
    });

    it("attempts to refresh on invalid grant errors", async () => {
        const instance = new Timedoctor(getTokens, saveTokens, "12233", "test", "test");
        let spy = sinon.spy(instance, "handleInvalidGrant");
        nock(`https://webapi.timedoctor.com/v1.1`)
            .get(function(uri: string) {
                return uri.indexOf("/companies") >= 0;
            })
            .reply(401, {error: "invalid_grant"});
        await instance.query();
        expect(spy.called).to.eq(true);
    });

    it("calls the API again after refreshing token", async () => {
        const instance = new Timedoctor(getTokens, saveTokens, "12233", "test", "test");
        let spy = sinon.spy(instance.Auth, "refresh");

        //first call invalid grant
        nock(`https://webapi.timedoctor.com/v1.1`)
            .get(function(uri: string) {
                return uri.indexOf("/companies") >= 0;
            }).reply(401, {error: "invalid_grant"});

        nock(`https://webapi.timedoctor.com/v1.1`)
            .get(function(uri: string) {
                return uri.indexOf("/companies") >= 0;
            }).reply(200, companyJson);

        nock(`https://webapi.timedoctor.com`)
            .get(function(uri: string) {
                return uri.indexOf("token") >= 0;
            }).reply(200, {access_token: "tt", refresh_token: "ttt"});

        let result = await instance.query();

        expect(spy.called).to.eq(true);
        expect(result.error).to.eq(false);
    });

    it("returns an error elsewise", async () => {
        const instance = new Timedoctor(getTokens, saveTokens, "12233", "test", "test");
        nock(`https://webapi.timedoctor.com/v1.1`)
            .get(function(uri: string) {
                return uri.indexOf("/companies") >= 0;
            })
            .reply(404, {error: "not invalid_grant"});

        let response = await instance.query();
        expect(response.error).to.eq(true);
    })

});