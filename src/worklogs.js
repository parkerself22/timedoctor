'use strict'
/**
 * @class Worklogs
 * @property {Timedoctor} td
 * @property {function(start_date<Date>, end_date<Date>, params?)} get
 */
class Worklogs {
    /**
     * @param td {Timedoctor}
     */
    constructor(td) {
        this.td = td;
    }

    /**
     * Get all the worklogs
     * @param start_date {Date}
     * @param end_date {Date}
     * @param params {{[user_ids]:[number],[task_ids]: [number],[project_ids]: [number],
     * [offset]: number, [limit]: number, breaks_only?: bool, consolidated?: bool, last_modified?: Date }}
     * @return {Promise}
     */
    get(start_date, end_date, params = {}) {
        if(!start_date || !end_date) {return this.handleError("Both start_date and end_date are required")}

        params.start_date = this.td.toTDDate(start_date);
        params.end_date = this.td.toTDDate(end_date);

        if(params.last_modified) {
            params.last_modified = this.td.toTDDate(params.last_modified);
        }

        let options = {
            uri: `/worklogs`,
            qs: params
        }
        return this.td.query(options);
    }
}
module.exports = Worklogs;