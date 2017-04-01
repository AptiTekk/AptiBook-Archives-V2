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
var usergroup_service_1 = require("../../../../../../services/singleton/usergroup.service");
var NewGroupModalComponent = (function () {
    function NewGroupModalComponent(formBuilder, userGroupService, loaderService) {
        this.formBuilder = formBuilder;
        this.userGroupService = userGroupService;
        this.loaderService = loaderService;
        this.submitted = new core_1.EventEmitter();
    }
    NewGroupModalComponent.prototype.ngOnInit = function () {
        this.formGroup = this.formBuilder.group({
            name: null,
            parent: null
        });
    };
    /**
     * Opens the modal, and optionally sets the selected User Group in the tree to the one provided.
     * @param selectedUserGroup The User Group to select.
     */
    NewGroupModalComponent.prototype.open = function (selectedUserGroup) {
        this.resetFormGroup(selectedUserGroup);
        this.modal.openModal();
    };
    NewGroupModalComponent.prototype.resetFormGroup = function (selectedUserGroup) {
        var _this = this;
        this.userGroupService
            .getRootUserGroup()
            .subscribe(function (rootGroup) {
            _this.rootGroup = rootGroup;
            _this.userGroupService
                .getUserGroupHierarchyDown(rootGroup)
                .subscribe(function (groups) {
                var groupNames = groups ? groups.map(function (group) { return group.name; }) : [];
                groupNames.push(rootGroup.name);
                _this.formGroup = _this.formBuilder.group({
                    name: [null, forms_1.Validators.compose([
                            forms_1.Validators.required,
                            forms_1.Validators.maxLength(30),
                            forms_1.Validators.pattern("[^<>;=]*"),
                            uniqueness_validator_1.UniquenessValidator.isUnique(groupNames)
                        ])],
                    parent: [selectedUserGroup ? [selectedUserGroup] : []]
                });
            });
        });
    };
    NewGroupModalComponent.prototype.onGroupSubmitted = function () {
        var _this = this;
        this.loaderService.startLoading();
        var parentGroup;
        if (this.formGroup.controls['parent'].value && this.formGroup.controls['parent'].value.length > 0)
            parentGroup = [].concat(this.formGroup.controls['parent'].value)[0];
        else
            parentGroup = this.rootGroup;
        var newUserGroup = {
            name: this.formGroup.controls['name'].value,
            parent: parentGroup
        };
        this.userGroupService
            .addNewUserGroup(newUserGroup)
            .subscribe(function (userGroup) {
            if (userGroup) {
                _this.submitted.next(userGroup);
                _this.modal.closeModal();
            }
            _this.loaderService.stopLoading();
        });
    };
    return NewGroupModalComponent;
}());
__decorate([
    core_1.ViewChild('modal'),
    __metadata("design:type", modal_component_1.ModalComponent)
], NewGroupModalComponent.prototype, "modal", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], NewGroupModalComponent.prototype, "submitted", void 0);
NewGroupModalComponent = __decorate([
    core_1.Component({
        selector: 'new-group-modal',
        templateUrl: 'new-group-modal.component.html'
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        usergroup_service_1.UserGroupService,
        loader_service_1.LoaderService])
], NewGroupModalComponent);
exports.NewGroupModalComponent = NewGroupModalComponent;
//# sourceMappingURL=new-group-modal.component.js.map