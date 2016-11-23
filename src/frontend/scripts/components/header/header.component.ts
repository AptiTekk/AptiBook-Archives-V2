import {Component, Input} from "@angular/core";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/singleton/auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})
export class HeaderComponent {

    @Input()
    nonInteractive: boolean;

    //TODO: Add route urls
    reservationManagementLinks: [{icon: string, label: string}] = [
        {icon: 'hourglass-half', label: 'Pending'},
        {icon: 'calendar-check-o', label: 'Approved'},
        {icon: 'calendar-times-o', label: 'Rejected'},
        {icon: 'calendar', label: 'Calendar'}
    ];

    //TODO: Add route urls and permissions
    configurationLinks: [{icon: string, label: string, indented: boolean}] = [
        {icon: 'folder-open', label: 'Resource Categories', indented: false},
        {icon: 'tags', label: 'Resources', indented: true},
        {icon: 'sitemap', label: 'User Groups', indented: false},
        {icon: 'user', label: 'Users', indented: true},
        {icon: 'unlock', label: 'Permissions', indented: false},
        {icon: 'cog', label: 'Properties', indented: false}
    ];

    user: User;

    constructor(private router: Router, private authService: AuthService) {
        authService.getUser().subscribe(user => this.user = user);
    }

    onSignOut() {
        this.authService.signOut().subscribe(
            (value: boolean) => {
                if (value)
                    this.router.navigateByUrl("");
                else
                    console.log("Could not sign out!")
            });
    }

}