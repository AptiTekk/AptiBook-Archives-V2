/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, OnInit, ViewChild} from "@angular/core";
import {RegistrationService} from "../../core/services/registration.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../models/user.model";
import {LoaderService} from "../../core/services/loader.service";
import {AlertComponent} from "../../shared/alert/alert.component";

@Component({
    selector: 'at-register',
    templateUrl: 'register.component.html',
    styleUrls: ['register.component.css']
})
export class RegisterComponent implements OnInit {

    /**
     * The token required for registration.
     */
    token: string;

    /**
     * The form group for registration details.
     */
    formGroup: FormGroup;

    @ViewChild('registerAlert') registerAlert: AlertComponent;

    constructor(private registrationService: RegistrationService,
                private activatedRoute: ActivatedRoute,
                private formBuilder: FormBuilder,
                private loaderService: LoaderService,
                private router: Router) {
    }

    ngOnInit() {
        // Get the token from the query params
        this.activatedRoute.queryParams
            .subscribe(
                params => {
                    this.token = params['token'];
                    this.loadDetailsFromToken();
                },
                err => {
                    console.error(err);
                }
            );
    }

    /**
     * Using the token field, loads any pre-filled user data from the server.
     */
    loadDetailsFromToken() {
        this.registrationService.getRegistrationDetails(this.token)
            .then(
                user => {
                    this.formGroup = this.formBuilder.group({
                        emailAddress: [user.emailAddress, Validators.compose([Validators.required, Validators.maxLength(100), Validators.pattern("[^<>;=]*")])],
                        firstName: [user.firstName, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
                        lastName: [user.lastName, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])]
                    });
                },
                err => {
                    console.log(err);
                }
            )
    }

    onSubmit() {
        let newUser: User = {
            emailAddress: this.formGroup.controls['emailAddress'].value,
            firstName: this.formGroup.controls['firstName'].value,
            lastName: this.formGroup.controls['lastName'].value
        };

        this.loaderService.startLoading();
        this.registrationService.registerSSO(newUser, this.token)
            .then(
                user => this.router.navigate(['secure']).then(() => this.loaderService.stopLoading())
            )
            .catch(
                err => {
                    this.registerAlert.display(err, true);
                    this.loaderService.stopLoading();
                }
            );
    }
}