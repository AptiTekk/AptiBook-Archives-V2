import {Component, ViewChild} from "@angular/core";
import {AuthService} from "../../../../services/singleton/auth.service";
import {User} from "../../../../models/user.model";
import {UserService} from "../../../../services/singleton/user.service";
import {isNullOrUndefined} from "util";
import {UserGroup} from "../../../../models/user-group.model";
import {UserGroupService} from "../../../../services/singleton/usergroup.service";
import {AlertComponent} from "../../../../components/alert/alert.component";

@Component({
    selector: 'my-account-page',
    templateUrl: 'account-page.component.html'
})
export class AccountPageComponent {

    @ViewChild('errorAlert')
    errorAlert: AlertComponent;

    @ViewChild('personalInfoAlert')
    personalInfoAlert: AlertComponent;

    @ViewChild('passwordsInfoAlert')
    passwordsInfoAlert: AlertComponent;

    user: User;

    rootUserGroup: UserGroup;

    constructor(private authService: AuthService, private userService: UserService, private userGroupService: UserGroupService) {
        authService.reloadUser();
        authService.getUser().subscribe(user => this.user = user);
        userGroupService.getRootUserGroup().subscribe(userGroup => this.rootUserGroup = userGroup);
    }

    doPasswordsMatch(): boolean {
        return this.user.newPassword === this.user.confirmPassword;
    }

    onAccountDetailsSubmit() {
        if (!isNullOrUndefined(this.user.newPassword) && this.user.newPassword.length == 0)
            this.user.newPassword = undefined;

        this.userService.patchUser(this.user).take(1).subscribe((value: boolean) => {
            if (value) {
                this.authService.reloadUser();
                this.personalInfoAlert.display("Personal Information updated successfully.");
                if (!isNullOrUndefined(this.user.newPassword)) {
                    this.passwordsInfoAlert.display("Password updated successfully.");
                }
            }
            else {
                this.errorAlert.display("Unfortunately, we could not update your Account Settings.");
            }
        })
    }

}