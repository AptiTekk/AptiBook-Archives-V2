/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../../../core/services/auth.service";
import {AlertComponent} from "../../../shared/alert/alert.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoaderService} from "../../../core/services/loader.service";

@Component({
    selector: 'at-admin-sign-in',
    templateUrl: 'admin-sign-in.component.html'
})
export class AdminSignInComponent implements OnInit, AfterViewInit {

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
    }

    onSubmit() {
        this.loaderService.startLoading();
        this.authService
            .signInAsAdmin(this.signInFormGroup.controls['password'].value)
            .subscribe(
                user => this.router.navigateByUrl("/secure").then(() => this.loaderService.stopLoading()),
                err => {
                    this.loginDangerAlert.display(err, true);
                    this.loaderService.stopLoading();
                }
            );
    }

    onGoogleSignIn() {
        window.location.href = this.googleSignInUrl;
    }

}