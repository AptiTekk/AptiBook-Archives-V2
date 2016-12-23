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
import {ImageUploaderComponent} from "../../../../../components/image-uploader/image-uploader.component";
declare const $: any;

@Component({
    selector: 'new-resource-modal',
    templateUrl: 'new-resource-modal.component.html',
    styleUrls: ['new-resource-modal.component.css']
})
export class NewResourceModalComponent {

    @ViewChild('modal')
    modal: ModalComponent;

    @ViewChild('imageUploader') imageUploader: ImageUploaderComponent;

    rootGroup: UserGroup;

    @Output() submitted: EventEmitter<{name: string}> = new EventEmitter<{name: string}>();

    formGroup: FormGroup;

    constructor(protected formBuilder: FormBuilder,
                protected userGroupService: UserGroupService) {

        userGroupService.getRootUserGroup().subscribe(rootGroup => {
            this.rootGroup = rootGroup;

            this.resetFormGroup();
        });
    }

    public open() {
        this.resetFormGroup();
        this.imageUploader.clearImage();
        this.modal.openModal();
    }

    private resetFormGroup() {
        this.formGroup = this.formBuilder.group({
            name: [null, Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
            needsApproval: true,
            owner: [this.rootGroup.children[0]]
        });
    }

    onSubmitted() {
        let newResource = {
            name: this.formGroup.controls['name'].value,
            needsApproval: this.formGroup.controls['needsApproval'].value,
            owner: this.formGroup.controls['owner'].value
        };

        console.log(newResource);
        this.submitted.next(newResource);
        this.modal.closeModal();
    }

}