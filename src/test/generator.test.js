const Users = require( "../../dist/Users");
const Worklogs = require("../../dist/Worklogs");
const AbsentLate = require("../../dist/AbsentLate");
let chai = require('chai'),
    expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(require('sinon-chai'));

let { describe, it } = require('mocha');
const timedoctor = require("../../dist/index").default;

describe("generator", () => {
    it('throws an error when no client credentials are provided', function () {
        expect(timedoctor).to.throw(Error, 'You must provide client credentials!')
    });

    it('throws an error when no callbacks are provided', function () {
        expect(() => timedoctor("test", "test", "test", "test", "test")).to.throw(Error, 'You must provide getTokens and setTokens functions')
    });

    it('does not throw errors when getTokens and setTokens are functions', function () {
        const setTokens = () => {return {access_token: "test", refresh_token: "test"}};

        expect(timedoctor(setTokens, setTokens, "test", "test", "test"));
    });

    it('returns an object', function () {
        const setTokens = () => {return {access_token: "test", refresh_token: "test"}};

        expect(timedoctor(setTokens, setTokens, "test", "test", "test")).to.be.an("object")
    });

    it("has properties for all child classes", function() {
        const setTokens = async () => {return {access_token: "test", refresh_token: "test"}};
        const instance = timedoctor(setTokens, setTokens, "test", "test", "test");
        const classes = ["Users", "Worklogs", "AbsentLate"];

        classes.forEach(cl => {
            expect(instance[cl]).to.not.eq(undefined)
        })
    })
});