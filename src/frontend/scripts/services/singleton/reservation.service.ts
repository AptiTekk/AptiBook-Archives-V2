import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Observable, ReplaySubject} from "rxjs";
import {User} from "../../models/user.model";
import {Reservation} from "../../models/reservation.model";
import * as moment from "moment";
import {ResourceCategory} from "../../models/resource-category.model";
import {ReservationDetails} from "../../models/reservation-details.model";
import {Response} from "@angular/http";

@Injectable()
export class ReservationService {

    private lastReservationMade: ReplaySubject<Reservation> = new ReplaySubject<Reservation>(1);

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

    public makeReservation(reservation: Reservation): Observable<Reservation> {
        return Observable.create(listener => {
            let body = JSON.stringify(reservation);
            this.apiService.post("reservations/user/" + reservation.user.id, body).subscribe(
                response => {
                    let reservation: Reservation = <Reservation>response;
                    listener.next(reservation);
                    this.lastReservationMade.next(reservation)
                },
                err => listener.next(undefined)
            );

        });
    }


    public getPendingReservationDetails(user: User): Observable<ReservationDetails[]> {
        return Observable.create(listener => {
            if (user == undefined) {
                listener.next(undefined);
                console.log("user is error")
            }
            else {
                this.apiService.get("reservations/pending/details/user/" + user.id).subscribe(
                    response => {
                        listener.next(<ReservationDetails[]>response);
                        console.log("no error in service");
                    },
                    err => {
                        console.log("error in service");
                        listener.next(undefined)
                    }
                );
                console.log("user is fine");
            }
        });
    }


    public getPendingReservationCategories(user: User): Observable<ResourceCategory[]> {
        return Observable.create(listener => {
            if (user == undefined) {
                listener.next(undefined);
                console.log("user is error")
            }
            else {
                this.apiService.get("reservations/pending/categories/user/" + user.id).subscribe(
                    response => {
                        listener.next(<ResourceCategory[]>response);
                        console.log("no error in service");
                    },
                    err => {
                        console.log("error in service");
                        listener.next(undefined)
                    }
                );
                console.log("user is fine");
            }
        });
    }


    getLastReservationMade(): ReplaySubject<Reservation> {
        return this.lastReservationMade;
    }

}