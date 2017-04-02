/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, OnInit, ViewChild} from "@angular/core";
import {AuthService} from "../../../../core/services/auth.service";
import {User} from "../../../../models/user.model";
import {UserService} from "../../../../core/services/user.service";
import {AlertComponent} from "../../../../components/alert/alert.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'my-account-page',
    templateUrl: 'account-page.component.html'
})
export class AccountPageComponent implements OnInit {

    @ViewChild('errorAlert')
    errorAlert: AlertComponent;

    @ViewChild('personalInfoAlert')
    personalInfoAlert: AlertComponent;

    @ViewChild('passwordsInfoAlert')
    passwordsInfoAlert: AlertComponent;

    user: User;

    personalInformation: FormGroup;

    constructor(private authService: AuthService,
                private formBuilder: FormBuilder,
                private userService: UserService) {
    }

    ngOnInit(): void {
        this.authService.reloadUser();
        this.authService.getUser().take(1).subscribe(user => {
            this.user = user;

            this.personalInformation = this.formBuilder.group({
                firstName: [this.user.firstName, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
                lastName: [this.user.lastName, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
                phoneNumber: [this.user.phoneNumber, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
                location: [this.user.location, Validators.compose([Validators.maxLength(250), Validators.pattern("[^<>;=]*")])],
                userGroups: this.user.userGroups
            });
        });
    }

    onPersonalInformationSubmit(changingPassword: boolean = false) {

        let updatedUser: User = jQuery.extend({}, {}, this.user);

        updatedUser.firstName = this.personalInformation.controls['firstName'].value;
        updatedUser.lastName = this.personalInformation.controls['lastName'].value;
        updatedUser.phoneNumber = this.personalInformation.controls['phoneNumber'].value;
        updatedUser.location = this.personalInformation.controls['location'].value;
        updatedUser.userGroups = null;

        this.userService.patchUser(updatedUser, changingPassword).take(1).subscribe(
            user => {
                this.authService.reloadUser();
                if (!changingPassword)
                    this.personalInfoAlert.display("Personal Information updated successfully.");
                else
                    this.passwordsInfoAlert.display("Password updated successfully.");
            },
            err => {
                this.errorAlert.display(err);
            });
    }

    onChangePasswordSubmit() {
        this.onPersonalInformationSubmit(true);
    }

    doPasswordsMatch(): boolean {
        if (!this.user.newPassword)
            if (!this.user.confirmPassword)
                return true;

        return this.user.newPassword === this.user.confirmPassword;
    }

}