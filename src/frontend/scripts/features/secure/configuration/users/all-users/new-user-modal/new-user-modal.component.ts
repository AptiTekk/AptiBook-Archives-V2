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
import {User} from "../../../../../../models/user.model";
import {UserService} from "../../../../../../core/services/user.service";
import {AlertComponent} from "../../../../../../shared/alert/alert.component";

@Component({
    selector: 'new-user-modal',
    templateUrl: 'new-user-modal.component.html'
})
export class NewUserModalComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('dangerAlert') dangerAlert: AlertComponent;

    @Output() submitted = new EventEmitter<User>();

    formGroup: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private userService: UserService,
                private loaderService: LoaderService) {
    }

    ngOnInit(): void {
        this.formGroup = this.formBuilder.group({
            emailAddress: null,
            firstName: null,
            lastName: null,
            phoneNumber: null,
            userGroups: []
        });
    }

    /**
     * Opens the modal.
     */
    public open() {
        this.resetFormGroup();
        this.modal.openModal();
    }

    private resetFormGroup() {
        this.userService
            .getUsers()
            .take(1)
            .subscribe(
                users => {
                    let takenEmailAddresses: string[] = users.map(user => user.emailAddress);

                    this.formGroup = this.formBuilder.group({
                        emailAddress: [null, Validators.compose([Validators.required, Validators.maxLength(100), Validators.pattern("[^<>;=]*"), UniquenessValidator.isUnique(takenEmailAddresses)])],
                        firstName: [null, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
                        lastName: [null, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
                        phoneNumber: [null, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
                        userGroups: [[]]
                    });
                }
            );
    }

    onUserSubmitted() {
        this.loaderService.startLoading();

        let newUser: User = {
            emailAddress: this.formGroup.controls['emailAddress'].value,
            firstName: this.formGroup.controls['firstName'].value,
            lastName: this.formGroup.controls['lastName'].value,
            phoneNumber: this.formGroup.controls['phoneNumber'].value,
            userGroups: [].concat(this.formGroup.controls['userGroups'].value)
        };

        this.userService
            .addNewUser(newUser)
            .then(user => {
                if (user) {
                    this.submitted.next(user);
                    this.modal.closeModal();
                }
                this.loaderService.stopLoading();
            })
            .catch(err => {
                this.dangerAlert.display(err.message);
                this.loaderService.stopLoading();
            })
    }

}