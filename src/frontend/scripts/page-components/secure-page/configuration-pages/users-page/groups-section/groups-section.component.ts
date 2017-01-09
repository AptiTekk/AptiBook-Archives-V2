/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {UserGroup} from "../../../../../models/user-group.model";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {UserGroupService} from "../../../../../services/singleton/usergroup.service";
import {User} from "../../../../../models/user.model";
import {AlertComponent} from "../../../../../components/alert/alert.component";
import {UserService} from "../../../../../services/singleton/user.service";

@Component({
    selector: 'groups-section',
    templateUrl: 'groups-section.component.html',
    styleUrls: ['groups-section.component.css']
})
export class GroupsSectionComponent implements OnInit {

    protected selectedUserGroups: UserGroup[];
    protected selectedUserGroup: UserGroup;

    @ViewChild('detailsInfoAlert') private detailsInfoAlert: AlertComponent;
    @ViewChild('detailsDangerAlert') private detailsDangerAlert: AlertComponent;
    protected userGroupDetailsFormGroup: FormGroup;
    protected editingDetails: boolean;

    constructor(private formBuilder: FormBuilder,
                private userGroupService: UserGroupService,
                private userService: UserService) {
    }

    ngOnInit(): void {
        this.userGroupDetailsFormGroup = this.formBuilder.group({
            name: [null, Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern("[^<>;=]*")])]
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

    onUserGroupSelected() {
        this.editingDetails = false;

        if (this.selectedUserGroups)
            if (this.selectedUserGroups.length > 0) {
                this.userGroupService
                    .getUsersByGroup(this.selectedUserGroups[0])
                    .subscribe(users => {
                        if (users) {
                            this.selectedUserGroup = this.selectedUserGroups[0];
                            this.selectedUserGroup.users = users;
                            this.userGroupDetailsFormGroup.reset();
                            this.userGroupDetailsFormGroup.controls['name'].setValue(this.selectedUserGroup.name)
                        }
                    });
                return;
            }

        this.userGroupDetailsFormGroup.reset();
        this.selectedUserGroup = null;
    }

    onEditUserGroupDetails() {
        this.editingDetails = true;
    }

    onSaveUserGroupDetails() {
        this.editingDetails = false;
        this.selectedUserGroup.name = this.userGroupDetailsFormGroup.controls['name'].value;
        this.userGroupService
            .patchUserGroup(this.selectedUserGroup)
            .subscribe(success => {
                if (success)
                    this.detailsInfoAlert.display("Details Updated.");
                else
                    this.detailsDangerAlert.display("Could not update Details due to an Internal Server Error.");
                this.userGroupService.fetchRootUserGroup();
                this.onUserGroupSelected();
            });
    }

    onCancelUserGroupDetails() {
        this.onUserGroupSelected();
    }

    onDeleteUserGroup() {
        this.userGroupService
            .deleteUserGroup(this.selectedUserGroup)
            .subscribe(
                success => {
                    if (success) {
                        this.selectedUserGroups = [];
                        this.userGroupService.fetchRootUserGroup();
                        this.userService.fetchUsers();
                        this.onUserGroupSelected();
                    }
                }
            )

    }

}

