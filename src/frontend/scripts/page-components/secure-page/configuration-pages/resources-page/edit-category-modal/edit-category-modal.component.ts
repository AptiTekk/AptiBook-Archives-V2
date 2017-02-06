/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, EventEmitter, OnInit, Output, ViewChild} from "@angular/core";
import {ModalComponent} from "../../../../../components/modal/modal.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ResourceCategory} from "../../../../../models/resource-category.model";
import {ResourceCategoryService} from "../../../../../services/singleton/resource-category.service";
import {LoaderService} from "../../../../../services/singleton/loader.service";
import {UniquenessValidator} from "../../../../../validators/uniqueness.validator";

@Component({
    selector: 'edit-category-modal',
    templateUrl: 'edit-category-modal.component.html'
})
export class EditCategoryModalComponent implements OnInit {

    @ViewChild('modal')
    modal: ModalComponent;

    @Output() submitted: EventEmitter<ResourceCategory> = new EventEmitter<ResourceCategory>();
    @Output() deleted: EventEmitter<void> = new EventEmitter<void>();

    formGroup: FormGroup;

    private resourceCategories: ResourceCategory[];
    resourceCategory: ResourceCategory;

    constructor(private formBuilder: FormBuilder,
                protected resourceCategoryService: ResourceCategoryService,
                protected loaderService: LoaderService) {
    }

    ngOnInit(): void {
        this.formGroup = this.formBuilder.group({
            name: null
        });

        this.resourceCategoryService
            .getResourceCategories()
            .subscribe(
                categories => {
                    this.resourceCategories = categories;
                }
            );
    }

    public open(category: ResourceCategory) {
        this.resourceCategory = category;
        this.formGroup = this.formBuilder.group({
            name: [category.name, Validators.compose([
                Validators.required,
                Validators.maxLength(30),
                Validators.pattern("[^<>;=]*"),
                UniquenessValidator.isUnique(this.resourceCategories ? this.resourceCategories.filter(category => category.id !== this.resourceCategory.id).map(category => category.name) : [])
            ])]
        });
        this.modal.openModal();
    }

    onCategorySubmitted() {
        this.loaderService.startLoading();

        this.resourceCategory.name = this.formGroup.controls['name'].value;
        this.resourceCategoryService.patchResourceCategory(this.resourceCategory).subscribe(
            resourceCategory => {
                if (resourceCategory) {
                    this.submitted.emit(resourceCategory);
                    this.modal.closeModal();
                }

                this.loaderService.stopLoading();
            }
        );
    }

    onDeleteCategory() {
        this.loaderService.startLoading();

        this.resourceCategoryService.deleteResourceCategory(this.resourceCategory).subscribe(
            response => {
                this.deleted.emit();
                this.modal.closeModal();

                this.loaderService.stopLoading();
            }
        );
    }

}