import Poortime from "../Poortime";
import Users from '../Users';
import Worklogs from '../Worklogs'
import timedoctor from "../index";
import Companies from "../Companies";
import Tasks from "../Tasks";
import Payrolls from "../Payrolls";

import Projects from "../Projects";
import WebAppUsage from "../WebAppUsage";

let chai = require('chai'),
    expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(require('sinon-chai'));

let {describe, it, before} = require('mocha');

describe("generator", () => {

    it('throws an error when no client credentials are provided', function () {
        expect(() => timedoctor("test" as any, "test" as any, "test", null as any, null as any)).to.throw(Error, 'You must provide client credentials!')
    });

    it('throws an error when no callbacks are provided', function () {
        expect(() => timedoctor("test" as any, "test" as any, "test", "test", "test")).to.throw(Error, 'You must provide getTokens and setTokens functions')
    });

    it('does not throw errors when getTokens and setTokens are functions', function () {
        const setTokens = () => {
            return {access_token: "test", refresh_token: "test"}
        };

        expect(timedoctor(setTokens as any, setTokens as any, "test", "test", "test"));
    });

    it('returns an object', function () {
        const setTokens = () => {
            return {access_token: "test", refresh_token: "test"}
        };

        expect(timedoctor(setTokens as any, setTokens as any, "test", "test", "test")).to.be.an("object")
    });

    it("has properties for all child classes", function () {
        const setTokens = async () => {
            return {access_token: "test", refresh_token: "test"}
        };
        const instance = timedoctor(setTokens, setTokens, "test", "test", "test") as any;
        const classes = [
            "AbsentLate",
            "Users",
            "Worklogs",
            "Payrolls",
            "Poortime",
            "Projects",
            "Tasks",
            "WebAppUsage",
            "Companies"
        ];

        classes.forEach(cl => {
            expect(instance[cl]).to.not.eq(undefined)
        })
    })
});