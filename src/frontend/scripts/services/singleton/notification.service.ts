import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Observable, Notification, ObjectUnsubscribedError} from "rxjs";
import {User} from "../../models/user.model";
import {Reservation} from "../../models/reservation.model";
import {UnreadNotification} from "../../models/notification.model";
import * as moment from 'moment';
import {isUndefined} from "util";

@Injectable()
export class NotificationService {

    constructor(private apiService: APIService) {
    }

    public getNotifications(user: User): Observable<UnreadNotification[]>{
        return Observable.create(listener =>{
            if(user == undefined)
                listener.next(undefined);
            else
                this.apiService.get("notifications/user/" + user.id).subscribe(
                    response => listener.next(<UnreadNotification[]> response),
                    err => listener.next(undefined)
                )
        });
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
                console.log("finished");
            }
        });

    }

}