import {Component, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {LoaderComponent} from "../../../components/loader/loader.component";
import {OAuthService} from "../../../services/oauth.service";

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

    constructor(private router: Router, private oAuthService: OAuthService) {
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
        console.log("Submitted: " + this.emailAddress + " - " + this.password);
        this.loader.setDisplayed(true);
        this.router.navigateByUrl("/secure");
    }

    onGoogleSignIn() {
        window.location.href = this.googleSignInUrl;
    }

}