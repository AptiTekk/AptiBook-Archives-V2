/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {UserGroup} from "../../../../../models/user-group.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserGroupService} from "../../../../../services/singleton/usergroup.service";
import {User} from "../../../../../models/user.model";
import {AlertComponent} from "../../../../../components/alert/alert.component";
import {UserService} from "../../../../../services/singleton/user.service";
import {TreeComponent} from "../../../../../components/tree/tree.component";
import {Observable} from "rxjs";
import {Resource} from "../../../../../models/resource.model";

@Component({
    selector: 'groups-section',
    templateUrl: 'groups-section.component.html',
    styleUrls: ['groups-section.component.css']
})
export class GroupsSectionComponent implements OnInit {

    @ViewChild(TreeComponent) private tree: TreeComponent;
    protected rootGroup: UserGroup;

    protected selectedUserGroups: UserGroup[];
    protected selectedUserGroup: UserGroup;

    @ViewChild('detailsInfoAlert') private detailsInfoAlert: AlertComponent;
    @ViewChild('detailsDangerAlert') private detailsDangerAlert: AlertComponent;
    protected userGroupDetailsFormGroup: FormGroup;
    protected editingDetails: boolean;

    protected showAssignedUsers: boolean = true;

    constructor(private formBuilder: FormBuilder,
                private userGroupService: UserGroupService,
                private userService: UserService) {
    }

    ngOnInit(): void {
        this.userGroupDetailsFormGroup = this.formBuilder.group({
            name: [null, Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern("[^<>;=]*")])]
        });

        this.userGroupService.getRootUserGroup().subscribe(group => this.rootGroup = group);
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

    onAddNewUserGroup(newGroup: UserGroup) {
        this.userGroupService.fetchRootUserGroup();

        // Select the new group.
        this.tree.selectUserGroup(newGroup);
    }

    onUserGroupSelected() {
        this.editingDetails = false;

        if (this.selectedUserGroups)
            if (this.selectedUserGroups.length > 0) {

                Observable.forkJoin(this.userGroupService.getUsersByGroup(this.selectedUserGroups[0]),
                    this.userGroupService.getResourcesByGroup(this.selectedUserGroups[0]))
                    .subscribe(
                        response => {
                            this.selectedUserGroup = this.selectedUserGroups[0];

                            // Users
                            this.selectedUserGroup.users = response[0];

                            // Resources
                            this.selectedUserGroup.resources = response[1];

                            // Form Reset
                            this.userGroupDetailsFormGroup.reset();
                            this.userGroupDetailsFormGroup.controls['name'].setValue(this.selectedUserGroup.name)
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
            .subscribe(() => {
                    this.detailsInfoAlert.display("Details Updated.");
                    this.userGroupService.fetchRootUserGroup();
                    this.onUserGroupSelected();
                },
                err => {
                    this.detailsDangerAlert.display(err);
                    this.onUserGroupSelected();
                }
            );
    }

    onCancelUserGroupDetails() {
        this.onUserGroupSelected();
    }

    onUserSelected(user: User) {
        //TODO Called when a user is selected in the user group's assigned users table
    }

    onUserDeselected() {
        //TODO Called when a user is deselected from the user group's assigned users table.
    }

    onResourceSelected(resource: Resource) {
        //TODO Called when a resource is selected in the user group's assigned resources table
    }

    onResourceDeselected() {
        //TODO Called when a resource is deselected from the user group's assigned resources table.
    }

    onDeleteUserGroup() {
        this.userGroupService
            .deleteUserGroup(this.selectedUserGroup)
            .subscribe(
                response => {
                    this.selectedUserGroups = [];
                    this.userGroupService.fetchRootUserGroup();
                    this.userService.fetchUsers();
                    this.onUserGroupSelected();
                }
            )

    }

    setShowAssignedUsers(show: boolean) {
        this.showAssignedUsers = show;
    }

}

