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
    reservationManagementLinks: [{icon: string, label: string, path: string}] = [
        {icon: 'hourglass-half', label: 'Pending', path: 'pending'},
        {icon: 'calendar-check-o', label: 'Approved', path: 'approved'},
        {icon: 'calendar-times-o', label: 'Rejected', path: 'rejected'},
        {icon: 'calendar', label: 'Calendar', path: 'calendar'}
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