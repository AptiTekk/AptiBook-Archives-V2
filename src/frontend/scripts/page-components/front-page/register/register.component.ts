/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {OAuthService} from "../../../services/stateful/oauth.service";
import {AuthService} from "../../../services/singleton/auth.service";
import {LoaderService} from "../../../services/singleton/loader.service";
import {RegistrationService} from "../../../services/singleton/registration.service";
import {User} from "../../../models/user.model";

@Component({
    selector: 'register',
    templateUrl: 'register.component.html'
})
export class RegisterComponent {

    formGroup: FormGroup;
    user: User = {
        id: null,
        emailAddress: null,
        firstName: null,
        lastName: null,
        fullName: null,
        verified: null,
        phoneNumber: null,
        location: null,
        notifications: null,
        notificationTypeSettings: null,
        permissions: null,
        userGroups: null,
        admin: null,
        newPassword: null,
        confirmPassword: null

    };

    constructor(formBuilder: FormBuilder,
                private router: Router,
                private activeRoute: ActivatedRoute,
                private oAuthService: OAuthService,
                private authService: AuthService,
                private loaderService: LoaderService,
                private registrationService: RegistrationService) {

        this.formGroup = formBuilder.group({
            emailAddress: [null, Validators.compose([Validators.required, Validators.maxLength(100), Validators.pattern("[^<>;=]*")])],
            firstName: [null, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
            lastName: [null, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
            password: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
            confirmPassword: [null, Validators.compose([Validators.required, Validators.maxLength(5)])]

        });

    }

    onSubmit() {
        if (this.formGroup.controls['emailAddress'].value != undefined && this.formGroup.controls['firstName'].value != undefined && this.formGroup.controls['lastName'].value != undefined && this.formGroup.controls['password'].value != undefined && this.formGroup.controls['confirmPassword'].value != undefined) {
            this.user.emailAddress = this.formGroup.controls['emailAddress'].value;
            this.user.firstName = this.formGroup.controls['firstName'].value;
            this.user.lastName = this.formGroup.controls['lastName'].value;
            this.user.newPassword = this.formGroup.controls['password'].value;
            this.user.confirmPassword = this.formGroup.controls['confirmPassword'].value;
            this.user.verified = false;
            this.registrationService.register(this.user).subscribe(response => {
                //redirect to success page
                this.router.navigateByUrl('/success');
            });
        }

    }

    doPasswordsMatch(): boolean {
        if (this.formGroup.controls['confirmPassword'].pristine)
            return true;
        return this.formGroup.controls['password'].value === this.formGroup.controls['confirmPassword'].value;
    }


}