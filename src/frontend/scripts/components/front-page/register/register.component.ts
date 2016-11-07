import {Component} from "@angular/core";

@Component({
    selector: 'register',
    template: require("./register.component.html")
})
export class RegisterComponent {

    emailAddress: string;
    firstName: string;
    lastName: string;

    password: string;
    confirmPassword: string;

    onSubmit() {
        console.log("Submitted.");
    }

}