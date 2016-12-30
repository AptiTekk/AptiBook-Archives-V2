/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, OnInit} from "@angular/core";
import {User} from "../../../../../models/user.model";
import {UserService} from "../../../../../services/singleton/user.service";
import {AuthService} from "../../../../../services/singleton/auth.service";

@Component({
    selector: 'all-users-section',
    templateUrl: 'all-users-section.component.html',
    styleUrls: ['all-users-section.component.css']
})
export class AllUsersSectionComponent implements OnInit {

    /**
     * All of the users, except admin.
     */
    protected users: User[];

    /**
     * The user selected from the table.
     */
    protected selectedUser: User;

    /**
     * The currently signed in user
     */
    protected currentUser: User;

    constructor(private userService: UserService,
                private authService: AuthService) {
    }

    ngOnInit(): void {
        this.userService
            .getUsers()
            .subscribe(users => {
                this.users = users.filter(user => !user.admin);
                this.selectedUser = null;
            });

        this.authService
            .getUser()
            .subscribe(
                user => this.currentUser = user
            );
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

    protected isSelectedUserCurrentUser(): boolean {
        if (this.currentUser && this.selectedUser)
            if (this.currentUser.id === this.selectedUser.id)
                return true;

        return false;
    }

    protected onAddNewUser() {
        this.userService.fetchUsers();
    }

    protected onDeleteSelectedUser() {
        this.userService
            .deleteUser(this.selectedUser)
            .subscribe(
                success => this.userService.fetchUsers()
            );
    }

    protected onUserSelected(user: User) {
        this.selectedUser = user;
    }

    protected onUserDeselected(user: User) {
        this.selectedUser = null;
    }

}

