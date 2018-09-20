'use strict'
import Timedoctor from "./Timedoctor";

declare type WorklogsParams = {
    user_ids?: string[],
    task_ids?: string[],
    project_ids?: string[],
    offset?: number,
    limit?: number,
    breaks_only?: boolean,
    consolidated?: 0|1,
    last_modified?: Date,
    start_date?: Date,
    end_date?: Date
}

export type WorklogItem = {
    id: string,
    length: string,
    user_id: string,
    user_name: string,
    task_id: string,
    task_name: string,
    task_url: string,
    project_id: string,
    project_name: string
}

export type WorklogResponse = {
    start_time: string,
    end_time: string,
    total: number,
    url: string,
    worklogs: {
        count: number,
        url: string,
        offset: number,
        limit: number,
        items: WorklogItem[]
    }
}

/**
 * @class Worklogs
 * @property {Timedoctor} td
 * @property {function(start_date<Date>, end_date<Date>, params?)} get
 */
export default class Worklogs {
    /**
     * @param td {Timedoctor}
     */
    td: Timedoctor;

    constructor(td: Timedoctor) {
        this.td = td;
    }

    /**
     *
     * @param {Date} start_date
     * @param {Date} end_date
     * @param {WorklogsParams} params
     * @return {WorklogResponse}
     */
    get(start_date: Date, end_date: Date, params: WorklogsParams = {}) {
        if (!start_date || !end_date) {
            return this.td.handleError("Both start_date and end_date are required")
        }

        let query: { [k: string]: any } = Object.assign({
            start_date: this.td.toTDDate(start_date),
            end_date: this.td.toTDDate(end_date)
        }, params);

        if (params.last_modified && params.last_modified !== undefined) {
            query.last_modified = this.td.toTDDate(params.last_modified);
        }
        if(query.user_ids && Array.isArray(query.user_ids)) {
            query.user_ids = query.user_ids.join(",");
        }

        let options = {
            uri: `/worklogs`,
            qs: query
        };
        return this.td.query<WorklogResponse>(options);
    }
}