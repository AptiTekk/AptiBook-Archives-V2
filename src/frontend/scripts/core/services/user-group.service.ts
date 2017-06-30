/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {
    UserGroup,
    UserGroupHierarchy,
    UserGroupHierarchyDown,
    UserGroupHierarchyUp
} from "../../models/user-group.model";
import {User} from "../../models/user.model";
import {Resource} from "../../models/resource.model";
import Queue from "typescript-collections/dist/lib/Queue";
import {ReplaySubject} from "rxjs/ReplaySubject";

@Injectable()
export class UserGroupService {

    /**
     * Emits the User Group hierarchy tree.
     */
    private rootUserGroup = new ReplaySubject<UserGroupHierarchy>();

    constructor(private apiService: APIService) {
    }

    /**
     * @returns A replay subject with all the User Groups in the form of a tree.
     */
    public getRootUserGroupHierarchy(): ReplaySubject<UserGroupHierarchy> {
        return this.rootUserGroup;
    }

    /**
     * Loads all User Groups in the form of a tree, starting with the root User Group.
     * Stores the User Groups in the rootUserGroup ReplaySubject.
     *
     * Since the API only gives each group's children, and does not assign the parent (due to JSON circular references),
     * this method will also assign the parent to each child. This way, the tree can be traversed in either direction.
     *
     * @returns A Promise that gives the entire User Group hierarchy.
     */
    public loadRootUserGroupHierarchy(): void {
        this.apiService.get("userGroups")
            .then((userGroups: UserGroupHierarchy) => {
                // Traverse through each User Group and their children, and assign the parent to each child.
                let userGroupQueue = new Queue<UserGroupHierarchy>();
                userGroupQueue.add(userGroups);

                let currentUserGroup: UserGroupHierarchy;

                while ((currentUserGroup = userGroupQueue.dequeue()) != null) {
                    for (let childGroup of currentUserGroup.children) {
                        childGroup.parent = currentUserGroup;
                    }
                }

                this.rootUserGroup.next(userGroups);
            })
    }

    /**
     * TODO: JAVADOCS
     * @param id
     * @returns {any}
     */
    public getUserGroupById(id: number): Promise<UserGroup> {
        return this.apiService.get("userGroups/" + id);
    }

    /**
     * TODO: JAVADOCS
     * @param userGroup
     * @returns {any}
     */
    public getUsersByGroup(userGroup: UserGroup): Promise<User[]> {
        return this.apiService.get("userGroups/" + userGroup.id + "/users");
    }

    /**
     * TODO: JAVADOCS
     * @param userGroup
     * @returns {Promise<T>}
     */
    public getResourcesByGroup(userGroup: UserGroup): Promise<Resource[]> {
        return this.apiService.get("userGroups/" + userGroup.id + "/resources");
    }

    /**
     * Gets the upward hierarchy in relation to a User Group.
     * (The group's parent, their parent, their parent, ... etc)
     *
     * @param userGroup The origin User Group.
     * @returns A Promise that gives the same User Group as was passed in, with an upward hierarchy.
     */
    public getUserGroupHierarchyUp(userGroup: UserGroup): Promise<UserGroupHierarchyUp> {
        return this.apiService.get(`/userGroups/${userGroup.id}/hierarchy/up`);
    }

    /**
     * Gets the downward hierarchy in relation to a User Group.
     * (The group's children, their children, their children, ... etc)
     *
     * @param userGroup The origin User Group.
     * @returns A Promise that gives the same User Group as was passed in, with a downward hierarchy.
     */
    public getUserGroupHierarchyDown(userGroup: UserGroup): Promise<UserGroupHierarchyDown> {
        return this.apiService.get(`/userGroups/${userGroup.id}/hierarchy/down`);
    }

    /**
     * Flattens a User Group hierarchy tree into an array of all children in the downward hierarchy.
     * The array begins with the origin, then includes all children as encountered, with no guaranteed order.
     *
     * @param origin The User Group from which to flatten the downward hierarchy.
     */
    public static flattenHierarchyDown(origin: UserGroupHierarchyDown): UserGroup[] {
        let flattenedUserGroups: UserGroup[] = [];

        // Create a queue for traversal.
        let queue = new Queue<UserGroupHierarchyDown>();
        queue.add(origin);

        // Traverse through all children.
        let currentUserGroup: UserGroupHierarchyDown;
        while ((currentUserGroup = queue.dequeue()) != null) {
            // Add this group to the array.
            flattenedUserGroups.push({
                id: currentUserGroup.id,
                root: currentUserGroup.root,
                name: currentUserGroup.name
            });

            // Add all the group's children into the queue.
            for (let childGroup of currentUserGroup.children) {
                queue.add(childGroup);
            }
        }

        return flattenedUserGroups;
    }

    /**
     * Adds a new User Group with the details provided in the provided UserGroup object.
     * @param parent The Parent User Group of the new User Group.
     * @param userGroup The new User Group. Should contain the name.
     * @returns A Promise that gives the newly created User Group.
     */
    public addNewUserGroup(parent: UserGroup, userGroup: UserGroup): Promise<UserGroup> {
        return this.apiService.post(`userGroups/${parent.id}/children`, userGroup)
            .then(userGroup => {
                this.loadRootUserGroupHierarchy();
                return userGroup;
            })
    }

    /**
     * TODO: JAVADOCS
     * @param userGroup
     * @returns {Promise<T>}
     */
    public patchUserGroup(userGroup: UserGroup): Promise<UserGroup> {
        return this.apiService.patch("userGroups/" + userGroup.id, userGroup)
            .then(userGroup => {
                this.loadRootUserGroupHierarchy();
                return userGroup;
            })
    }

    /**
     * TODO: JAVADOCS
     * @param userGroup
     * @param newParentUserGroup
     * @returns {Promise<T>}
     */
    public moveUserGroup(userGroup: UserGroup, newParentUserGroup: UserGroup): Promise<UserGroup> {
        return this.apiService.patch("userGroups/" + userGroup.id + "/move?newParentId=" + newParentUserGroup.id)
            .then(userGroup => {
                this.loadRootUserGroupHierarchy();
                return userGroup;
            })
    }

    /**
     * TODO: JAVADOCS
     * @param userGroup
     * @returns {Promise<T>}
     */
    public deleteUserGroup(userGroup: UserGroup): Promise<any> {
        return this.apiService.del("userGroups/" + userGroup.id)
            .then(userGroup => {
                this.loadRootUserGroupHierarchy();
                return userGroup;
            })
    }

}