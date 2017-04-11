/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {User} from "../../../../../models/user.model";
import {UserService} from "../../../../../core/services/user.service";
import {AuthService} from "../../../../../core/services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DataTableComponent} from "../../../../../shared/datatable/datatable.component";

@Component({
    selector: 'at-configuration-users-all-users',
    templateUrl: 'all-users.component.html',
    styleUrls: ['all-users.component.css']
})
export class AllUsersComponent implements AfterViewInit {

    @ViewChild(DataTableComponent) dataTable: DataTableComponent;

    /**
     * All of the users, except admin.
     */
    users: User[];

    /**
     * The user selected from the table.
     */
    selectedUser: User;

    /**
     * The selected user's personal information form group.
     */
    selectedUserPersonalInformation: FormGroup;

    /**
     * Whether or not the selected user is being edited.
     */
    editingSelectedUser: boolean;

    /**
     * The currently signed in user
     */
    currentUser: User;

    constructor(private authService: AuthService,
                private formBuilder: FormBuilder,
                private userService: UserService) {
    }

    ngOnInit(): void {
        this.userService
            .getUsers()
            .subscribe(users => {
                this.users = users.filter(user => !user.admin);
                if (this.selectedUser) {
                    this.selectRowByUser(this.selectedUser);
                    this.editingSelectedUser = false;
                }
            });

        this.authService.reloadUser();
        this.authService.getUser().take(1).subscribe(user => {
            this.currentUser = user;
        });

        this.selectedUserPersonalInformation = this.formBuilder.group({
            emailAddress: null,
            firstName: null,
            lastName: null,
            phoneNumber: null,
            location: null,
            userGroups: null
        });
    }

    ngAfterViewInit(): void {
        // Fetch the Users.
        this.userService.fetchUsers();
    }

    private selectRowByUser(user: User) {
        let groupIndex = -1;
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].id === user.id) {
                groupIndex = i;
                break;
            }
        }

        if (groupIndex > -1)
            this.dataTable.selectRow(groupIndex);
    }

    //noinspection JSMethodCanBeStatic
    /**
     * Returns an array containing only the names of the user's UserGroups
     * @param user The User
     */
    getUserGroupsNames(user: User): string[] {
        return user.userGroups.map(userGroup => {
            return userGroup.name
        });
    }

    isSelectedUserCurrentUser(): boolean {
        if (this.currentUser && this.selectedUser)
            if (this.currentUser.id === this.selectedUser.id)
                return true;

        return false;
    }

    onAddNewUser() {
        this.userService.fetchUsers();
    }

    onDeleteSelectedUser() {
        this.userService
            .deleteUser(this.selectedUser)
            .subscribe(
                success => {
                    this.dataTable.deselectRows();
                    this.userService.fetchUsers()
                }
            );
    }

    onUserSelected(user: User) {
        this.selectedUser = user;

        this.selectedUserPersonalInformation = this.formBuilder.group({
            emailAddress: [this.selectedUser.emailAddress, Validators.compose([Validators.maxLength(100)])],
            firstName: [this.selectedUser.firstName, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
            lastName: [this.selectedUser.lastName, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
            phoneNumber: [this.selectedUser.phoneNumber, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
            location: [this.selectedUser.location, Validators.compose([Validators.maxLength(250), Validators.pattern("[^<>;=]*")])],
            userGroups: [this.selectedUser.userGroups]
        });

        this.editingSelectedUser = false;
    }

    onUserDeselected() {
        this.selectedUser = null;
        if (this.selectedUserPersonalInformation)
            this.selectedUserPersonalInformation.reset();
        this.editingSelectedUser = false;
    }

    onStartEditingUser() {
        this.editingSelectedUser = true;
    }

    onSaveUserChanges() {
        this.selectedUser.emailAddress = this.selectedUserPersonalInformation.controls['emailAddress'].value;
        this.selectedUser.firstName = this.selectedUserPersonalInformation.controls['firstName'].value;
        this.selectedUser.lastName = this.selectedUserPersonalInformation.controls['lastName'].value;
        this.selectedUser.phoneNumber = this.selectedUserPersonalInformation.controls['phoneNumber'].value;
        this.selectedUser.location = this.selectedUserPersonalInformation.controls['location'].value;
        this.selectedUser.userGroups = [].concat(this.selectedUserPersonalInformation.controls['userGroups'].value);

        this.userService
            .patchUser(this.selectedUser)
            .subscribe(user => {
                this.selectedUser = user;
                this.userService.fetchUsers();
            });
    }

    onCancelEditingUser() {
        this.onUserSelected(this.selectedUser);
    }

}

