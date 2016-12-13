import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Observable} from "rxjs";
import {User} from "../../models/user.model";
import {Reservation} from "../../models/reservation.model";
import * as moment from 'moment';

@Injectable()
export class ReservationService {

    constructor(private apiService: APIService) {
    }

    public getUpcomingUserReservations(user: User): Observable<Reservation[]> {
        return Observable.create(listener => {
            if (user == undefined)
                listener.next(undefined);
            else
                this.apiService.get("reservations/user/" + user.id + "?start=" + moment().utc().format("YYYY-MM-DDTHH:mm:ss")).subscribe(
                    response => listener.next(<Reservation[]>response),
                    err => listener.next(undefined)
                )
        });
    }

    public makeReservation(reservation: Reservation): Observable<Reservation[]> {
        return Observable.create(listener => {
                let body = JSON.stringify(reservation);
                this.apiService.post("/makeReservation", body).subscribe(
                    response => listener.next(<Reservation>response),
                    err => listener.next(undefined)
                );

        });
    }

}