/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../../models/user.model";
import {AuthService} from "../../../../core/services/auth.service";
import {UserService} from "../../../../core/services/user.service";
import {AlertComponent} from "../../../../shared/alert/alert.component";

@Component({
    selector: 'at-account-user-section',
    templateUrl: 'user-section.component.html',
    styleUrls: ['user-section.component.css']
})
export class UserSectionComponent implements OnInit {

    @ViewChild('errorAlert')
    errorAlert: AlertComponent;

    @ViewChild('infoAlert')
    infoAlert: AlertComponent;

    /**
     * The currently signed-in user.
     */
    user: User;

    /**
     * The FormGroup for account editing purposes.
     */
    formGroup: FormGroup;

    /**
     * Determines if the User is currently editing their account.
     */
    editingAccount: boolean = false;

    constructor(private authService: AuthService,
                private formBuilder: FormBuilder,
                private userService: UserService) {
    }

    ngOnInit() {
        this.authService.reloadUser();
        this.authService.getCurrentUser().subscribe(user => {
            this.user = user;
            if (user)
                this.resetFormGroup();
        });
    }

    /**
     * Called when the "Edit Account" button is clicked.
     */
    onStartEditingAccount(): void {
        this.editingAccount = true;
        this.resetFormGroup();
    }

    /**
     * Resets the FormGroup for editing.
     */
    resetFormGroup(): void {
        this.formGroup = this.formBuilder.group({
            firstName: [this.user.firstName, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
            lastName: [this.user.lastName, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
            phoneNumber: [this.user.phoneNumber, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
            newPassword: [this.user.newPassword, Validators.compose([Validators.maxLength(30)])],
            confirmPassword: [this.user.confirmPassword, Validators.compose([Validators.maxLength(30)])]
        });
    }

    /**
     * Called when the "Cancel" button is clicked while editing.
     */
    onCancelEditingAccount(): void {
        this.editingAccount = false;
    }

    /**
     * Called when the "Save Changes" button is clicked while editing.
     */
    onFinishEditingAccount(): void {
        let userPatch: User = {};

        userPatch.id = this.user.id;
        userPatch.firstName = this.formGroup.controls['firstName'].value;
        userPatch.lastName = this.formGroup.controls['lastName'].value;
        userPatch.phoneNumber = this.formGroup.controls['phoneNumber'].value;
        let newPassword = this.formGroup.controls['newPassword'].value;
        if (newPassword)
            userPatch.newPassword = newPassword;

        this.userService.patchUser(userPatch).take(1).subscribe(
            user => {
                this.authService.reloadUser();
                this.infoAlert.display("Account updated successfully.");
                this.editingAccount = false;
            },
            err => {
                this.errorAlert.display(err);
            });
    }

    doPasswordsMatch(): boolean {
        if (!this.formGroup.controls['newPassword'].value)
            if (!this.formGroup.controls['confirmPassword'].value)
                return true;

        return this.formGroup.controls['newPassword'].value === this.formGroup.controls['confirmPassword'].value;
    }
}