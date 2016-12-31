/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, OnInit} from "@angular/core";
import {User} from "../../../../../models/user.model";
import {UserService} from "../../../../../services/singleton/user.service";
import {AuthService} from "../../../../../services/singleton/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserGroup} from "../../../../../models/user-group.model";

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
     * The selected user's personal information form group.
     */
    protected selectedUserPersonalInformation: FormGroup;

    /**
     * Whether or not the selected user is being edited.
     */
    protected editingSelectedUser: boolean;

    /**
     * The currently signed in user
     */
    protected currentUser: User;

    /**
     * Root User Group
     */
    protected rootUserGroup: UserGroup;

    constructor(private authService: AuthService,
                private formBuilder: FormBuilder,
                private userService: UserService) {
    }

    ngOnInit(): void {
        this.userService
            .getUsers()
            .subscribe(users => {
                this.users = users.filter(user => !user.admin);
                this.onUserDeselected();
            });

        this.authService.reloadUser();
        this.authService.getUser().take(1).subscribe(user => {
            this.currentUser = user;
        });
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

        this.selectedUserPersonalInformation = this.formBuilder.group({
            emailAddress: [this.selectedUser.emailAddress, Validators.compose([Validators.maxLength(100)])],
            firstName: [this.selectedUser.firstName, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
            lastName: [this.selectedUser.lastName, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
            phoneNumber: [this.selectedUser.phoneNumber, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
            location: [this.selectedUser.location, Validators.compose([Validators.maxLength(250), Validators.pattern("[^<>;=]*")])]
        });

        this.editingSelectedUser = false;
    }

    protected onUserDeselected() {
        this.selectedUser = null;
        this.selectedUserPersonalInformation = null;
        this.editingSelectedUser = false;
    }

    protected onStartEditingUser() {
        this.editingSelectedUser = true;
    }

    protected onSaveUserChanges() {

    }

    protected onCancelEditingUser() {
        this.onUserSelected(this.selectedUser);
    }

}

