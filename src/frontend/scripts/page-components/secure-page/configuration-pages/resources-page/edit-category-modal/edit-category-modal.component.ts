/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, ViewChild, Output, EventEmitter} from "@angular/core";
import {ModalComponent} from "../../../../../components/modal/modal.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ResourceCategory} from "../../../../../models/resource-category.model";

@Component({
    selector: 'edit-category-modal',
    templateUrl: 'edit-category-modal.component.html'
})
export class EditCategoryModalComponent {

    @ViewChild('modal')
    modal: ModalComponent;

    @Output() submitted: EventEmitter<ResourceCategory> = new EventEmitter<ResourceCategory>();
    @Output() deleted: EventEmitter<void> = new EventEmitter<void>();

    formGroup: FormGroup;

    resourceCategory: ResourceCategory;

    constructor(formBuilder: FormBuilder) {
        this.formGroup = formBuilder.group({
            name: [null, Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern("[^<>;=]*")])]
        });
    }

    public open(category: ResourceCategory) {
        this.resourceCategory = category;
        this.formGroup.reset();
        this.formGroup.controls['name'].setValue(category.name);
        this.modal.openModal();
    }

    onCategorySubmitted() {
        this.resourceCategory.name = this.formGroup.controls['name'].value;
        this.submitted.next(this.resourceCategory);
        this.modal.closeModal();
    }

    onDeleteCategory() {
        this.deleted.emit();
        this.modal.closeModal();
    }

}