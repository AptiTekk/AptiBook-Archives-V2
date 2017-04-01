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
var EditResourceModalComponent = (function () {
    function EditResourceModalComponent(formBuilder, userGroupService, resourceService, apiService, loaderService) {
        this.formBuilder = formBuilder;
        this.userGroupService = userGroupService;
        this.resourceService = resourceService;
        this.apiService = apiService;
        this.loaderService = loaderService;
        this.submitted = new core_1.EventEmitter();
    }
    EditResourceModalComponent.prototype.ngOnInit = function () {
        this.formGroup = this.formBuilder.group({
            name: null,
            needsApproval: false,
            owner: null
        });
    };
    EditResourceModalComponent.prototype.open = function (resource) {
        this.resourceCategory = resource.resourceCategory;
        this.resource = resource;
        this.resetFormGroup();
        this.resourceImage.clearImage();
        this.modal.openModal();
    };
    EditResourceModalComponent.prototype.close = function () {
        this.resource = null;
        this.modal.closeModal();
    };
    EditResourceModalComponent.prototype.resetFormGroup = function () {
        var _this = this;
        this.formGroup = this.formBuilder.group({
            name: [this.resource ? this.resource.name : null, forms_1.Validators.compose([
                    forms_1.Validators.required,
                    forms_1.Validators.maxLength(30),
                    forms_1.Validators.pattern("[^<>;=]*"),
                    uniqueness_validator_1.UniquenessValidator.isUnique(this.resourceCategory ? this.resourceCategory.resources.filter(function (resource) { return resource.id !== _this.resource.id; }).map(function (resource) { return resource.name; }) : [])
                ])],
            needsApproval: this.resource ? this.resource.needsApproval : true,
            owner: this.resource ? this.resource.owner : null
        });
    };
    EditResourceModalComponent.prototype.onSubmitted = function () {
        var _this = this;
        this.loaderService.startLoading();
        var resourcePatch = {
            id: this.resource.id,
            name: this.formGroup.controls['name'].value,
            needsApproval: this.formGroup.controls['needsApproval'].value,
            owner: [].concat(this.formGroup.controls['owner'].value)[0]
        };
        this.resourceService
            .patchResource(resourcePatch)
            .subscribe(function (resource) {
            if (resource) {
                if (_this.resourceImage.hasImageToUpload()) {
                    // If there is an image, upload it.
                    _this.resourceImage.upload().subscribe(function (success) {
                        if (success) {
                            _this.close();
                            _this.submitted.next();
                        }
                        _this.loaderService.stopLoading();
                    });
                }
                else {
                    // Otherwise, delete any existing image.
                    _this.resourceImage.deleteImageFromServer()
                        .subscribe(function (response) {
                        _this.close();
                        _this.submitted.next();
                        _this.loaderService.stopLoading();
                    });
                }
            }
        });
    };
    return EditResourceModalComponent;
}());
__decorate([
    core_1.ViewChild(modal_component_1.ModalComponent),
    __metadata("design:type", modal_component_1.ModalComponent)
], EditResourceModalComponent.prototype, "modal", void 0);
__decorate([
    core_1.ViewChild(resource_image_component_1.ResourceImageComponent),
    __metadata("design:type", resource_image_component_1.ResourceImageComponent)
], EditResourceModalComponent.prototype, "resourceImage", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], EditResourceModalComponent.prototype, "submitted", void 0);
EditResourceModalComponent = __decorate([
    core_1.Component({
        selector: 'edit-resource-modal',
        templateUrl: 'edit-resource-modal.component.html',
        styleUrls: ['edit-resource-modal.component.css']
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        usergroup_service_1.UserGroupService,
        resource_service_1.ResourceService,
        api_service_1.APIService,
        loader_service_1.LoaderService])
], EditResourceModalComponent);
exports.EditResourceModalComponent = EditResourceModalComponent;
//# sourceMappingURL=edit-resource-modal.component.js.map