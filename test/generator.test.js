let { expect } = require('chai');

const td = require("../src");

const Users = require('../src/users'),
    Worklogs = require('../src/worklogs'),
    AbsentLate = require('../src/absent-late');

describe("generator", () => {
    it('throws an error when no client credentials are provided', function () {
        expect(td).to.throw(Error, 'You must provide client credentials!')
    })

    it('throws an error when no callbacks are provided', function () {
        expect(() => td("test", "test", "test", "test", "test")).to.throw(Error, 'You must provide getTokens and setTokens functions')
    })

    it('does not throw errors when getTokens and setTokens are functions', function () {
        const setTokens = () => {return {access_token: "test", refresh_token: "test"}};

        expect(td(setTokens, setTokens, "test", "test", "test"));
    });

    it('returns an object', function () {
        const setTokens = () => {return {access_token: "test", refresh_token: "test"}};

        expect(td(setTokens, setTokens, "test", "test", "test")).to.be.an("object")
    });

    it("has properties for all child classes", function() {
        const setTokens = () => {return {access_token: "test", refresh_token: "test"}};
        const instance = td(setTokens, setTokens, "test", "test", "test");
        const classes = ["Users", "Worklogs", "AbsentLate"];

        classes.forEach(cl => {
            expect(instance[cl]).to.be.an.instanceof(eval(cl));
        })
    })
});