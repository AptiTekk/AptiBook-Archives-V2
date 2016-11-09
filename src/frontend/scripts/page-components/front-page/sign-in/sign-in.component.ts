import {Component, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {LoaderComponent} from "../../../components/loader/loader.component";

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

    constructor(private router: Router) {
        this.emailAddress = "";
        this.password = "";
    }

    onSubmit() {
        console.log("Submitted: " + this.emailAddress + " - " + this.password);
        this.loader.setDisplayed(true);
        this.router.navigateByUrl("/secure");
    }

}