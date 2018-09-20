'use strict';
import Timedoctor from "./Timedoctor";

export type TasksQuery = {
    offset?: number,
    limit?: number,
    status?: "all" | "active" | "inactive",
    latest_first?: 0 | 1
}

export type TaskRespObj = {
    task_id: number,
    project_id: number,
    project_name: string,
    task_name: string,
    active: boolean,
    user_id: number,
    assigned_by: number,
    url: string,
    task_link: string
}

export type TasksResponse = {
    count: string,
    url: string,
    offset: number,
    limit: string,
    tasks: TaskRespObj[]
}
export type TaskPost = {
    task_name: string,
    project_id: number,
    category_id?: number,
    user_id?: number,
    task_link?: string
}
export type TaskUpdate = {
    task_name: string,
    project_id?: number,
    category_id?: number,
    user_id?: number,
    task_link?: string
}

/**
 * @class Tasks
 * @property {Timedoctor} td
 * @property {function(start_date: Date, end_date: Date, params?)} get
 * @property {function(reasons, params?)} put
 */
export default class Tasks {
    /**
     * @param td {Timedoctor}
     */
    td: Timedoctor;
    constructor(td: Timedoctor) {
        this.td = td;
    }

    /**
     * Get projects list
     * @param user_id {string}
     * @param {{userId?: <String|number>, offset?: number, limit?: number}} params
     * @return {Promise<TasksResponse>} return
     */
    list(user_id: string, params: TasksQuery = {}) {

        let options = {
            uri: `/users/${user_id}/tasks`,
            qs: params
        };
        return this.td.query<TasksResponse>(options);
    }

    /**
     * Get a specific task
     * @param {string} user_id
     * @param {string} task_id
     * @return {Promise<TDResponse<TasksResponse>>}
     */
    get(user_id: string, task_id: string) {

        let options = {
            uri: `/users/${user_id}/tasks/${task_id}`,
        };
        return this.td.query<TaskRespObj>(options);
    }

    /**
     * Create a task
     * @param {string} user_id
     * @param {TaskPost} task
     * @return {Promise<TDResponse<TasksResponse>>}
     */
    create(user_id: string, task: TaskPost) {
        let body = {
            task
        };

        let options = {
            uri: `/users/${user_id}/tasks`,
            method: "POST",
            body
        };
        return this.td.query<TasksResponse>(options);
    }

    /**
     * Update a task
     * @param {string} user_id
     * @param {string} task_id
     * @param {TaskPost} task
     * @return {Promise<TDResponse<TasksResponse>>}
     */
    update(user_id: string, task_id: string, task: TaskUpdate) {

        let body = {
            task
        };
        let options = {
            uri: `/users/${user_id}/tasks/${task_id}`,
            method: "PUT",
            body
        };
        return this.td.query<TasksResponse>(options);
    }
}