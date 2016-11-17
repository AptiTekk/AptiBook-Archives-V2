import {Component} from "@angular/core";
import {AuthService} from "../../../../services/auth.service";
import {User} from "../../../../domain/user";
import {UserService} from "../../../../services/user.service";

@Component({
    selector: 'my-account',
    templateUrl: 'account-page.component.html'
})
export class AccountPageComponent {

    successMessage: string;
    alertMessage: string;
    user: User;

    constructor(private authService: AuthService, private userService: UserService) {
        authService.reloadUser();
        authService.getUser().subscribe(user => this.user = user);
    }

    onAccountDetailsSubmit() {
        this.userService.patchUser(this.user).take(1).subscribe((value: boolean) => {
            if (value) {
                this.authService.reloadUser();
                this.successMessage = "Personal Information updated successfully.";
                this.alertMessage = undefined;
            }
            else {
                this.successMessage = undefined;
                this.alertMessage = "Unfortunately, we could not update your Account Settings.";
            }
        })
    }

}