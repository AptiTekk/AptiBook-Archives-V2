import {Component} from "@angular/core";

@Component({
    selector: 'sign-in',
    templateUrl: 'sign-in.component.html'
})
export class SignInComponent {

    alertMessage: string;

    emailAddress: string;
    password: string;

    constructor() {
        this.emailAddress = "";
        this.password = "";
    }

    onSubmit() {
        console.log("Submitted: " + this.emailAddress + " - " + this.password);
    }

}