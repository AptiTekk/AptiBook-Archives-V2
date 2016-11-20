import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Observable} from "rxjs";
import {User} from "../../models/user.model";
import {Reservation} from "../../models/reservation.model";
import {DatePipe} from "@angular/common";

@Injectable()
export class ReservationService {

    constructor(private apiService: APIService) {
    }

    public getUpcomingUserReservations(user: User): Observable<Reservation[]> {
        return Observable.create(listener => {
            if (user == undefined)
                listener.next(undefined);
            else
                this.apiService.get("reservations/user/" + user.id + "?start=" + new DatePipe("en-us").transform(new Date(), "yyyy-MM-ddThh:mm:ss")).subscribe(
                    response => listener.next(<Reservation[]>response),
                    err => listener.next(undefined)
                )
        });
    }

}