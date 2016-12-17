import {Component, ViewChild, AfterViewInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {LoaderComponent} from "../../../components/loader/loader.component";
import {OAuthService} from "../../../services/stateful/oauth.service";
import {AuthService} from "../../../services/singleton/auth.service";
import {AlertComponent} from "../../../components/alert/alert.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'sign-in',
    templateUrl: 'sign-in.component.html'
})
export class SignInComponent implements AfterViewInit {

    @ViewChild('loader')
    loader: LoaderComponent;

    @ViewChild('loginAlert')
    loginAlert: AlertComponent;

    signInFormGroup: FormGroup;

    googleSignInUrl: string;

    constructor(formBuilder: FormBuilder, private router: Router, private activeRoute: ActivatedRoute, private oAuthService: OAuthService, private authService: AuthService) {

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
                if (params['googleError'] != undefined) {
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
        this.loader.setDisplayed(true);
        this.authService.signIn(this.signInFormGroup.controls['emailAddress'].value, this.signInFormGroup.controls['password'].value).subscribe(
            (successful: boolean) => {
                if (successful)
                    this.router.navigateByUrl("/secure");
                else
                    this.loader.setDisplayed(false);
            });
    }

    onGoogleSignIn() {
        window.location.href = this.googleSignInUrl;
    }

}