/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, EventEmitter, OnInit, Output, ViewChild} from "@angular/core";
import {ModalComponent} from "../../../../../components/modal/modal.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserGroupService} from "../../../../../core/services/usergroup.service";
import {ResourceService} from "../../../../../core/services/resource.service";
import {APIService} from "../../../../../core/services/api.service";
import {Resource} from "../../../../../models/resource.model";
import {LoaderService} from "../../../../../core/services/loader.service";
import {ResourceImageComponent} from "../../../../../components/resource-image/resource-image.component";
import {UniquenessValidator} from "../../../../../validators/uniqueness.validator";
import {ResourceCategory} from "../../../../../models/resource-category.model";

@Component({
    selector: 'edit-resource-modal',
    templateUrl: 'edit-resource-modal.component.html',
    styleUrls: ['edit-resource-modal.component.css']
})
export class EditResourceModalComponent implements OnInit {

    @ViewChild(ModalComponent) modal: ModalComponent;

    formGroup: FormGroup;

    private resourceCategory: ResourceCategory;
    protected resource: Resource;

    @ViewChild(ResourceImageComponent) resourceImage: ResourceImageComponent;

    @Output() submitted: EventEmitter<void> = new EventEmitter<void>();

    constructor(protected formBuilder: FormBuilder,
                protected userGroupService: UserGroupService,
                protected resourceService: ResourceService,
                protected apiService: APIService,
                protected loaderService: LoaderService) {
    }

    ngOnInit(): void {
        this.formGroup = this.formBuilder.group({
            name: null,
            needsApproval: false,
            owner: null
        })
    }

    public open(resource: Resource) {
        this.resourceCategory = resource.resourceCategory;
        this.resource = resource;
        this.resetFormGroup();
        this.resourceImage.clearImage();
        this.modal.openModal();
    }

    public close() {
        this.resource = null;
        this.modal.closeModal();
    }

    private resetFormGroup() {
        this.formGroup = this.formBuilder.group({
            name: [this.resource ? this.resource.name : null, Validators.compose([
                Validators.required,
                Validators.maxLength(30),
                Validators.pattern("[^<>;=]*"),
                UniquenessValidator.isUnique(this.resourceCategory ? this.resourceCategory.resources.filter(resource => resource.id !== this.resource.id).map(resource => resource.name) : [])
            ])],
            needsApproval: this.resource ? this.resource.needsApproval : true,
            owner: this.resource ? this.resource.owner : null
        });
    }

    onSubmitted() {
        this.loaderService.startLoading();

        let resourcePatch: Resource = {
            id: this.resource.id,
            name: this.formGroup.controls['name'].value,
            needsApproval: this.formGroup.controls['needsApproval'].value,
            owner: [].concat(this.formGroup.controls['owner'].value)[0]
        };

        this.resourceService
            .patchResource(resourcePatch)
            .subscribe(
                resource => {
                    if (resource) {
                        if (this.resourceImage.hasImageToUpload()) {

                            // If there is an image, upload it.
                            this.resourceImage.upload().subscribe(
                                success => {
                                    if (success) {
                                        this.close();
                                        this.submitted.next();
                                    }

                                    this.loaderService.stopLoading();
                                }
                            );
                        } else {
                            // Otherwise, delete any existing image.
                            this.resourceImage.deleteImageFromServer()
                                .subscribe(
                                    response => {
                                        this.close();
                                        this.submitted.next();
                                        this.loaderService.stopLoading();
                                    }
                                );
                        }
                    }
                }
            );
    }

}