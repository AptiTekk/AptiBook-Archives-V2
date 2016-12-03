import {Component, Input, Pipe} from "@angular/core";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/singleton/auth.service";
import {Router} from "@angular/router";
import * as Rx from 'rxjs/Rx';
import {NotificationService} from "../../services/singleton/notification.service";
import {UnreadNotification} from "../../models/notification.model";
import {Notification} from "rxjs";
import {variable} from "@angular/compiler/src/output/output_ast";

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})


export class HeaderComponent {

    @Input()
    nonInteractive: boolean;

    user: User;
    unreadNotifications: UnreadNotification[] = [];

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