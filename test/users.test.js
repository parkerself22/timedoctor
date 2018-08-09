let sinon = require('sinon');
let chai = require('chai');
let { expect } = chai;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(require('sinon-chai'));
const nock = require('nock')
chai.should();

const {td, company_id} = require("./helpers");
const users = td.Users,
    userJson = require("./mocked-responses/getUser.json"),
    usersJson = require("./mocked-responses/getUsers.json");

describe("Users", () => {
    it("GET /users/:id", async () => {
        nock(`https://webapi.timedoctor.com/v1.1/companies/${company_id}`)
            .get(function(uri) {
                return uri.indexOf("/users/1234") >= 0;
            })
            .reply(200, userJson);

        let result = await users.getUser(1234);

        result.error.should.eq(false);
        result.errorMessage.should.eq(false);
        result.response.should.be.an("object");
        result.response.should.have.property("full_name");
        result.response.user_id.should.eq(1234)
    });

    it("GET /users/?emails", async () => {
        nock(`https://webapi.timedoctor.com/v1.1/companies/${company_id}`)
            .get(function(uri) {
                return uri.indexOf("/users?emails=") >= 0;
            })
            .reply(200, usersJson);

        let result = await users.getUsers(["parker@go2impact.com"]);

        result.error.should.eq(false);
        result.errorMessage.should.eq(false);
        result.response.should.be.an("object");
        result.response.should.have.property("users");
    });
});