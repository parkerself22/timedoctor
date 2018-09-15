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


const tasks = helpers.td.Tasks,
    taskRes = require("../../data/mocked-responses/Tasks.json");

describe("Tasks", () => {
    it("GET /tasks/:task_id", async () => {
        nock(`https://webapi.timedoctor.com/v1.1/companies/${helpers.company_id}`)
            .get(function (uri: string) {
                return uri.indexOf("/tasks") >= 0;
            })
            .reply(200, taskRes.tasks[0]);

        let result = await tasks.get("12", "1111") as any;

        expect(result.error).to.eq(false);
        expect(result.errorMessage).to.eq(false);
        expect(result.response).to.be.an("object");
        expect(result.response.task_id).to.eq(1111);
    });
    it("LISTS /tasks", async () => {
        nock(`https://webapi.timedoctor.com/v1.1/companies/${helpers.company_id}`)
            .get(function (uri: string) {
                return uri.indexOf("/tasks") >= 0;
            })
            .reply(200, taskRes);

        let result = await tasks.list("12", {limit: 1}) as any;

        expect(result.error).to.eq(false);
        expect(result.errorMessage).to.eq(false);
        expect(result.response).to.be.an("object");
        expect(result.response.tasks[0]).to.haveOwnProperty("task_id")
    });
    it("POSTS /tasks", async () => {
        nock(`https://webapi.timedoctor.com/v1.1/companies/${helpers.company_id}`)
            .post(function (uri: string) {
                return uri.indexOf(`/tasks`) >= 0;
            })
            .reply(200, []);

        let result = await tasks.create("12", {
            task_name: "Test",
            project_id: 1234
        }) as any;

        expect(result.error).to.eq(false);
        expect(result.errorMessage).to.eq(false);
        expect(result.response).to.be.an("array");
    });
    it("PUTS /tasks/:task_id", async () => {
        let projId = String(Math.random());
        nock(`https://webapi.timedoctor.com/v1.1/companies/${helpers.company_id}`)
            .put(function (uri: string) {
                return uri.indexOf(`/tasks/${projId}`) >= 0;
            })
            .reply(200, []);

        let result = await tasks.update("12", projId, {
            task_name: "Test"
        }) as any;

        expect(result.error).to.eq(false);
        expect(result.errorMessage).to.eq(false);
        expect(result.response).to.be.an("array");
    });
});