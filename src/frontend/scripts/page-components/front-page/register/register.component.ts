import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {OAuthService} from "../../../services/stateful/oauth.service";
import {AuthService} from "../../../services/singleton/auth.service";
import {LoaderService} from "../../../services/singleton/loader.service";
import {RegistrationService} from "../../../services/singleton/registration.service";
import {User} from "../../../models/user.model";

@Component({
    selector: 'register',
    templateUrl: 'register.component.html'
})
export class RegisterComponent {

    formGroup: FormGroup;
    user: User = {
        id: null,
        emailAddress: null,
        firstName: null,
        lastName: null,
        fullName: null,
        verified: null,
        phoneNumber: null,
        location: null,
        notifications: null,
        notificationTypeSettings: null,
        permissions: null,
        userGroups: null,
        admin: null,
        newPassword: null,
        confirmPassword: null

};

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
        //this.loaderService.startLoading();
        this.registrationService.getRegisteredUser().take(1).subscribe(user => this.user = user);
        if(this.formGroup.controls['emailAddress'].value != this.user.emailAddress) {
            if (this.formGroup.controls['emailAddress'].value != undefined && this.formGroup.controls['firstName'].value != undefined && this.formGroup.controls['lastName'].value != undefined && this.formGroup.controls['password'].value != undefined) {
                this.user.emailAddress = this.formGroup.controls['emailAddress'].value;
                this.user.firstName = this.formGroup.controls['firstName'].value;
                this.user.lastName = this.formGroup.controls['lastName'].value;
                this.user.newPassword = this.formGroup.controls['password'].value;
                this.user.verified = false;
                this.registrationService.register(this.user).subscribe(response => {
                    if (!response.verified) {
                        //TODO:
                        // Add message stating to check email
                        // Make Email Service,
                        // Send User Id of response in an Email
                        // Read active route param for id
                        // match id with user and verified = true
                        // authenticate normally
                        // add method to match google user and normal user

                    }
                });
            }
        }


    }

}