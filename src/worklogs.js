'use strict'
const Timedoctor = require('./Timedoctor');

class Worklogs extends Timedoctor {
    /**
     * Get all the users
     * @param start_date {Date}
     * @param end_date {Date}
     * @param params {{[user_ids]:[number],[task_ids]: [number],[project_ids]: [number],
     * [offset]: number, [limit]: number, breaks_only?: bool, consolidated?: bool, last_modified?: Date }}
     * @return {Promise}
     */
    get(start_date, end_date, params = {}) {
        if(!start_date || !end_date) {return this.handleError("Both start_date and end_date are required")}

        params.start_date = this.toTDDate(start_date);
        params.end_date = this.toTDDate(end_date);

        if(params.last_modified) {
            params.last_modified = this.toTDDate(params.last_modified);
        }

        let options = {
            uri: `/worklogs`,
            qs: params
        }
        return this.query(options);
    }
}
module.exports = Worklogs;