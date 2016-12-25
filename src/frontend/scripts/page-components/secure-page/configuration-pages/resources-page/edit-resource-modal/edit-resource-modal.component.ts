/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, ViewChild, Output, EventEmitter} from "@angular/core";
import {ModalComponent} from "../../../../../components/modal/modal.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserGroupService} from "../../../../../services/singleton/usergroup.service";
import {ImageUploaderComponent} from "../../../../../components/image-uploader/image-uploader.component";
import {ResourceService} from "../../../../../services/singleton/resource.service";
import {APIService} from "../../../../../services/singleton/api.service";
import {Resource} from "../../../../../models/resource.model";

@Component({
    selector: 'edit-resource-modal',
    templateUrl: 'edit-resource-modal.component.html',
    styleUrls: ['edit-resource-modal.component.css']
})
export class EditResourceModalComponent {

    @ViewChild('modal')
    modal: ModalComponent;

    formGroup: FormGroup;

    resource: Resource;

    @ViewChild('imageUploader') imageUploader: ImageUploaderComponent;

    @Output() submitted: EventEmitter<void> = new EventEmitter<void>();

    constructor(protected formBuilder: FormBuilder,
                protected userGroupService: UserGroupService,
                protected resourceService: ResourceService,
                protected apiService: APIService) {
        this.resetFormGroup();
    }

    public open(resource: Resource) {
        this.resource = resource;
        this.resetFormGroup();
        this.imageUploader.clearImage();
        this.modal.openModal();
    }

    public close() {
        this.resource = null;
        this.modal.closeModal();
    }

    private resetFormGroup() {
        this.formGroup = this.formBuilder.group({
            name: [this.resource ? this.resource.name : null, Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
            needsApproval: this.resource ? this.resource.needsApproval : true,
            owner: this.resource ? this.resource.owner : null
        });
    }

    onSubmitted() {
        this.resource.name = this.formGroup.controls['name'].value;
        this.resource.needsApproval = this.formGroup.controls['needsApproval'].value;
        this.resource.owner = this.formGroup.controls['owner'].value;

        this.resourceService
            .patchResource(this.resource)
            .subscribe(
                resource => {
                    if (resource) {
                        if (this.imageUploader.hasImage()) {

                            // If there is an image, upload it.
                            this.imageUploader.uploadToUrl(this.apiService.getApiUrlFromEndpoint("/resources/" + resource.id + "/image")).subscribe(
                                success => {
                                    if (success) {
                                        this.close();
                                        this.submitted.next();
                                    }
                                }
                            );
                        } else {
                            // Otherwise, delete any existing image.
                            this.apiService
                                .del("/resources/" + resource.id + "/image")
                                .subscribe(
                                    response => {
                                        this.close();
                                        this.submitted.next();
                                    }
                                );
                        }
                    }
                }
            );
    }

}