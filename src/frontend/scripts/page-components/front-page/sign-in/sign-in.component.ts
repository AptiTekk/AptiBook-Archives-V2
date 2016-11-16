import {Component, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {LoaderComponent} from "../../../components/loader/loader.component";
import {OAuthService} from "../../../services/oauth.service";
import {AuthService} from "../../../services/auth.service";

@Component({
    selector: 'sign-in',
    templateUrl: 'sign-in.component.html'
})
export class SignInComponent {

    @ViewChild('loader')
    loader: LoaderComponent;

    alertMessage: string;

    emailAddress: string;
    password: string;
    googleSignInUrl: string;

    constructor(private router: Router, private oAuthService: OAuthService, private authService: AuthService) {
        this.emailAddress = "";
        this.password = "";
        this.oAuthService.getGoogleOAuthUrl().subscribe(
            resp => {
                this.googleSignInUrl = resp.url;
            },
            err => {
                this.googleSignInUrl = undefined;
            });
    }

    onSubmit() {
        this.loader.setDisplayed(true);
        this.authService.signIn(this.emailAddress, this.password).subscribe(
            response => this.router.navigateByUrl("/secure"),
            err => {
                this.alertMessage = err.json().error;
                this.loader.setDisplayed(false);
            });
    }

    onGoogleSignIn() {
        window.location.href = this.googleSignInUrl;
    }

}