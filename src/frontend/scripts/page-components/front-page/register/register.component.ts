/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {RegistrationService} from "../../../services/singleton/registration.service";
import {User} from "../../../models/user.model";
import {AlertComponent} from "../../../components/alert/alert.component";
import {LoaderService} from "../../../services/singleton/loader.service";

@Component({
    selector: 'register',
    templateUrl: 'register.component.html'
})
export class RegisterComponent {

    @ViewChild('registerAlert')
    registerAlert: AlertComponent;

    formGroup: FormGroup;

    constructor(formBuilder: FormBuilder,
                private router: Router,
                private activeRoute: ActivatedRoute,
                private registrationService: RegistrationService,
                private loaderService: LoaderService) {

        this.formGroup = formBuilder.group({
            emailAddress: [null, Validators.compose([Validators.required, Validators.maxLength(100), Validators.pattern("[^<>;=]*")])],
            firstName: [null, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
            lastName: [null, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
            password: [null, Validators.compose([Validators.required, Validators.maxLength(30)])],
            confirmPassword: [null, Validators.compose([Validators.required, Validators.maxLength(30)])]
        });

    }


    ngAfterViewInit(): void {
        //Check for errors in the parameters
        this.activeRoute.queryParams.subscribe(
            params => {
                if (params['registerError']) {
                    if (params['registerError'] === "user_exists")
                        this.registerAlert.display("Unfortunately, a user with this email already exists.", false);
                    else if (params['registerError'] === "null_fields")
                        this.registerAlert.display("Unfortunately, an error has occurred.", false);
                }
            });
    }

    onSubmit() {
        let newUser: User = {
            emailAddress: this.formGroup.controls['emailAddress'].value,
            firstName: this.formGroup.controls['firstName'].value,
            lastName: this.formGroup.controls['lastName'].value,
            newPassword: this.formGroup.controls['password'].value,
            verified: false
        };

        this.loaderService.startLoading();
        this.registrationService.register(newUser).subscribe(
            user => this.router.navigate(['', 'register', 'success']).then(() => this.loaderService.stopLoading()),
            err => {
                this.registerAlert.display(err, true);
                this.loaderService.stopLoading();
            }
        );
    }

    doPasswordsMatch(): boolean {
        if (this.formGroup.controls['confirmPassword'].pristine)
            return true;
        return this.formGroup.controls['password'].value === this.formGroup.controls['confirmPassword'].value;
    }


}