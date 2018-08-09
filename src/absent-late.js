'use strict'
const Timedoctor = require('./Timedoctor');

class AbsentLate extends Timedoctor {
    /**
     * Get all the users
     * @param params {{userId?: String, start_date?: Date, end_date?: Date, offset?: number, limit?: number}}
     * @return {Promise}
     */
    get(params = {}) {
        if(params.start_date)  {
            params.start_date = this.toTDDate(params.start_date)
        }
        if(params.end_date)  {
            params.end_date = this.toTDDate(params.end_date)
        }
        let options = {
            uri: `/absent-and-late`,
            qs: params
        }
        return this.query(options);
    }

    /**
     * @param params {{}}
     * @param params.userId {String?} Comma seperated list of User Ids that access token owner manages
     * @param reasons {[String]} Array of reasons
     * @return {Promise}
     */
    put(reasons, params = {} ) {
        let qs = {};
        if(params && params.userId) {
            qs.userId = params.userId
        }

        qs.reasons = JSON.stringify(reasons.map(r => {return {text: r}}));

        let options = {
            uri: `/absent-and-late`,
            qs: params,
            method: "PUT"
        }
        return this.query(options);
    }
}
module.exports = AbsentLate;