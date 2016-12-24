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
import {ResourceService} from "../../../../../services/singleton/resource.service";
import {ResourceCategory} from "../../../../../models/resource-category.model";
import {APIService} from "../../../../../services/singleton/api.service";
declare const $: any;

@Component({
    selector: 'new-resource-modal',
    templateUrl: 'new-resource-modal.component.html',
    styleUrls: ['new-resource-modal.component.css']
})
export class NewResourceModalComponent {

    @ViewChild('modal')
    modal: ModalComponent;

    formGroup: FormGroup;

    resourceCategory: ResourceCategory;

    rootGroup: UserGroup;

    @ViewChild('imageUploader') imageUploader: ImageUploaderComponent;

    @Output() submitted: EventEmitter<void> = new EventEmitter<void>();

    constructor(protected formBuilder: FormBuilder,
                protected userGroupService: UserGroupService,
                protected resourceService: ResourceService,
                protected apiService: APIService) {

        userGroupService.getRootUserGroup().subscribe(rootGroup => {
            this.rootGroup = rootGroup;

            this.resetFormGroup();
        });
    }

    public open(resourceCategory: ResourceCategory) {
        this.resourceCategory = resourceCategory;
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
        this.resourceService.addNewResource(
            this.resourceCategory,
            this.formGroup.controls['name'].value,
            this.formGroup.controls['needsApproval'].value,
            this.formGroup.controls['owner'].value
        ).subscribe(
            response => {
                if (response) {
                    this.imageUploader.upload(this.apiService.getApiUrlFromEndpoint("/resources/" + response.id + "/image")).subscribe(
                        success => {
                            if (success) {
                                this.modal.closeModal();
                                this.submitted.next();
                            }
                        }
                    );
                }
            }
        );
    }

}