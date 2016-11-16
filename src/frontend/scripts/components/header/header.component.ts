import {Component, Input} from "@angular/core";
import {User} from "../../domain/user";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})
export class HeaderComponent {

    @Input()
    nonInteractive: boolean;

    user: User;

    constructor(private router: Router, private authService: AuthService) {
        authService.getUser().subscribe(user => this.user = user);
    }

    onSignOut() {
        this.authService.signOut().subscribe(resp => this.router.navigateByUrl(""));
    }

}