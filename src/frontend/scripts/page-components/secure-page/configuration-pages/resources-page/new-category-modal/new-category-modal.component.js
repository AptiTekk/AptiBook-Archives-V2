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
var NewCategoryModalComponent = (function () {
    function NewCategoryModalComponent(formBuilder, resourceCategoryService, loaderService) {
        this.formBuilder = formBuilder;
        this.resourceCategoryService = resourceCategoryService;
        this.loaderService = loaderService;
        this.submitted = new core_1.EventEmitter();
    }
    NewCategoryModalComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.formGroup = this.formBuilder.group({
            name: null
        });
        this.resourceCategoryService
            .getResourceCategories()
            .subscribe(function (categories) {
            _this.formGroup = _this.formBuilder.group({
                name: [null, forms_1.Validators.compose([
                        forms_1.Validators.required,
                        forms_1.Validators.maxLength(30),
                        forms_1.Validators.pattern("[^<>;=]*"),
                        uniqueness_validator_1.UniquenessValidator.isUnique(categories ? categories.map(function (category) { return category.name; }) : [])
                    ])]
            });
        });
    };
    NewCategoryModalComponent.prototype.open = function () {
        this.formGroup.reset();
        this.modal.openModal();
    };
    NewCategoryModalComponent.prototype.onCategorySubmitted = function () {
        var _this = this;
        this.loaderService.startLoading();
        this.resourceCategoryService
            .addNewResourceCategory(this.formGroup.controls['name'].value)
            .subscribe(function (resourceCategory) {
            if (resourceCategory) {
                _this.submitted.next(resourceCategory);
                _this.modal.closeModal();
            }
            _this.loaderService.stopLoading();
        });
    };
    return NewCategoryModalComponent;
}());
__decorate([
    core_1.ViewChild('modal'),
    __metadata("design:type", modal_component_1.ModalComponent)
], NewCategoryModalComponent.prototype, "modal", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], NewCategoryModalComponent.prototype, "submitted", void 0);
NewCategoryModalComponent = __decorate([
    core_1.Component({
        selector: 'new-category-modal',
        templateUrl: 'new-category-modal.component.html'
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        resource_category_service_1.ResourceCategoryService,
        loader_service_1.LoaderService])
], NewCategoryModalComponent);
exports.NewCategoryModalComponent = NewCategoryModalComponent;
//# sourceMappingURL=new-category-modal.component.js.map