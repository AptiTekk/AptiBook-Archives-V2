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
var modal_component_1 = require("../../../../../components/modal/modal.component");
var forms_1 = require("@angular/forms");
var usergroup_service_1 = require("../../../../../services/singleton/usergroup.service");
var resource_service_1 = require("../../../../../services/singleton/resource.service");
var api_service_1 = require("../../../../../services/singleton/api.service");
var loader_service_1 = require("../../../../../services/singleton/loader.service");
var resource_image_component_1 = require("../../../../../components/resource-image/resource-image.component");
var uniqueness_validator_1 = require("../../../../../validators/uniqueness.validator");
var NewResourceModalComponent = (function () {
    function NewResourceModalComponent(formBuilder, userGroupService, resourceService, apiService, loaderService) {
        this.formBuilder = formBuilder;
        this.userGroupService = userGroupService;
        this.resourceService = resourceService;
        this.apiService = apiService;
        this.loaderService = loaderService;
        this.submitted = new core_1.EventEmitter();
    }
    NewResourceModalComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userGroupService.getRootUserGroup().subscribe(function (rootGroup) { return _this.rootGroup = rootGroup; });
        this.resetFormGroup();
    };
    NewResourceModalComponent.prototype.open = function (resourceCategory) {
        this.resourceCategory = resourceCategory;
        this.resetFormGroup();
        this.resourceImage.clearImage();
        this.modal.openModal();
    };
    NewResourceModalComponent.prototype.resetFormGroup = function () {
        this.formGroup = this.formBuilder.group({
            name: [null, forms_1.Validators.compose([
                    forms_1.Validators.required,
                    forms_1.Validators.maxLength(30),
                    forms_1.Validators.pattern("[^<>;=]*"),
                    uniqueness_validator_1.UniquenessValidator.isUnique(this.resourceCategory ? this.resourceCategory.resources.map(function (resource) { return resource.name; }) : [])
                ])],
            needsApproval: true,
            owner: this.rootGroup ? this.rootGroup.children[0] : null
        });
    };
    NewResourceModalComponent.prototype.onSubmitted = function () {
        var _this = this;
        this.loaderService.startLoading();
        this.resourceService.addNewResource(this.resourceCategory, this.formGroup.controls['name'].value, this.formGroup.controls['needsApproval'].value, [].concat(this.formGroup.controls['owner'].value)[0]).subscribe(function (resource) {
            if (resource) {
                _this.resourceImage
                    .upload(resource)
                    .subscribe(function (success) {
                    if (success) {
                        _this.modal.closeModal();
                        _this.submitted.next();
                    }
                    _this.loaderService.stopLoading();
                });
            }
        });
    };
    return NewResourceModalComponent;
}());
__decorate([
    core_1.ViewChild('modal'),
    __metadata("design:type", modal_component_1.ModalComponent)
], NewResourceModalComponent.prototype, "modal", void 0);
__decorate([
    core_1.ViewChild(resource_image_component_1.ResourceImageComponent),
    __metadata("design:type", resource_image_component_1.ResourceImageComponent)
], NewResourceModalComponent.prototype, "resourceImage", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], NewResourceModalComponent.prototype, "submitted", void 0);
NewResourceModalComponent = __decorate([
    core_1.Component({
        selector: 'new-resource-modal',
        templateUrl: 'new-resource-modal.component.html',
        styleUrls: ['new-resource-modal.component.css']
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        usergroup_service_1.UserGroupService,
        resource_service_1.ResourceService,
        api_service_1.APIService,
        loader_service_1.LoaderService])
], NewResourceModalComponent);
exports.NewResourceModalComponent = NewResourceModalComponent;
//# sourceMappingURL=new-resource-modal.component.js.map