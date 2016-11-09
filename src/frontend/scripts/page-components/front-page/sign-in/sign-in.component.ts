import {Component} from "@angular/core";
import {Router} from "@angular/router";

@Component({
    selector: 'sign-in',
    templateUrl: 'sign-in.component.html'
})
export class SignInComponent {

    alertMessage: string;

    emailAddress: string;
    password: string;

    constructor(private router: Router) {
        this.emailAddress = "";
        this.password = "";
    }

    onSubmit() {
        console.log("Submitted: " + this.emailAddress + " - " + this.password);
        this.router.navigateByUrl("/secure");
    }

}