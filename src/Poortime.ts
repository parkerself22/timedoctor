'use strict';
import Timedoctor from "./Timedoctor";

export type PoortimeQuery = {
    offset?: number,
    limit?: number,
    start_date?: string,
    end_date?: string
}

export type PoortimeResponse =   {
    full_name: string,
    email: string,
    user_id: number,
    poor_time_website: {
        [k:string]: {
            name: string,
            timeSpend: number //seconds
        }
    }
}

/**
 * @class Poortime
 * @property {Timedoctor} td
 * @property {function(start_date: Date, end_date: Date, params?)} get
 * @property {function(reasons, params?)} put
 */
export default class Poortime {
    /**
     * @param td {Timedoctor}
     */
    td: Timedoctor;
    constructor(td: Timedoctor) {
        this.td = td;
    }
    /**
     * Get poortime
     * @param {Date} start_date
     * @param {Date} end_date
     * @param {{userId?: <String|number>, offset?: number, limit?: number}} params
     * @return {Promise<PoortimeResponse>} return
     */
    get(start_date: Date, end_date:Date, params: PoortimeQuery = {}) {
        let query = Object.assign({
            start_date: this.td.toTDDate(start_date),
            end_date: this.td.toTDDate(end_date)
        }, params);
        
        let options = {
            uri: `/poortime`,
            qs: query
        };
        return this.td.query<PoortimeResponse[]>(options);
    }
}