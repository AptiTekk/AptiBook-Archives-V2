/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, EventEmitter, OnInit, Output, ViewChild} from "@angular/core";
import {ModalComponent} from "../../../../../components/modal/modal.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ResourceCategoryService} from "../../../../../services/singleton/resource-category.service";
import {LoaderService} from "../../../../../services/singleton/loader.service";
import {UniquenessValidator} from "../../../../../validators/uniqueness.validator";

@Component({
    selector: 'new-category-modal',
    templateUrl: 'new-category-modal.component.html'
})
export class NewCategoryModalComponent implements OnInit {

    @ViewChild('modal')
    modal: ModalComponent;

    @Output() submitted: EventEmitter<{ name: string }> = new EventEmitter<{ name: string }>();

    formGroup: FormGroup;

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
                    this.formGroup = this.formBuilder.group({
                        name: [null, Validators.compose([
                            Validators.required,
                            Validators.maxLength(30),
                            Validators.pattern("[^<>;=]*"),
                            UniquenessValidator.isUnique(categories ? categories.map(category => category.name) : [])
                        ])]
                    });
                }
            );
    }

    public open() {
        this.formGroup.reset();
        this.modal.openModal();
    }

    onCategorySubmitted() {
        this.loaderService.startLoading();

        this.resourceCategoryService
            .addNewResourceCategory(this.formGroup.controls['name'].value)
            .subscribe(
                resourceCategory => {
                    if (resourceCategory) {
                        this.submitted.next(resourceCategory);
                        this.modal.closeModal();
                    }

                    this.loaderService.stopLoading();
                }
            );
    }

}