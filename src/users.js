'use strict'

const Timedoctor = require('./Timedoctor');

class Users extends Timedoctor {
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
        return this.query(options);
    }

    /**
     * Get a specific user by ID
     * @param user_id {number}
     * @return {Promise}
     */
    getUser(user_id) {
        if(!user_id) {
            return this.handleError("No User ID provided");
        }
        return this.query({
            uri: `/users/${user_id}`
        });
    }
}
module.exports = Users;