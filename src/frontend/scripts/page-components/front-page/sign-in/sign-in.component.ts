import {Component, ViewChild, AfterViewInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {OAuthService} from "../../../services/stateful/oauth.service";
import {AuthService} from "../../../services/singleton/auth.service";
import {AlertComponent} from "../../../components/alert/alert.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoaderService} from "../../../services/singleton/loader.service";

@Component({
    selector: 'sign-in',
    templateUrl: 'sign-in.component.html'
})
export class SignInComponent implements AfterViewInit {

    @ViewChild('loginAlert')
    loginAlert: AlertComponent;

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
                        this.loginAlert.display("Unfortunately, Sign In with Google failed because access was denied.", false);
                    else if (params['googleError'] === "inactive")
                        this.loginAlert.display("Unfortunately, Sign In with Google failed because it is not allowed.", false);
                }
            });

        //Subscribe to auth messages
        this.authService.getAuthMessage().subscribe(message => this.loginAlert.display(message));
    }

    onSubmit() {
        this.loaderService.startLoading();
        this.authService
            .signIn(this.signInFormGroup.controls['emailAddress'].value, this.signInFormGroup.controls['password'].value)
            .subscribe(
                successful => {
                    if (successful)
                        this.router.navigateByUrl("/secure").then(() => this.loaderService.stopLoading());
                    else
                        this.loaderService.stopLoading();
                });
    }

    onGoogleSignIn() {
        window.location.href = this.googleSignInUrl;
    }

}