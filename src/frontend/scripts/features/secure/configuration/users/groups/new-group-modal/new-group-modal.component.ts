/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, EventEmitter, OnInit, Output, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModalComponent} from "../../../../../../shared/modal/modal.component";
import {LoaderService} from "../../../../../../core/services/loader.service";
import {UniquenessValidator} from "../../../../../../validators/uniqueness.validator";
import {UserGroupService} from "../../../../../../core/services/usergroup.service";
import {UserGroup} from "../../../../../../models/user-group.model";

@Component({
    selector: 'new-group-modal',
    templateUrl: 'new-group-modal.component.html'
})
export class NewGroupModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;

    @Output() submitted = new EventEmitter<UserGroup>();

    formGroup: FormGroup;

    rootGroup: UserGroup;

    constructor(private formBuilder: FormBuilder,
                private userGroupService: UserGroupService,
                private loaderService: LoaderService) {

    }

    ngOnInit(): void {
        this.formGroup = this.formBuilder.group({
            name: null,
            parent: null
        });
    }

    /**
     * Opens the modal, and optionally sets the selected User Group in the tree to the one provided.
     * @param selectedUserGroup The User Group to select.
     */
    public open(selectedUserGroup?: UserGroup) {
        this.resetFormGroup(selectedUserGroup);
        this.modal.openModal();
    }

    private resetFormGroup(selectedUserGroup?: UserGroup) {
        this.userGroupService
            .getRootUserGroup()
            .subscribe(
                rootGroup => {
                    this.rootGroup = rootGroup;
                    this.userGroupService
                        .getUserGroupHierarchyDown(rootGroup)
                        .subscribe(
                            groups => {
                                let groupNames: string[] = groups ? groups.map(group => group.name) : [];
                                groupNames.push(rootGroup.name);

                                this.formGroup = this.formBuilder.group({
                                    name: [null, Validators.compose([
                                        Validators.required,
                                        Validators.maxLength(30),
                                        Validators.pattern("[^<>;=]*"),
                                        UniquenessValidator.isUnique(groupNames)
                                    ])],
                                    parent: [selectedUserGroup ? [selectedUserGroup] : []]
                                });
                            }
                        );
                }
            );
    }

    onGroupSubmitted() {
        this.loaderService.startLoading();

        let parentGroup: UserGroup;
        if (this.formGroup.controls['parent'].value && this.formGroup.controls['parent'].value.length > 0)
            parentGroup = [].concat(this.formGroup.controls['parent'].value)[0];
        else
            parentGroup = this.rootGroup;

        let newUserGroup: UserGroup = {
            name: this.formGroup.controls['name'].value,
            parent: parentGroup
        };

        this.userGroupService
            .addNewUserGroup(newUserGroup)
            .subscribe(
                userGroup => {
                    if (userGroup) {
                        this.submitted.next(userGroup);
                        this.modal.closeModal();
                    }

                    this.loaderService.stopLoading();
                }
            );
    }

}