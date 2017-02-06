/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, EventEmitter, OnInit, Output, ViewChild} from "@angular/core";
import {ModalComponent} from "../../../../../components/modal/modal.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserGroupService} from "../../../../../services/singleton/usergroup.service";
import {UserGroup} from "../../../../../models/user-group.model";
import {ResourceService} from "../../../../../services/singleton/resource.service";
import {ResourceCategory} from "../../../../../models/resource-category.model";
import {APIService} from "../../../../../services/singleton/api.service";
import {LoaderService} from "../../../../../services/singleton/loader.service";
import {ResourceImageComponent} from "../../../../../components/resource-image/resource-image.component";
import {UniquenessValidator} from "../../../../../validators/uniqueness.validator";

@Component({
    selector: 'new-resource-modal',
    templateUrl: 'new-resource-modal.component.html',
    styleUrls: ['new-resource-modal.component.css']
})
export class NewResourceModalComponent implements OnInit {

    @ViewChild('modal')
    modal: ModalComponent;

    formGroup: FormGroup;

    resourceCategory: ResourceCategory;

    rootGroup: UserGroup;

    @ViewChild(ResourceImageComponent) resourceImage: ResourceImageComponent;

    @Output() submitted: EventEmitter<void> = new EventEmitter<void>();

    constructor(protected formBuilder: FormBuilder,
                protected userGroupService: UserGroupService,
                protected resourceService: ResourceService,
                protected apiService: APIService,
                protected loaderService: LoaderService) {
    }

    ngOnInit(): void {
        this.userGroupService.getRootUserGroup().subscribe(rootGroup => this.rootGroup = rootGroup);
        this.resetFormGroup();
    }

    public open(resourceCategory: ResourceCategory) {
        this.resourceCategory = resourceCategory;
        this.resetFormGroup();
        this.resourceImage.clearImage();
        this.modal.openModal();
    }

    private resetFormGroup() {
        this.formGroup = this.formBuilder.group({
            name: [null, Validators.compose([
                Validators.required,
                Validators.maxLength(30),
                Validators.pattern("[^<>;=]*"),
                UniquenessValidator.isUnique(this.resourceCategory ? this.resourceCategory.resources.map(resource => resource.name) : [])
            ])],
            needsApproval: true,
            owner: this.rootGroup ? this.rootGroup.children[0] : null
        });
    }

    onSubmitted() {
        this.loaderService.startLoading();
        this.resourceService.addNewResource(
            this.resourceCategory,
            this.formGroup.controls['name'].value,
            this.formGroup.controls['needsApproval'].value,
            [].concat(this.formGroup.controls['owner'].value)[0]
        ).subscribe(
            resource => {
                if (resource) {
                    this.resourceImage
                        .upload(resource)
                        .subscribe(
                            success => {
                                if (success) {
                                    this.modal.closeModal();
                                    this.submitted.next();
                                }

                                this.loaderService.stopLoading();
                            }
                        );
                }
            }
        );
    }

}