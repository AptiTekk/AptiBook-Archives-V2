/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
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
var core_1 = require("@angular/core");
var auth_service_1 = require("../../../../services/singleton/auth.service");
var user_service_1 = require("../../../../services/singleton/user.service");
var alert_component_1 = require("../../../../components/alert/alert.component");
var forms_1 = require("@angular/forms");
var AccountPageComponent = (function () {
    function AccountPageComponent(authService, formBuilder, userService) {
        this.authService = authService;
        this.formBuilder = formBuilder;
        this.userService = userService;
    }
    AccountPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.authService.reloadUser();
        this.authService.getUser().take(1).subscribe(function (user) {
            _this.user = user;
            _this.personalInformation = _this.formBuilder.group({
                firstName: [_this.user.firstName, forms_1.Validators.compose([forms_1.Validators.maxLength(30), forms_1.Validators.pattern("[^<>;=]*")])],
                lastName: [_this.user.lastName, forms_1.Validators.compose([forms_1.Validators.maxLength(30), forms_1.Validators.pattern("[^<>;=]*")])],
                phoneNumber: [_this.user.phoneNumber, forms_1.Validators.compose([forms_1.Validators.maxLength(30), forms_1.Validators.pattern("[^<>;=]*")])],
                location: [_this.user.location, forms_1.Validators.compose([forms_1.Validators.maxLength(250), forms_1.Validators.pattern("[^<>;=]*")])],
                userGroups: _this.user.userGroups
            });
        });
    };
    AccountPageComponent.prototype.onPersonalInformationSubmit = function (changingPassword) {
        var _this = this;
        if (changingPassword === void 0) { changingPassword = false; }
        var updatedUser = jQuery.extend({}, {}, this.user);
        updatedUser.firstName = this.personalInformation.controls['firstName'].value;
        updatedUser.lastName = this.personalInformation.controls['lastName'].value;
        updatedUser.phoneNumber = this.personalInformation.controls['phoneNumber'].value;
        updatedUser.location = this.personalInformation.controls['location'].value;
        updatedUser.userGroups = null;
        this.userService.patchUser(updatedUser, changingPassword).take(1).subscribe(function (user) {
            _this.authService.reloadUser();
            if (!changingPassword)
                _this.personalInfoAlert.display("Personal Information updated successfully.");
            else
                _this.passwordsInfoAlert.display("Password updated successfully.");
        }, function (err) {
            _this.errorAlert.display(err);
        });
    };
    AccountPageComponent.prototype.onChangePasswordSubmit = function () {
        this.onPersonalInformationSubmit(true);
    };
    AccountPageComponent.prototype.doPasswordsMatch = function () {
        if (!this.user.newPassword)
            if (!this.user.confirmPassword)
                return true;
        return this.user.newPassword === this.user.confirmPassword;
    };
    return AccountPageComponent;
}());
__decorate([
    core_1.ViewChild('errorAlert'),
    __metadata("design:type", alert_component_1.AlertComponent)
], AccountPageComponent.prototype, "errorAlert", void 0);
__decorate([
    core_1.ViewChild('personalInfoAlert'),
    __metadata("design:type", alert_component_1.AlertComponent)
], AccountPageComponent.prototype, "personalInfoAlert", void 0);
__decorate([
    core_1.ViewChild('passwordsInfoAlert'),
    __metadata("design:type", alert_component_1.AlertComponent)
], AccountPageComponent.prototype, "passwordsInfoAlert", void 0);
AccountPageComponent = __decorate([
    core_1.Component({
        selector: 'my-account-page',
        templateUrl: 'account-page.component.html'
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        forms_1.FormBuilder,
        user_service_1.UserService])
], AccountPageComponent);
exports.AccountPageComponent = AccountPageComponent;
//# sourceMappingURL=account-page.component.js.map