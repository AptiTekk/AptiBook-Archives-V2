/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../../../core/services/auth.service";
import {AlertComponent} from "../../../shared/alert/alert.component";
import {FormBuilder, FormGroup} from "@angular/forms";
import {LoaderService} from "../../../core/services/loader.service";
import {FormGroupComponent} from "../../../shared/form-group/form-group.component";

@Component({
    selector: 'at-admin-sign-in',
    templateUrl: 'admin-sign-in.component.html',
    styleUrls: ['admin-sign-in.component.css']
})
export class AdminSignInComponent implements OnInit, AfterViewInit {

    @ViewChild('passwordField') passwordField: FormGroupComponent;

    @ViewChild('loginDangerAlert') loginDangerAlert: AlertComponent;
    @ViewChild('loginInfoAlert') loginInfoAlert: AlertComponent;

    signInFormGroup: FormGroup;

    googleSignInUrl: string;

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private authService: AuthService,
                private loaderService: LoaderService) {
    }

    ngOnInit(): void {
        this.signInFormGroup = this.formBuilder.group({
            password: [null]
        });
    }

    ngAfterViewInit(): void {
        this.passwordField.focus();
    }

    onSubmit() {
        this.loaderService.startLoading();
        this.authService
            .signInAsAdmin(this.signInFormGroup.controls['password'].value)
            .then(user => this.router.navigateByUrl("/secure").then(() => this.loaderService.stopLoading()))
            .catch(err => {
                this.loginDangerAlert.display(err.message, true);
                this.loaderService.stopLoading();
            })
    }

    onGoogleSignIn() {
        window.location.href = this.googleSignInUrl;
    }

}