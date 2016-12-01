import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Observable, Notification} from "rxjs";
import {User} from "../../models/user.model";
import {Reservation} from "../../models/reservation.model";
import {UnreadNotification} from "../../models/notification.model";
import * as moment from 'moment';
import {ReplaySubject} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable()
export class NotificationService {

    private user: User;
    private unreadNotifications: ReplaySubject<UnreadNotification[]> = new ReplaySubject<UnreadNotification[]>(1);


    constructor(private apiService: APIService, private authService: AuthService) {
        this.authService.getUser().subscribe(user =>{
            if(user != undefined){
                this.user = user;
                console.log("reloaded notifications");
            }else{console.log("soon");}
        });
        this.reloadNotifications();
    }

    getUnreadNotifications():ReplaySubject<UnreadNotification[]>{
        return this.unreadNotifications;
    }


    reloadNotifications(): void {
        this.apiService.get("notifications/user/" + this.user.id).subscribe(
            response => this.unreadNotifications.next(<UnreadNotification[]> response),
            err => this.unreadNotifications.next(undefined)
        )
    }


    public getNotifications(user: User): Observable<UnreadNotification[]> {
        console.log("method called");
        return Observable.create(listener => {
            if (user == undefined) {
                listener.next(undefined);
            }
            else{
            this.apiService.get("notifications/user/" + user.id).subscribe(
                response => listener.next(<UnreadNotification[]> response),
                err => listener.next(undefined)
            )
        }});

    }

    public markAllRead(user: User): Observable<UnreadNotification[]>{
        console.log("Got to markAll() in notification service");
        return Observable.create(listener =>{
            console.log("errors");
            if(user == undefined) {
                console.log("error");
                listener.next(undefined);

            }
            else{
                this.apiService.patch("markall/user/" + user.id, true).subscribe(
                    response => listener.next(<UnreadNotification[]> response),
                    err => listener.next(undefined)
                );
            }
        });
    }

}