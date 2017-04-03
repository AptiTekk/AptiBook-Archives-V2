/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Observable, ReplaySubject} from "rxjs";
import {UserGroup} from "../../models/user-group.model";
import {User} from "../../models/user.model";
import {Resource} from "../../models/resource.model";

@Injectable()
export class UserGroupService {

    private rootUserGroup: ReplaySubject<UserGroup> = new ReplaySubject<UserGroup>(1);

    constructor(private apiService: APIService) {
        this.fetchRootUserGroup();
    }

    public fetchRootUserGroup(): void {
        this.apiService.get("userGroups").subscribe(
            response => this.rootUserGroup.next(<UserGroup>response),
            err => this.rootUserGroup.error(err)
        )
    }

    public getRootUserGroup(): ReplaySubject<UserGroup> {
        return this.rootUserGroup;
    }

    public getUserGroupById(id: number): Observable<UserGroup> {
        return Observable.create(listener => {
            this.apiService.get("userGroups/" + id)
                .subscribe(
                    response => listener.next(response),
                    err => listener.error(err),
                    () => listener.complete()
                );
        });
    }

    public getUsersByGroup(userGroup: UserGroup): Observable<User[]> {
        return Observable.create(listener => {
            this.apiService.get("userGroups/" + userGroup.id + "/users")
                .subscribe(
                    response => listener.next(response),
                    err => listener.error(err),
                    () => listener.complete()
                );
        });
    }

    public getResourcesByGroup(userGroup: UserGroup): Observable<Resource[]> {
        return Observable.create(listener => {
            this.apiService.get("userGroups/" + userGroup.id + "/resources")
                .subscribe(
                    response => listener.next(response),
                    err => listener.error(err),
                    () => listener.complete()
                );
        });
    }

    public getUserGroupHierarchyDown(userGroup: UserGroup): Observable<UserGroup[]> {
        return Observable.create(listener => {
            this.apiService.get("userGroups/hierarchyDown/" + userGroup.id).subscribe(
                response => listener.next(response),
                err => listener.error(err),
                () => listener.complete()
            );
        });
    }

    public getUserGroupHierarchyUp(userGroup: UserGroup): Observable<UserGroup[]> {
        return Observable.create(listener => {
            this.apiService.get("/userGroups/hierarchyUp/" + userGroup.id).subscribe(
                response => listener.next(response),
                err => listener.error(err),
                () => listener.complete()
            );
        });
    }

    /**
     * Adds a new User Group with the details provided in the provided UserGroup object.
     * @param userGroup The UserGroup containing the details of the new Group. ID is not required.
     * @returns The new UserGroup if it was created successfully, undefined otherwise.
     */
    public addNewUserGroup(userGroup: UserGroup): Observable<UserGroup> {
        return Observable.create(listener => {
            if (!userGroup)
                listener.next(false);
            else {
                this.apiService.post("userGroups", userGroup).subscribe(
                    response => listener.next(response),
                    err => listener.error(err),
                    () => listener.complete()
                );
            }
        });
    }

    public patchUserGroup(userGroup: UserGroup): Observable<void> {
        return Observable.create(listener => {
            if (!userGroup)
                listener.error("User group was null.");
            else {
                this.apiService.patch("userGroups/" + userGroup.id, userGroup).subscribe(
                    response => listener.next(),
                    err => listener.error(err),
                    () => listener.complete()
                );
            }
        });
    }

    public moveUserGroup(userGroup: UserGroup, newParentUserGroup: UserGroup): Observable<void> {
        return Observable.create(listener => {
            this.apiService.patch("userGroups/" + userGroup.id + "/move?newParentId=" + newParentUserGroup.id).subscribe(
                response => listener.next(),
                err => listener.error(err),
                () => listener.complete()
            )
        });
    }

    public deleteUserGroup(userGroup: UserGroup): Observable<void> {
        return Observable.create(listener => {
            this.apiService.del("userGroups/" + userGroup.id)
                .subscribe(
                    response => listener.next(),
                    err => listener.error(err),
                    () => listener.complete()
                )
        });
    }

}