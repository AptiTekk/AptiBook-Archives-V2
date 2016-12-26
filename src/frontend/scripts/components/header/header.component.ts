import {Component, Input} from "@angular/core";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/singleton/auth.service";
import {Router} from "@angular/router";
import {NotificationService} from "../../services/singleton/notification.service";
import {Notification} from "../../models/notification.model";

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})


export class HeaderComponent {

    @Input()
    nonInteractive: boolean;

    user: User;
    unreadNotifications: Notification[] = [];

    //TODO: Add route urls
    reservationManagementLinks: [{icon: string, label: string}] = [
        {icon: 'hourglass-half', label: 'Pending'},
        {icon: 'calendar-check-o', label: 'Approved'},
        {icon: 'calendar-times-o', label: 'Rejected'},
        {icon: 'calendar', label: 'Calendar'}
    ];

    //TODO: Add route urls and permissions
    configurationLinks: [{label: string, path: string, icon: string, indented: boolean}] = [
        {label: 'Resources', path: 'resources', icon: 'tags', indented: false},
        {label: 'User Groups', path: 'userGroups', icon: 'sitemap', indented: false},
        {label: 'Users', path: 'users', icon: 'user', indented: true},
        {label: 'Permissions', path: 'permissions', icon: 'unlock', indented: false},
        {label: 'Properties', path: 'properties', icon: 'cog', indented: false}
    ];

    constructor(private router: Router, private authService: AuthService, private  notificationService: NotificationService) {
        authService.getUser().subscribe(user => {
            if (user != undefined) {
                this.user = user;
                this.notificationService.getUnreadNotifications().subscribe(unreadNotifications => {
                    this.unreadNotifications = unreadNotifications;
                });
            }
        });
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