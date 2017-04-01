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
var resource_category_service_1 = require("../../../../../services/singleton/resource-category.service");
var loader_service_1 = require("../../../../../services/singleton/loader.service");
var uniqueness_validator_1 = require("../../../../../validators/uniqueness.validator");
var EditCategoryModalComponent = (function () {
    function EditCategoryModalComponent(formBuilder, resourceCategoryService, loaderService) {
        this.formBuilder = formBuilder;
        this.resourceCategoryService = resourceCategoryService;
        this.loaderService = loaderService;
        this.submitted = new core_1.EventEmitter();
        this.deleted = new core_1.EventEmitter();
    }
    EditCategoryModalComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.formGroup = this.formBuilder.group({
            name: null
        });
        this.resourceCategoryService
            .getResourceCategories()
            .subscribe(function (categories) {
            _this.resourceCategories = categories;
        });
    };
    EditCategoryModalComponent.prototype.open = function (category) {
        this.resourceCategory = category;
        this.resetFormGroup();
        this.modal.openModal();
    };
    EditCategoryModalComponent.prototype.resetFormGroup = function () {
        var _this = this;
        this.formGroup = this.formBuilder.group({
            name: [this.resourceCategory.name, forms_1.Validators.compose([
                    forms_1.Validators.required,
                    forms_1.Validators.maxLength(30),
                    forms_1.Validators.pattern("[^<>;=]*"),
                    uniqueness_validator_1.UniquenessValidator.isUnique(this.resourceCategories ? this.resourceCategories.filter(function (category) { return category.id !== _this.resourceCategory.id; }).map(function (category) { return category.name; }) : [])
                ])]
        });
    };
    EditCategoryModalComponent.prototype.onCategorySubmitted = function () {
        var _this = this;
        this.loaderService.startLoading();
        this.resourceCategory.name = this.formGroup.controls['name'].value;
        this.resourceCategoryService.patchResourceCategory(this.resourceCategory).subscribe(function (resourceCategory) {
            if (resourceCategory) {
                _this.submitted.emit(resourceCategory);
                _this.modal.closeModal();
            }
            _this.loaderService.stopLoading();
        });
    };
    EditCategoryModalComponent.prototype.onDeleteCategory = function () {
        var _this = this;
        this.loaderService.startLoading();
        this.resourceCategoryService.deleteResourceCategory(this.resourceCategory).subscribe(function (response) {
            _this.deleted.emit();
            _this.modal.closeModal();
            _this.loaderService.stopLoading();
        });
    };
    return EditCategoryModalComponent;
}());
__decorate([
    core_1.ViewChild('modal'),
    __metadata("design:type", modal_component_1.ModalComponent)
], EditCategoryModalComponent.prototype, "modal", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], EditCategoryModalComponent.prototype, "submitted", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], EditCategoryModalComponent.prototype, "deleted", void 0);
EditCategoryModalComponent = __decorate([
    core_1.Component({
        selector: 'edit-category-modal',
        templateUrl: 'edit-category-modal.component.html'
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        resource_category_service_1.ResourceCategoryService,
        loader_service_1.LoaderService])
], EditCategoryModalComponent);
exports.EditCategoryModalComponent = EditCategoryModalComponent;
//# sourceMappingURL=edit-category-modal.component.js.map