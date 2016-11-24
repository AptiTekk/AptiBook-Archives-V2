import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Observable, Notification} from "rxjs";
import {User} from "../../models/user.model";
import {Reservation} from "../../models/reservation.model";
import {UnreadNotification} from "../../models/notification.model";
import * as moment from 'moment';

@Injectable()
export class NotificationService {

    constructor(private apiService: APIService) {
    }

    public getNotifications(user: User): Observable<UnreadNotification[]>{
        console.log("method called");
        return Observable.create(listener =>{
            if(user == undefined)
                listener.next(undefined);
            else
                console.log("calling GET")
                this.apiService.get("notifications/user/" + user.id).subscribe(
                    response => listener.next(<UnreadNotification[]> response),
                    err => listener.next(undefined)
                )
        });
    }
}