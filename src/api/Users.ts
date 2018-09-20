'use strict';
import Timedoctor from "./Timedoctor";

export type UserResponse = {
    full_name: string ,
    first_name: string,
    last_name: string,
    email: string,
    url: string,
    user_id: number,
    company_id: number,
    level: string,
    projects: {
        currently_assigned: {
            count: number,
            url: string
        },
        all: {
            count: number,
            url: string
        }
    },
    tasks: {
        all: {
            count: number,
            url: string
        },
        active: {
            count: number,
            url: string
        }
    },
    work_status: {
        code: string,
        info: string,
        current_task: null|string
    },
    managed_users: [],
    teams: [],
    payroll_access: 1,
    billing_access: true,
    avatar: string,
    screenshots_active: 0|1,
    manual_time: 0|1,
    permanent_tasks: 0|1,
    computer_time_popup: number,
    poor_time_popup: number,
    blur_screenshots: 0|1,
    web_and_app_monitoring: 0|1,
    webcam_shots: 0|1,
    screenshots_interval: number,
    user_role_value: null|string,
    status: string,
    reports_hidden: null|string
}

export type UserListResponse = {
    count: number,
    url: string,
    users: UserResponse[]
}
/**
 * @class Users
 * @property td {Timedoctor}
 * @property getUsers {function(emails?)}
 * @property getUser {function(user_id)}
 */
export default class Users {
    /**
     * @param td {Timedoctor}
     */
    td: Timedoctor;

    constructor(td: Timedoctor) {
        this.td = td;
    }

    /**
     * Get all the users
     * @param emails {string[] | null}
     * @return {Promise}
     */
    getUsers(emails: string[] | null = null) {
        let options: { [k: string]: any } = {
            uri: `/users`
        };
        if (emails) {
            options.qs = {emails: emails.join(",")};
        }
        return this.td.query<UserListResponse>(options);
    }

    /**
     * Get a specific user by ID
     * @param user_id {string}
     * @return {Promise}
     */
    getUser(user_id: string) {
        if (!user_id) {
            return this.td.handleError("No User ID provided");
        }
        return this.td.query<UserResponse>({
            uri: `/users/${user_id}`
        });
    }
}