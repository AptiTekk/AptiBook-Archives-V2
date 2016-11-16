import {Component} from "@angular/core";
import {AuthService} from "../../../../services/auth.service";
import {User} from "../../../../domain/user";

@Component({
    selector: 'my-account',
    templateUrl: 'account-page.component.html'
})
export class AccountPageComponent {

    user: User;

    constructor(private authService: AuthService) {
        authService.reloadUser();
        authService.getUser().subscribe(user => this.user = user);
    }

    onAccountDetailsSubmit() {

    }

}