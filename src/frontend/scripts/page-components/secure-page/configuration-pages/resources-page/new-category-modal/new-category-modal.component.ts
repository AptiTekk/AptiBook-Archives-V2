/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, ViewChild, Output, EventEmitter} from "@angular/core";
import {ModalComponent} from "../../../../../components/modal/modal.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ResourceCategoryService} from "../../../../../services/singleton/resource-category.service";

@Component({
    selector: 'new-category-modal',
    templateUrl: 'new-category-modal.component.html'
})
export class NewCategoryModalComponent {

    @ViewChild('modal')
    modal: ModalComponent;

    @Output() submitted: EventEmitter<{name: string}> = new EventEmitter<{name: string}>();

    formGroup: FormGroup;

    constructor(formBuilder: FormBuilder,
                protected resourceCategoryService: ResourceCategoryService) {
        this.formGroup = formBuilder.group({
            name: [null, Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern("[^<>;=]*")])]
        });
    }

    public open() {
        this.formGroup.reset();
        this.modal.openModal();
    }

    onCategorySubmitted() {
        this.resourceCategoryService
            .addNewResourceCategory(this.formGroup.controls['name'].value)
            .subscribe(
                resourceCategory => {
                    this.resourceCategoryService.fetchResourceCategories();
                    if (resourceCategory) {
                        this.submitted.next(resourceCategory);
                        this.modal.closeModal();
                    }
                }
            );
    }

}