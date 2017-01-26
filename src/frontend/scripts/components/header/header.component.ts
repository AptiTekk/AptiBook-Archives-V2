import {Component, Input, OnInit} from "@angular/core";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/singleton/auth.service";
import {Router} from "@angular/router";
import {NotificationService} from "../../services/singleton/notification.service";
import {Notification} from "../../models/notification.model";
import {NavigationLink} from "../navigation/navigation-link.model";

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})

export class HeaderComponent implements OnInit {

    protected user: User;
    protected unreadNotifications: Notification[] = [];

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

    onSignOut() {
        this.authService.signOut().subscribe(
            (value: boolean) => {
                if (value)
                    this.router.navigate(['', 'sign-in']);
                else
                    console.log("Could not sign out!")
            });
    }

}