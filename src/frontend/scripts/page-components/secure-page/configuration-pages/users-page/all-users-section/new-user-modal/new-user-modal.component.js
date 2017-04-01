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
var modal_component_1 = require("../../../../../../components/modal/modal.component");
var loader_service_1 = require("../../../../../../services/singleton/loader.service");
var uniqueness_validator_1 = require("../../../../../../validators/uniqueness.validator");
var user_service_1 = require("../../../../../../services/singleton/user.service");
var alert_component_1 = require("../../../../../../components/alert/alert.component");
var NewUserModalComponent = (function () {
    function NewUserModalComponent(formBuilder, userService, loaderService) {
        this.formBuilder = formBuilder;
        this.userService = userService;
        this.loaderService = loaderService;
        this.submitted = new core_1.EventEmitter();
    }
    NewUserModalComponent.prototype.ngOnInit = function () {
        this.formGroup = this.formBuilder.group({
            emailAddress: null,
            firstName: null,
            lastName: null,
            phoneNumber: null,
            location: null,
            userGroups: []
        });
    };
    /**
     * Opens the modal.
     */
    NewUserModalComponent.prototype.open = function () {
        this.resetFormGroup();
        this.modal.openModal();
    };
    NewUserModalComponent.prototype.resetFormGroup = function () {
        var _this = this;
        this.userService
            .getUsers()
            .take(1)
            .subscribe(function (users) {
            var takenEmailAddresses = users.map(function (user) { return user.emailAddress; });
            _this.formGroup = _this.formBuilder.group({
                emailAddress: [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.maxLength(100), forms_1.Validators.pattern("[^<>;=]*"), uniqueness_validator_1.UniquenessValidator.isUnique(takenEmailAddresses)])],
                firstName: [null, forms_1.Validators.compose([forms_1.Validators.maxLength(30), forms_1.Validators.pattern("[^<>;=]*")])],
                lastName: [null, forms_1.Validators.compose([forms_1.Validators.maxLength(30), forms_1.Validators.pattern("[^<>;=]*")])],
                phoneNumber: [null, forms_1.Validators.compose([forms_1.Validators.maxLength(30), forms_1.Validators.pattern("[^<>;=]*")])],
                location: [null, forms_1.Validators.compose([forms_1.Validators.maxLength(250), forms_1.Validators.pattern("[^<>;=]*")])],
                userGroups: [[]]
            });
        });
    };
    NewUserModalComponent.prototype.onUserSubmitted = function () {
        var _this = this;
        this.loaderService.startLoading();
        var newUser = {
            emailAddress: this.formGroup.controls['emailAddress'].value,
            firstName: this.formGroup.controls['firstName'].value,
            lastName: this.formGroup.controls['lastName'].value,
            phoneNumber: this.formGroup.controls['phoneNumber'].value,
            location: this.formGroup.controls['location'].value,
            userGroups: [].concat(this.formGroup.controls['userGroups'].value)
        };
        this.userService
            .addNewUser(newUser)
            .subscribe(function (user) {
            if (user) {
                _this.submitted.next(user);
                _this.modal.closeModal();
            }
            _this.loaderService.stopLoading();
        }, function (err) {
            _this.dangerAlert.display(err);
            _this.loaderService.stopLoading();
        });
    };
    return NewUserModalComponent;
}());
__decorate([
    core_1.ViewChild('modal'),
    __metadata("design:type", modal_component_1.ModalComponent)
], NewUserModalComponent.prototype, "modal", void 0);
__decorate([
    core_1.ViewChild('dangerAlert'),
    __metadata("design:type", alert_component_1.AlertComponent)
], NewUserModalComponent.prototype, "dangerAlert", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], NewUserModalComponent.prototype, "submitted", void 0);
NewUserModalComponent = __decorate([
    core_1.Component({
        selector: 'new-user-modal',
        templateUrl: 'new-user-modal.component.html'
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        user_service_1.UserService,
        loader_service_1.LoaderService])
], NewUserModalComponent);
exports.NewUserModalComponent = NewUserModalComponent;
//# sourceMappingURL=new-user-modal.component.js.map