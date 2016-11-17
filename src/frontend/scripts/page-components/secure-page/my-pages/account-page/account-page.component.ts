import {Component} from "@angular/core";
import {AuthService} from "../../../../services/auth.service";
import {User} from "../../../../models/user.model";
import {UserService} from "../../../../services/user.service";
import {isNullOrUndefined} from "util";

@Component({
    selector: 'my-account',
    templateUrl: 'account-page.component.html'
})
export class AccountPageComponent {

    successMessage: string;
    passwordSuccessMessage: string;
    alertMessage: string;
    user: User;

    constructor(private authService: AuthService, private userService: UserService) {
        authService.reloadUser();
        authService.getUser().subscribe(user => this.user = user);
    }

    doPasswordsMatch(): boolean {
        return this.user.newPassword == undefined || this.user.confirmPassword == undefined || this.user.newPassword === this.user.confirmPassword;
    }

    onAccountDetailsSubmit() {
        if (!isNullOrUndefined(this.user.newPassword) && this.user.newPassword.length == 0)
            this.user.newPassword = undefined;

        this.userService.patchUser(this.user).take(1).subscribe((value: boolean) => {
            if (value) {
                this.authService.reloadUser();
                this.successMessage = "Personal Information updated successfully.";
                if (!isNullOrUndefined(this.user.newPassword))
                    this.passwordSuccessMessage = "Password updated successfully.";
                else
                    this.passwordSuccessMessage = undefined;
                this.alertMessage = undefined;
            }
            else {
                this.successMessage = undefined;
                this.alertMessage = "Unfortunately, we could not update your Account Settings.";
                this.passwordSuccessMessage = undefined;
            }
        })
    }

}