/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {OAuthService} from "../../../core/services/oauth.service";
import {AuthService} from "../../../core/services/auth.service";
import {AlertComponent} from "../../../components/alert/alert.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoaderService} from "../../../core/services/loader.service";

@Component({
    selector: 'sign-in',
    templateUrl: 'sign-in.component.html'
})
export class SignInComponent implements AfterViewInit {

    @ViewChild('loginDangerAlert') loginDangerAlert: AlertComponent;
    @ViewChild('loginInfoAlert') loginInfoAlert: AlertComponent;

    signInFormGroup: FormGroup;

    googleSignInUrl: string;

    constructor(formBuilder: FormBuilder,
                private router: Router,
                private activeRoute: ActivatedRoute,
                private oAuthService: OAuthService,
                private authService: AuthService,
                private loaderService: LoaderService) {

        this.signInFormGroup = formBuilder.group({
            emailAddress: [null, Validators.required],
            password: [null, Validators.required]
        });

        //Get the Google Sign In URL
        this.oAuthService.getGoogleOAuthUrl().subscribe(url => this.googleSignInUrl = url);
    }

    ngAfterViewInit(): void {
        //Check for errors in the parameters
        this.activeRoute.queryParams.subscribe(
            params => {
                if (params['googleError']) {
                    if (params['googleError'] === "access_denied")
                        this.loginDangerAlert.display("Unfortunately, Sign In with Google failed because access was denied.", false);
                    else if (params['googleError'] === "inactive")
                        this.loginDangerAlert.display("Unfortunately, Sign In with Google failed because it is not allowed.", false);

                } else if (params['verified'] !== undefined) {
                    if (params['verified'] === "true")
                        this.loginInfoAlert.display("Your Email Address has been verified and you may now sign in.", false);
                    else if (params['verified'] === "false")
                        this.loginDangerAlert.display("Your Email Address could not be verified.", false);
                }
            });
    }

    onSubmit() {
        this.loaderService.startLoading();
        this.authService
            .signIn(this.signInFormGroup.controls['emailAddress'].value, this.signInFormGroup.controls['password'].value)
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