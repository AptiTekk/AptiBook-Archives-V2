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
var user_service_1 = require("../../../../../services/singleton/user.service");
var auth_service_1 = require("../../../../../services/singleton/auth.service");
var forms_1 = require("@angular/forms");
var datatable_component_1 = require("../../../../../components/datatable/datatable.component");
var AllUsersSectionComponent = (function () {
    function AllUsersSectionComponent(authService, formBuilder, userService) {
        this.authService = authService;
        this.formBuilder = formBuilder;
        this.userService = userService;
    }
    AllUsersSectionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userService
            .getUsers()
            .subscribe(function (users) {
            _this.users = users.filter(function (user) { return !user.admin; });
            if (_this.selectedUser) {
                _this.selectRowByUser(_this.selectedUser);
                _this.editingSelectedUser = false;
            }
        });
        this.authService.reloadUser();
        this.authService.getUser().take(1).subscribe(function (user) {
            _this.currentUser = user;
        });
        this.selectedUserPersonalInformation = this.formBuilder.group({
            emailAddress: null,
            firstName: null,
            lastName: null,
            phoneNumber: null,
            location: null,
            userGroups: null
        });
    };
    AllUsersSectionComponent.prototype.selectRowByUser = function (user) {
        var groupIndex = -1;
        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].id === user.id) {
                groupIndex = i;
                break;
            }
        }
        if (groupIndex > -1)
            this.dataTable.selectRow(groupIndex);
    };
    //noinspection JSMethodCanBeStatic
    /**
     * Returns an array containing only the names of the user's UserGroups
     * @param user The User
     */
    AllUsersSectionComponent.prototype.getUserGroupsNames = function (user) {
        return user.userGroups.map(function (userGroup) {
            return userGroup.name;
        });
    };
    AllUsersSectionComponent.prototype.isSelectedUserCurrentUser = function () {
        if (this.currentUser && this.selectedUser)
            if (this.currentUser.id === this.selectedUser.id)
                return true;
        return false;
    };
    AllUsersSectionComponent.prototype.onAddNewUser = function () {
        this.userService.fetchUsers();
    };
    AllUsersSectionComponent.prototype.onDeleteSelectedUser = function () {
        var _this = this;
        this.userService
            .deleteUser(this.selectedUser)
            .subscribe(function (success) {
            _this.dataTable.deselectRows();
            _this.userService.fetchUsers();
        });
    };
    AllUsersSectionComponent.prototype.onUserSelected = function (user) {
        this.selectedUser = user;
        this.selectedUserPersonalInformation = this.formBuilder.group({
            emailAddress: [this.selectedUser.emailAddress, forms_1.Validators.compose([forms_1.Validators.maxLength(100)])],
            firstName: [this.selectedUser.firstName, forms_1.Validators.compose([forms_1.Validators.maxLength(30), forms_1.Validators.pattern("[^<>;=]*")])],
            lastName: [this.selectedUser.lastName, forms_1.Validators.compose([forms_1.Validators.maxLength(30), forms_1.Validators.pattern("[^<>;=]*")])],
            phoneNumber: [this.selectedUser.phoneNumber, forms_1.Validators.compose([forms_1.Validators.maxLength(30), forms_1.Validators.pattern("[^<>;=]*")])],
            location: [this.selectedUser.location, forms_1.Validators.compose([forms_1.Validators.maxLength(250), forms_1.Validators.pattern("[^<>;=]*")])],
            userGroups: [this.selectedUser.userGroups]
        });
        this.editingSelectedUser = false;
    };
    AllUsersSectionComponent.prototype.onUserDeselected = function () {
        this.selectedUser = null;
        if (this.selectedUserPersonalInformation)
            this.selectedUserPersonalInformation.reset();
        this.editingSelectedUser = false;
    };
    AllUsersSectionComponent.prototype.onStartEditingUser = function () {
        this.editingSelectedUser = true;
    };
    AllUsersSectionComponent.prototype.onSaveUserChanges = function () {
        var _this = this;
        this.selectedUser.emailAddress = this.selectedUserPersonalInformation.controls['emailAddress'].value;
        this.selectedUser.firstName = this.selectedUserPersonalInformation.controls['firstName'].value;
        this.selectedUser.lastName = this.selectedUserPersonalInformation.controls['lastName'].value;
        this.selectedUser.phoneNumber = this.selectedUserPersonalInformation.controls['phoneNumber'].value;
        this.selectedUser.location = this.selectedUserPersonalInformation.controls['location'].value;
        this.selectedUser.userGroups = [].concat(this.selectedUserPersonalInformation.controls['userGroups'].value);
        this.userService
            .patchUser(this.selectedUser)
            .subscribe(function (user) {
            _this.selectedUser = user;
            _this.userService.fetchUsers();
        });
    };
    AllUsersSectionComponent.prototype.onCancelEditingUser = function () {
        this.onUserSelected(this.selectedUser);
    };
    return AllUsersSectionComponent;
}());
__decorate([
    core_1.ViewChild(datatable_component_1.DataTableComponent),
    __metadata("design:type", datatable_component_1.DataTableComponent)
], AllUsersSectionComponent.prototype, "dataTable", void 0);
AllUsersSectionComponent = __decorate([
    core_1.Component({
        selector: 'all-users-section',
        templateUrl: 'all-users-section.component.html',
        styleUrls: ['all-users-section.component.css']
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        forms_1.FormBuilder,
        user_service_1.UserService])
], AllUsersSectionComponent);
exports.AllUsersSectionComponent = AllUsersSectionComponent;
//# sourceMappingURL=all-users-section.component.js.map