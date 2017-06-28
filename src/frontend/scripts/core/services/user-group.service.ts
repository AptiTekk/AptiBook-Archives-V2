/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {ReplaySubject} from "rxjs";
import {UserGroup, UserGroupHierarchyDown, UserGroupHierarchyUp} from "../../models/user-group.model";
import {User} from "../../models/user.model";
import {Resource} from "../../models/resource.model";

@Injectable()
export class UserGroupService {

    private rootUserGroup: ReplaySubject<UserGroup> = new ReplaySubject<UserGroup>(1);

    constructor(private apiService: APIService) {
        this.fetchRootUserGroup();
    }

    /**
     * TODO: JAVADOCS
     */
    public fetchRootUserGroup(): void {
        this.apiService.get("userGroups")
            .then(response => this.rootUserGroup.next(response))
            .catch(err => this.rootUserGroup.error(err))
    }

    /**
     * TODO: JAVADOCS
     * @returns {ReplaySubject<UserGroup>}
     */
    public getRootUserGroup(): ReplaySubject<UserGroup> {
        return this.rootUserGroup;
    }

    /**
     * TODO: JAVADOCS
     * @param id
     * @returns {any}
     */
    public getUserGroupById(id: number): Promise<UserGroup> {
        return new Promise((resolve, reject) => {
            this.apiService.get("userGroups/" + id)
                .then(response => resolve(response))
                .catch(err => reject(err))
        });
    }

    /**
     * TODO: JAVADOCS
     * @param userGroup
     * @returns {any}
     */
    public getUsersByGroup(userGroup: UserGroup): Promise<User[]> {
        return new Promise((resolve, reject) => {
            this.apiService.get("userGroups/" + userGroup.id + "/users")
                .then(response => resolve(response))
                .catch(err => reject(err))
        })
    }

    /**
     * TODO: JAVADOCS
     * @param userGroup
     * @returns {Promise<T>}
     */
    public getResourcesByGroup(userGroup: UserGroup): Promise<Resource[]> {
        return new Promise((resolve, reject) => {
            this.apiService.get("userGroups/" + userGroup.id + "/resources")
                .then(response => resolve(response))
                .catch(err => reject(err))
        })
    }

    /**
     * Gets the upward hierarchy in relation to a User Group.
     * (The group's parent, their parent, their parent, ... etc)
     *
     * @param userGroup The origin User Group.
     * @returns A Promise that gives the same User Group as was passed in, with an upward hierarchy.
     */
    public getUserGroupHierarchyUp(userGroup: UserGroup): Promise<UserGroupHierarchyUp> {
        return new Promise((resolve, reject) => {
            this.apiService.get(`/userGroups/${userGroup.id}/hierarchy/up`)
                .then(response => resolve(response))
                .catch(err => resolve(err))
        })
    }

    /**
     * Gets the downward hierarchy in relation to a User Group.
     * (The group's children, their children, their children, ... etc)
     *
     * @param userGroup The origin User Group.
     * @returns A Promise that gives the same User Group as was passed in, with a downward hierarchy.
     */
    public getUserGroupHierarchyDown(userGroup: UserGroup): Promise<UserGroupHierarchyDown> {
        return new Promise((resolve, reject) => {
            this.apiService.get(`/userGroups/${userGroup.id}/hierarchy/down`)
                .then(response => resolve(response))
                .catch(err => resolve(err))
        })
    }

    /**
     * Adds a new User Group with the details provided in the provided UserGroup object.
     * @param parent The Parent User Group of the new User Group.
     * @param userGroup The new User Group. Should contain the name.
     * @returns A Promise that gives the newly created User Group.
     */
    public addNewUserGroup(parent: UserGroup, userGroup: UserGroup): Promise<UserGroup> {
        return new Promise((resolve, reject) => {
            this.apiService.post(`userGroups/${parent.id}/children`, userGroup)
                .then(response => resolve(response))
                .catch(err => reject(err))
        })
    }

    /**
     * TODO: JAVADOCS
     * @param userGroup
     * @returns {Promise<T>}
     */
    public patchUserGroup(userGroup: UserGroup): Promise<any> {
        return new Promise((resolve, reject) => {
            this.apiService.patch("userGroups/" + userGroup.id, userGroup)
                .then(response => resolve())
                .catch(err => reject(err))
        })
    }

    /**
     * TODO: JAVADOCS
     * @param userGroup
     * @param newParentUserGroup
     * @returns {Promise<T>}
     */
    public moveUserGroup(userGroup: UserGroup, newParentUserGroup: UserGroup): Promise<any> {
        return new Promise((resolve, reject) => {
            this.apiService.patch("userGroups/" + userGroup.id + "/move?newParentId=" + newParentUserGroup.id)
                .then(response => resolve())
                .catch(err => reject(err))
        })
    }

    /**
     * TODO: JAVADOCS
     * @param userGroup
     * @returns {Promise<T>}
     */
    public deleteUserGroup(userGroup: UserGroup): Promise<any> {
        return new Promise((resolve, reject) => {
            this.apiService.del("userGroups/" + userGroup.id)
                .then(response => resolve())
                .catch(err => reject(err))
        })
    }

}