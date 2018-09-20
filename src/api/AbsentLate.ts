'use strict';
import Timedoctor from "./Timedoctor";

export type AbsentLateQuery = {
    userId?: string|number,
    offset?: number,
    limit?: number,
    start_date?: string,
    end_date?: string
}
export type AbsentLateReason = {
    text: string
}

export type AbsentLateSchedule = {
    shiftStartsTs: number,
    mustBeCompletedByTs: number,
    minimumHours: string,
    minimumHoursSec: number,
    actualStart: string,
    hoursWorked: string,
    status: string,
    futureStatus: string,
    reason: string,
    reasonOther: string,
    icon: string,
    isFutureDate: 0|1,
    isChecked: boolean,
    isLate: boolean,
    monitorLateStatus: 0|1,
    actualEndTimeStamp: number,
    actualEndTime: string,
    actualStartAttendance: string,
    shiftEndTime: string,
    hoursWorkedInt: number,
    secondsWorked: number,
    currentShift: 0|1,
    shiftStarts: string,
    shiftStartDate: string,
    shiftStartTime: string,
    mustBeCompletedBy: string,
    shiftLength: string,
    shiftBreakTime: string,
    shiftBreakTimeInt: number,
    fullName: string
}

export type AbsentLateResponse = {
    fullname: string,
    schedules: AbsentLateSchedule[],
    reasons: AbsentLateReason[]
}

export type AbsentLatePutParams = {
    userId?: string,
    reasons: AbsentLateReason[]
}

/**
 * @class AbsentLate
 * @property {Timedoctor} td
 * @property {function(start_date: Date, end_date: Date, params?)} get
 * @property {function(reasons, params?)} put
 */
export default class AbsentLate {
    /**
     * @param td {Timedoctor}
     */
    td: Timedoctor;
    constructor(td: Timedoctor) {
        this.td = td;
    }
    /**
     * Get all the users
     * @param {Date} start_date
     * @param {Date} end_date
     * @param {{userId?: <String|number>, offset?: number, limit?: number}} params
     * @return {Promise<AbsentLateResponse>} return
     */
    get(start_date: Date, end_date:Date, params: AbsentLateQuery = {}) {
        let query = Object.assign({
            start_date: this.td.toTDDate(start_date),
            end_date: this.td.toTDDate(end_date)
        }, params);
        
        let options = {
            uri: `/absent-and-late`,
            qs: query
        };
        return this.td.query<AbsentLateResponse>(options);
    }

    /**
     * @param params {{}}
     * @param params.userId {String?} Comma seperated list of User Ids that access token owner manages
     * @param reasons {[String]} Array of reasons
     * @return {Promise}
     */
    put(reasons: string[], params: AbsentLatePutParams = {reasons: []} ) {
        let qs: AbsentLatePutParams = {
            reasons: reasons.map(r => {return {text: r}})
        };
        if(params && params.userId) {
            qs.userId = params.userId
        }

        let options = {
            uri: `/absent-and-late`,
            qs,
            method: "PUT"
        };
        return this.td.query(options);
    }
}