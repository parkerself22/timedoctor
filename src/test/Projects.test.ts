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


const projects = helpers.td.Projects,
    projRes = require("../../data/mocked-responses/Projects.json");

describe("Projects", () => {
    before(() => {
        nock.cleanAll();
    });
    it("GET /project/:project_id", async () => {
        nock(`https://webapi.timedoctor.com/v1.1/companies/${helpers.company_id}`)
            .get(function (uri: string) {
                return uri.indexOf("/projects") >= 0;
            })
            .reply(200, projRes.projects[0]);

        let result = await projects.get("12", "111") as any;

        expect(result.error).to.eq(false);
        expect(result.errorMessage).to.eq(false);
        expect(result.response).to.be.an("object");
        expect(result.response.project_name).to.eq("T | TEST");
    });
    it("LISTS /projects", async () => {
        nock(`https://webapi.timedoctor.com/v1.1/companies/${helpers.company_id}`)
            .get(function (uri: string) {
                return uri.indexOf("/projects") >= 0;
            })
            .reply(200, projRes);

        let result = await projects.list("12", {limit: 1}) as any;

        expect(result.error).to.eq(false);
        expect(result.errorMessage).to.eq(false);
        expect(result.response).to.be.an("object");
        expect(result.response.projects[0].project_name).to.eq("T | TEST");
    });
    it("DELETES /projects", async () => {
        let projId = String(Math.random());
        nock(`https://webapi.timedoctor.com/v1.1/companies/${helpers.company_id}`)
            .delete(function (uri: string) {
                return uri.indexOf(`/projects/${projId}`) >= 0;
            })
            .reply(200, []);

        let result = await projects.delete("12", projId) as any;

        expect(result.error).to.eq(false);
        expect(result.errorMessage).to.eq(false);
        expect(result.response).to.be.an("array");
    });
    it("POSTS /projects", async () => {
        nock(`https://webapi.timedoctor.com/v1.1/companies/${helpers.company_id}`)
            .post(function (uri: string) {
                return uri.indexOf(`/projects`) >= 0;
            })
            .reply(200, []);

        let result = await projects.create("12", "include_all", "Test") as any;

        expect(result.error).to.eq(false);
        expect(result.errorMessage).to.eq(false);
        expect(result.response).to.be.an("array");
    });
    it("PUTS /projects/:project_id", async () => {
        let projId = String(Math.random());
        nock(`https://webapi.timedoctor.com/v1.1/companies/${helpers.company_id}`)
            .put(function (uri: string) {
                return uri.indexOf(`/projects/${projId}`) >= 0;
            })
            .reply(200, []);

        let result = await projects.update("12", "include_all", projId, "Test") as any;

        expect(result.error).to.eq(false);
        expect(result.errorMessage).to.eq(false);
        expect(result.response).to.be.an("array");
    });
    it("DELETES /projects/:project_id/users", async () => {
        let projId = String(Math.random());
        nock(`https://webapi.timedoctor.com/v1.1/companies/${helpers.company_id}`)
            .delete(function (uri: string) {
                return uri.indexOf(`/projects/${projId}/users`) >= 0;
            })
            .reply(200, []);

        let result = await projects.unassign("12", "include_all", projId) as any;

        expect(result.error).to.eq(false);
        expect(result.errorMessage).to.eq(false);
        expect(result.response).to.be.an("array");
    });
});