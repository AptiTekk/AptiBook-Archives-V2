/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, EventEmitter, OnInit, Output, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModalComponent} from "../../../../../../components/modal/modal.component";
import {LoaderService} from "../../../../../../services/singleton/loader.service";
import {UniquenessValidator} from "../../../../../../validators/uniqueness.validator";
import {UserGroupService} from "../../../../../../services/singleton/usergroup.service";
import {UserGroup} from "../../../../../../models/user-group.model";

@Component({
    selector: 'new-group-modal',
    templateUrl: 'new-group-modal.component.html'
})
export class NewGroupModalComponent implements OnInit {

    @ViewChild('modal')
    modal: ModalComponent;

    @Output() submitted = new EventEmitter<UserGroup>();

    formGroup: FormGroup;

    constructor(private formBuilder: FormBuilder,
                protected userGroupService: UserGroupService,
                protected loaderService: LoaderService) {

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
                                    parent: selectedUserGroup ? selectedUserGroup : rootGroup
                                });
                            }
                        );
                }
            );
    }

    onGroupSubmitted() {
        this.loaderService.startLoading();

        let newUserGroup: UserGroup = {
            name: this.formGroup.controls['name'].value,
            parent: [].concat(this.formGroup.controls['parent'].value)[0]
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