let sinon = require('sinon');
let chai = require('chai');
let { expect } = chai;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(require('sinon-chai'));
const nock = require('nock')
chai.should();
const request = require("request-promise-native");
const setup = require("../setup");

describe("Setup", () => {
    it("Works", async () => {
        setup("test", "test", "https://test.com");
        let result = await request("http://localhost:3000");
        result.should.eq("Ok");
    });
});