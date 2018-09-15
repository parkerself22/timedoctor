'use strict';
import Timedoctor from "./Timedoctor";

export type PayrollQuery = {
    offset?: number,
    limit?: number
}

export type PayrollResponse = {
    [k:string]: any
}

/**
 * @class Payroll
 * @property {Timedoctor} td
 * @property {function(start_date: Date, end_date: Date, params?)} get
 * @property {function(reasons, params?)} put
 */
export default class Payroll {
    /**
     * @param td {Timedoctor}
     */
    td: Timedoctor;
    constructor(td: Timedoctor) {
        this.td = td;
    }
    /**
     * Get all the users
     * @param {{userId?: <String|number>, offset?: number, limit?: number}} params
     * @return {Promise<PayrollResponse>} return
     */
    get(params: PayrollQuery = {}) {
        let options = {
            uri: `/payrolls`,
            qs: params
        };
        return this.td.query<PayrollResponse[]>(options);
    }
}