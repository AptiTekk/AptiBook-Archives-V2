"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var usergroup_service_1 = require("../../../../../services/singleton/usergroup.service");
var alert_component_1 = require("../../../../../components/alert/alert.component");
var user_service_1 = require("../../../../../services/singleton/user.service");
var tree_component_1 = require("../../../../../components/tree/tree.component");
var rxjs_1 = require("rxjs");
var GroupsSectionComponent = (function () {
    function GroupsSectionComponent(formBuilder, userGroupService, userService) {
        this.formBuilder = formBuilder;
        this.userGroupService = userGroupService;
        this.userService = userService;
        this.showAssignedUsers = true;
    }
    GroupsSectionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userGroupDetailsFormGroup = this.formBuilder.group({
            name: [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.maxLength(30), forms_1.Validators.pattern("[^<>;=]*")])]
        });
        this.userGroupService.getRootUserGroup().subscribe(function (group) { return _this.rootGroup = group; });
    };
    //noinspection JSMethodCanBeStatic
    /**
     * Returns an array containing only the names of the user's UserGroups
     * @param user The User
     */
    GroupsSectionComponent.prototype.getUserGroupsNames = function (user) {
        return user.userGroups.map(function (userGroup) {
            return userGroup.name;
        });
    };
    GroupsSectionComponent.prototype.onAddNewUserGroup = function (newGroup) {
        this.userGroupService.fetchRootUserGroup();
        // Select the new group.
        this.tree.selectUserGroup(newGroup);
    };
    GroupsSectionComponent.prototype.onUserGroupSelected = function () {
        var _this = this;
        this.editingDetails = false;
        if (this.selectedUserGroups)
            if (this.selectedUserGroups.length > 0) {
                rxjs_1.Observable.forkJoin(this.userGroupService.getUsersByGroup(this.selectedUserGroups[0]), this.userGroupService.getResourcesByGroup(this.selectedUserGroups[0]))
                    .subscribe(function (response) {
                    _this.selectedUserGroup = _this.selectedUserGroups[0];
                    // Users
                    _this.selectedUserGroup.users = response[0];
                    // Resources
                    _this.selectedUserGroup.resources = response[1];
                    // Form Reset
                    _this.userGroupDetailsFormGroup.reset();
                    _this.userGroupDetailsFormGroup.controls['name'].setValue(_this.selectedUserGroup.name);
                });
                return;
            }
        this.userGroupDetailsFormGroup.reset();
        this.selectedUserGroup = null;
    };
    GroupsSectionComponent.prototype.onEditUserGroupDetails = function () {
        this.editingDetails = true;
    };
    GroupsSectionComponent.prototype.onSaveUserGroupDetails = function () {
        var _this = this;
        this.editingDetails = false;
        this.selectedUserGroup.name = this.userGroupDetailsFormGroup.controls['name'].value;
        this.userGroupService
            .patchUserGroup(this.selectedUserGroup)
            .subscribe(function () {
            _this.detailsInfoAlert.display("Details Updated.");
            _this.userGroupService.fetchRootUserGroup();
            _this.onUserGroupSelected();
        }, function (err) {
            _this.detailsDangerAlert.display(err);
            _this.onUserGroupSelected();
        });
    };
    GroupsSectionComponent.prototype.onCancelUserGroupDetails = function () {
        this.onUserGroupSelected();
    };
    GroupsSectionComponent.prototype.onUserSelected = function (user) {
        //TODO Called when a user is selected in the user group's assigned users table
    };
    GroupsSectionComponent.prototype.onUserDeselected = function () {
        //TODO Called when a user is deselected from the user group's assigned users table.
    };
    GroupsSectionComponent.prototype.onResourceSelected = function (resource) {
        //TODO Called when a resource is selected in the user group's assigned resources table
    };
    GroupsSectionComponent.prototype.onResourceDeselected = function () {
        //TODO Called when a resource is deselected from the user group's assigned resources table.
    };
    GroupsSectionComponent.prototype.onDeleteUserGroup = function () {
        var _this = this;
        this.userGroupService
            .deleteUserGroup(this.selectedUserGroup)
            .subscribe(function (response) {
            _this.selectedUserGroups = [];
            _this.userGroupService.fetchRootUserGroup();
            _this.userService.fetchUsers();
            _this.onUserGroupSelected();
        });
    };
    GroupsSectionComponent.prototype.setShowAssignedUsers = function (show) {
        this.showAssignedUsers = show;
    };
    return GroupsSectionComponent;
}());
__decorate([
    core_1.ViewChild(tree_component_1.TreeComponent),
    __metadata("design:type", tree_component_1.TreeComponent)
], GroupsSectionComponent.prototype, "tree", void 0);
__decorate([
    core_1.ViewChild('detailsInfoAlert'),
    __metadata("design:type", alert_component_1.AlertComponent)
], GroupsSectionComponent.prototype, "detailsInfoAlert", void 0);
__decorate([
    core_1.ViewChild('detailsDangerAlert'),
    __metadata("design:type", alert_component_1.AlertComponent)
], GroupsSectionComponent.prototype, "detailsDangerAlert", void 0);
GroupsSectionComponent = __decorate([
    core_1.Component({
        selector: 'groups-section',
        templateUrl: 'groups-section.component.html',
        styleUrls: ['groups-section.component.css']
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        usergroup_service_1.UserGroupService,
        user_service_1.UserService])
], GroupsSectionComponent);
exports.GroupsSectionComponent = GroupsSectionComponent;
//# sourceMappingURL=groups-section.component.js.map