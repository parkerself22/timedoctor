'use strict'

/**
 * @class Users
 * @property td {Timedoctor}
 * @property getUsers {function(emails?)}
 * @property getUser {function(user_id)}
 */
class Users {
    /**
     * @param td {Timedoctor}
     */
    constructor(td) {
        this.td = td;
    }
    /**
     * Get all the users
     * @param emails {Array?}
     * @return {Promise}
     */
    getUsers(emails = null) {
        let options = {
            uri: `/users`
        }
        if(emails) {
            options.qs = {emails: emails.join(",")};
        }
        return this.td.query(options);
    }

    /**
     * Get a specific user by ID
     * @param user_id {number}
     * @return {Promise}
     */
    getUser(user_id) {
        if(!user_id) {
            return this.td.handleError("No User ID provided");
        }
        return this.td.query({
            uri: `/users/${user_id}`
        });
    }
}
module.exports = Users;