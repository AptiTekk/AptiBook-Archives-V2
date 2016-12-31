import {Component, ViewChild, OnInit} from "@angular/core";
import {AuthService} from "../../../../services/singleton/auth.service";
import {User} from "../../../../models/user.model";
import {UserService} from "../../../../services/singleton/user.service";
import {AlertComponent} from "../../../../components/alert/alert.component";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";

@Component({
    selector: 'my-account-page',
    templateUrl: 'account-page.component.html'
})
export class AccountPageComponent implements OnInit {

    @ViewChild('errorAlert')
    errorAlert: AlertComponent;

    @ViewChild('personalInfoAlert')
    personalInfoAlert: AlertComponent;

    @ViewChild('passwordsInfoAlert')
    passwordsInfoAlert: AlertComponent;

    user: User;

    personalInformation: FormGroup;

    constructor(private authService: AuthService,
                private formBuilder: FormBuilder,
                private userService: UserService) {
    }

    ngOnInit(): void {
        this.authService.reloadUser();
        this.authService.getUser().take(1).subscribe(user => {
            this.user = user;

            this.personalInformation = this.formBuilder.group({
                firstName: [this.user.firstName, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
                lastName: [this.user.lastName, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
                phoneNumber: [this.user.phoneNumber, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
                location: [this.user.location, Validators.compose([Validators.maxLength(250), Validators.pattern("[^<>;=]*")])]
            });
        });
    }

    onPersonalInformationSubmit(changingPassword: boolean = false) {
        this.user.firstName = this.personalInformation.controls['firstName'].value;
        this.user.lastName = this.personalInformation.controls['lastName'].value;
        this.user.phoneNumber = this.personalInformation.controls['phoneNumber'].value;
        this.user.location = this.personalInformation.controls['location'].value;

        this.userService.patchUser(this.user, changingPassword).take(1).subscribe((value: boolean) => {
            if (value) {
                this.authService.reloadUser();
                if (!changingPassword)
                    this.personalInfoAlert.display("Personal Information updated successfully.");
                else
                    this.passwordsInfoAlert.display("Password updated successfully.");
            }
            else {
                this.errorAlert.display("Unfortunately, we could not update your Account Settings.");
            }
        })
    }

    onChangePasswordSubmit() {
        this.onPersonalInformationSubmit(true);
    }

    doPasswordsMatch(): boolean {
        if (!this.user.newPassword)
            if (!this.user.confirmPassword)
                return true;

        return this.user.newPassword === this.user.confirmPassword;
    }

}