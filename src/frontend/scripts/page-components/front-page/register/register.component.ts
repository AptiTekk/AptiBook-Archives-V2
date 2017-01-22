import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {OAuthService} from "../../../services/stateful/oauth.service";
import {AuthService} from "../../../services/singleton/auth.service";
import {LoaderService} from "../../../services/singleton/loader.service";
import {RegistrationService} from "../../../services/singleton/registration.service";

@Component({
    selector: 'register',
    templateUrl: 'register.component.html'
})
export class RegisterComponent {

    formGroup: FormGroup;

    constructor(formBuilder: FormBuilder,
                private router: Router,
                private activeRoute: ActivatedRoute,
                private oAuthService: OAuthService,
                private authService: AuthService,
                private loaderService: LoaderService,
                private registrationService: RegistrationService) {

        this.formGroup = formBuilder.group({
            emailAddress: [null, Validators.compose([Validators.required, Validators.maxLength(100), Validators.pattern("[^<>;=]*")])],
            firstName: [null, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
            lastName: [null, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
            password: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
            confirmPassword: [null, Validators.compose([Validators.required, Validators.maxLength(50)])]
        });

    }

    onSubmit() {
        console.log("Submitted.");
        this.loaderService.startLoading();
        this.registrationService.register(this.formGroup.controls['emailAddress'].value, this.formGroup.controls['firstName'].value, this.formGroup.controls['lastName'].value,
            this.formGroup.controls['password'].value, this.formGroup.controls['confirmPassword'].value).subscribe(response => {
            if (response) {
                this.authService.reloadUser();
                this.router.navigateByUrl("/secure").then(() => this.loaderService.stopLoading());
            } else {
                this.loaderService.startLoading();
            }
        });
    }

}