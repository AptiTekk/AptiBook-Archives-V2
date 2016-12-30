/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, OnInit} from "@angular/core";
import {User} from "../../../../../models/user.model";
import {UserService} from "../../../../../services/singleton/user.service";

@Component({
    selector: 'all-users-section',
    templateUrl: 'all-users-section.component.html',
    styleUrls: ['all-users-section.component.css']
})
export class AllUsersSectionComponent implements OnInit {

    protected users: User[];
    protected selectedUser: User;

    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
        this.userService
            .getUsers()
            .subscribe(users => this.users = users.filter(user => !user.admin));
    }

    //noinspection JSMethodCanBeStatic
    /**
     * Returns an array containing only the names of the user's UserGroups
     * @param user The User
     */
    protected getUserGroupsNames(user: User): string[] {
        return user.userGroups.map(userGroup => {
            return userGroup.name
        });
    }

    protected onAddNewUser() {
        this.userService.fetchUsers();
    }

    protected onUserSelected(user: User) {
        this.selectedUser = user;
    }

    protected onUserDeselected(user: User) {
        this.selectedUser = null;
    }

}

