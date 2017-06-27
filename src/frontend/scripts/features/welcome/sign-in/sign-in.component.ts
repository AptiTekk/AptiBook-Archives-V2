/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {OAuthService} from "../../../core/services/oauth.service";
import {AuthService} from "../../../core/services/auth.service";
import {AlertComponent} from "../../../shared/alert/alert.component";
import {FormBuilder, FormGroup} from "@angular/forms";
import {LoaderService} from "../../../core/services/loader.service";

@Component({
    selector: 'sign-in',
    templateUrl: 'sign-in.component.html'
})
export class SignInComponent implements OnInit, AfterViewInit {

    @ViewChild('loginDangerAlert') loginDangerAlert: AlertComponent;
    @ViewChild('loginInfoAlert') loginInfoAlert: AlertComponent;

    signInFormGroup: FormGroup;

    googleSignInUrl: string;

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private activeRoute: ActivatedRoute,
                private oAuthService: OAuthService,
                private authService: AuthService,
                private loaderService: LoaderService) {
    }

    ngOnInit(): void {
        this.signInFormGroup = this.formBuilder.group({
            emailAddress: [null],
            password: [null]
        });

        //Get the Google Sign In URL
        this.oAuthService.getGoogleOAuthUrl().subscribe(url => this.googleSignInUrl = url);
    }

    ngAfterViewInit(): void {
        // Reload the OAuth URLs
        this.oAuthService.reloadOAuthURLs();

        //Check for errors in the parameters
        this.activeRoute.queryParams.subscribe(
            params => {
                if (params['oauth_error']) {
                    let oAuthMethod = params['oauth_method'] === 'google' ? 'Google' : null;

                    switch (params['oauth_error']) {
                        case 'server_error':
                            this.loginDangerAlert.display("Unfortunately, sign in could not process successfully.", false);
                            break;
                        case 'invalid_domain':
                            this.loginDangerAlert.display("Unfortunately, the email address you used to sign in is not allowed.", false);
                            break;
                        case 'access_denied':
                            this.loginDangerAlert.display("Unfortunately, we were unable to access your account details.", false);
                            break;
                    }
                } else if (params['verified'] !== undefined) {
                    switch (params['verified']) {
                        case 'true':
                            this.loginInfoAlert.display("Your Email Address has been verified and you may now sign in.", false);
                            break;
                        case 'false':
                            this.loginDangerAlert.display("Your Email Address could not be verified.", false);
                            break;
                    }
                }
            });
    }

    onSubmit() {
        this.loaderService.startLoading();
        this.authService
            .signInAsUser(this.signInFormGroup.controls['emailAddress'].value, this.signInFormGroup.controls['password'].value)
            .then(user => this.router.navigateByUrl("/secure").then(() => this.loaderService.stopLoading()))
            .catch(err => {
                this.loginDangerAlert.display(err, true);
                this.loaderService.stopLoading();
            })
    }

    onGoogleSignIn() {
        window.location.href = this.googleSignInUrl;
    }

}