/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, ViewChild, Output, EventEmitter} from "@angular/core";
import {ModalComponent} from "../../../../../components/modal/modal.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserGroupService} from "../../../../../services/singleton/usergroup.service";
import {UserGroup} from "../../../../../models/user-group.model";

@Component({
    selector: 'new-resource-modal',
    templateUrl: 'new-resource-modal.component.html'
})
export class NewResourceModalComponent {

    @ViewChild('modal')
    modal: ModalComponent;

    rootGroup: UserGroup;

    @Output() submitted: EventEmitter<{name: string}> = new EventEmitter<{name: string}>();

    formGroup: FormGroup;

    constructor(formBuilder: FormBuilder,
                protected userGroupService: UserGroupService) {

        userGroupService.getRootUserGroup().subscribe(rootGroup => {
            this.rootGroup = rootGroup;

            this.formGroup = formBuilder.group({
                name: [null, Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
                needsApproval: [true],
                owner: [this.rootGroup.children[0]]
            });
        });
    }

    public open() {
        this.formGroup.reset();
        this.modal.openModal();
    }

    onSubmitted() {
        let newResource = {
            name: this.formGroup.controls['name'].value,
            needsApproval: this.formGroup.controls['needsApproval'].value,
            owner: this.formGroup.controls['owner'].value
        };
        this.submitted.next(newResource);
        this.modal.closeModal();
    }

}