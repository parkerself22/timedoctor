'use strict'

/**
 * @class AbsentLate
 * @property {Timedoctor} td
 * @property {function(start_date: Date, end_date: Date, params?)} get
 * @property {function(reasons, params?)} put
 */
class AbsentLate {
    /**
     * @param td {Timedoctor}
     */
    constructor(td) {
        this.td = td;
    }
    /**
     * @typedef {Object} AbsentReturn
     * @property {{shiftStartTs: number, mustBeCompletedByTs: number, minimumHoursSec: number, hoursWorkedInt: number}} schedules
     * @property {[]} companyReasons
     */
    /**
     * Get all the users
     * @param {Date} start_date
     * @param {Date} end_date
     * @param {{userId?: <String|number>, offset?: number, limit?: number}} params
     * @return {Promise<AbsentReturn>} return
     */
    get(start_date, end_date, params = {}) {
        params.start_date = this.td.toTDDate(start_date);
        params.end_date = this.td.toTDDate(end_date);

        let options = {
            uri: `/absent-and-late`,
            qs: params
        }
        return this.td.query(options);
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
        return this.td.query(options);
    }
}
module.exports = AbsentLate;