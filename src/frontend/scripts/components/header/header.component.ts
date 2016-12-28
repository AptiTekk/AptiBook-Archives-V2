import {Component, Input, OnInit} from "@angular/core";
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


export class HeaderComponent implements OnInit {

    @Input() protected nonInteractive: boolean;

    protected user: User;
    protected unreadNotifications: Notification[] = [];

    public static RESERVATION_MANAGEMENT_LINKS: [{icon: string, label: string, path: string[]}] = [
        {icon: 'hourglass-half', label: 'Pending', path: ['', 'secure', 'management', 'pending']},
        {icon: 'calendar-check-o', label: 'Approved', path: ['', 'secure', 'management', 'approved']},
        {icon: 'calendar-times-o', label: 'Rejected', path: ['', 'secure', 'management', 'rejected']},
        {icon: 'calendar', label: 'Calendar', path: ['', 'secure', 'management', 'calendar']}
    ];

    public static CONFIGURATION_LINKS: [{icon: string, label: string, path: string[]}] = [
        {icon: 'tags', label: 'Resources', path: ['', 'secure', 'configuration', 'resources']},
        {icon: 'user', label: 'Users', path: ['', 'secure', 'configuration', 'users']},
        {icon: 'unlock', label: 'Permissions', path: ['', 'secure', 'configuration', 'permissions']},
        {icon: 'cog', label: 'Properties', path: ['', 'secure', 'configuration', 'properties']}
    ];

    constructor(private router: Router,
                private authService: AuthService,
                private  notificationService: NotificationService) {
    }

    ngOnInit(): void {
        this.authService.getUser().subscribe(user => {
            if (user) {
                this.user = user;
                this.notificationService.getUnreadNotifications().subscribe(unreadNotifications => {
                    this.unreadNotifications = unreadNotifications;
                });
            }
        });
    }

    //noinspection JSMethodCanBeStatic
    get reservationManagementLinks() {
        return HeaderComponent.RESERVATION_MANAGEMENT_LINKS;
    }

    //noinspection JSMethodCanBeStatic
    get configurationLinks() {
        return HeaderComponent.CONFIGURATION_LINKS;
    }

    onSignOut() {
        this.authService.signOut().subscribe(
            (value: boolean) => {
                if (value)
                    this.router.navigate(['sign-in']);
                else
                    console.log("Could not sign out!")
            });
    }

}