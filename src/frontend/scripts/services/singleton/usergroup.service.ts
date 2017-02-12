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

@Injectable()
export class UserGroupService {

    private rootUserGroup: ReplaySubject<UserGroup> = new ReplaySubject<UserGroup>(1);

    constructor(private apiService: APIService) {
        this.fetchRootUserGroup();
    }

    public fetchRootUserGroup(): void {
        this.apiService.get("userGroups").subscribe(
            response => this.rootUserGroup.next(<UserGroup>response),
            err => this.rootUserGroup.next(undefined)
        )
    }

    public getRootUserGroup(): ReplaySubject<UserGroup> {
        return this.rootUserGroup;
    }

    public getUserGroupById(id: number): Observable<UserGroup> {
        return Observable.create(listener => {
            if (!id)
                listener.next(null);
            else
                this.apiService.get("userGroups/" + id)
                    .subscribe(
                        response => listener.next(response),
                        err => listener.next(null)
                    );
        });
    }

    public getUsersByGroup(userGroup: UserGroup): Observable<User[]> {
        return Observable.create(listener => {
            if (!userGroup)
                listener.next(null);
            else
                this.apiService.get("userGroups/" + userGroup.id + "/users")
                    .subscribe(
                        response => listener.next(response),
                        err => listener.next(null)
                    );
        });
    }

    public getUserGroupHierarchyDown(userGroup: UserGroup): Observable<UserGroup[]> {
        return Observable.create(listener => {
            this.apiService.get("userGroups/hierarchyDown/" + userGroup.id).subscribe(
                response => listener.next(response),
                err => listener.next([])
            );
        });
    }

    public getUserGroupHierarchyUp(userGroup: UserGroup): Observable<UserGroup[]> {
        return Observable.create(listener => {
            this.apiService.get("/userGroups/hierarchyUp/" + userGroup.id).subscribe(
                response => listener.next(response),
                err => listener.next([])
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
                    err => listener.next(undefined));
            }
        });
    }

    public patchUserGroup(userGroup: UserGroup): Observable<boolean> {
        return Observable.create(listener => {
            if (!userGroup)
                listener.next(false);
            else {
                this.apiService.patch("userGroups/" + userGroup.id, userGroup).subscribe(
                    response => listener.next(true),
                    err => listener.next(false));
            }
        });
    }

    public moveUserGroup(userGroup: UserGroup, newParentUserGroup: UserGroup): Observable<boolean> {
        return Observable.create(listener => {
            if (!userGroup || !newParentUserGroup)
                listener.next(false);
            else if (userGroup.id === newParentUserGroup.id)
                listener.next(false);
            else {
                this.apiService.patch("userGroups/" + userGroup.id + "/move?newParentId=" + newParentUserGroup.id).subscribe(
                    response => listener.next(true),
                    err => listener.next(false)
                )
            }
        });
    }

    public deleteUserGroup(userGroup: UserGroup): Observable<boolean> {
        return Observable.create(listener => {
            if (!userGroup)
                listener.next(false);
            else
                this.apiService.del("userGroups/" + userGroup.id)
                    .subscribe(
                        response => listener.next(true),
                        err => listener.next(false)
                    )
        });
    }

}