'use strict';
import Timedoctor from "./Timedoctor";

export type ProjectsQuery = {
    offset?: number,
    limit?: number,
    all?: 0|1,
    assigned?: 0|1,
    latest_first?: 0|1
}

export type ProjectRespObj = {
    project_id: number,
    project_source: string,
    project_name: string,
    archived: boolean,
    url: string,
    users: number[]
}

export type ProjectsResponse =   {
    count: string,
    url: string,
    offset: number,
    limit: string,
    projects: ProjectRespObj[]
}

/**
 * @class Projects
 * @property {Timedoctor} td
 * @property {function(start_date: Date, end_date: Date, params?)} get
 * @property {function(reasons, params?)} put
 */
export default class Projects {
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
     * @return {Promise<ProjectsResponse>} return
     */
    list(user_id: string, params: ProjectsQuery = {}) {
        
        let options = {
            uri: `/users/${user_id}/projects`,
            qs: params
        };
        return this.td.query<ProjectsResponse>(options);
    }

    /**
     * Get a specific project
     * @param {string} user_id
     * @param {string} project_id
     * @return {Promise<TDResponse<ProjectsResponse>>}
     */
    get(user_id: string, project_id: string) {
        
        let options = {
            uri: `/users/${user_id}/projects/${project_id}`,
        };
        return this.td.query<ProjectRespObj>(options);
    }
    /**
     * Get a specific project
     * @param {string} user_id
     * @param {string} project_id
     * @return {Promise<TDResponse<ProjectsResponse>>}
     */
    delete(user_id: string, project_id: string) {
        
        let options = {
            uri: `/users/${user_id}/projects/${project_id}`,
            method: "DELETE"
        };
        return this.td.query<ProjectsResponse>(options);
    }
    
    /**
     * Create a project
     * @param {string} user_id
     * @param {string[]|} assign_users
     * @param name {string} Project name
     * @return {Promise<TDResponse<ProjectsResponse>>}
     */
    create(user_id: string, assign_users: string[]|"include_all", name: string) {
        let body = {
            assign_users: Array.isArray(assign_users) ? assign_users.join(","):assign_users,
            project: {
                name
            }
        };

        let options = {
            uri: `/users/${user_id}/projects`,
            method: "POST",
            body
        };
        return this.td.query<ProjectsResponse>(options);
    }

    /**
     * Update a single project
     *
     * @param {string} user_id
     * @param {string[] | "include_all"} assign_users
     * @param {string} project_id
     * @param {string} name
     * @param {string} archived
     * @return {Promise<TDResponse<ProjectsResponse>>}
     */
    update(user_id: string, assign_users: string[]|"include_all", project_id: string, name?: string, archived?: boolean) {

        let project: {[k:string]:any} = {};
        if(name) {
            project.name = name;
        }
        if(archived) {
            project.name = archived ? "0" : "1";
        }
        let body = {
                assign_users: Array.isArray(assign_users) ? assign_users.join(",") : assign_users,
                project
            };
        let options = {
            uri: `/users/${user_id}/projects/${project_id}`,
            method: "PUT",
            body
        };
        return this.td.query<ProjectsResponse>(options);
    }

    /**
     * Un-assign a user from a project
     *
     * @param {string} user_id
     * @param {string[] | "include_all"} assign_users
     * @param {string} project_id
     * @return {Promise<TDResponse<ProjectsResponse>>}
     */
    unassign(user_id: string, assign_users: string[]|"include_all", project_id: string) {

        let body = {
                assign_users: Array.isArray(assign_users) ? assign_users.join(",") : assign_users,
            };
        let options = {
            uri: `/users/${user_id}/projects/${project_id}/users`,
            method: "DELETE",
            body
        };
        return this.td.query<ProjectsResponse>(options);
    }

}