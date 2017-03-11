/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Observable, ReplaySubject} from "rxjs";
import {User} from "../../models/user.model";
import {Reservation} from "../../models/reservation/reservation.model";
import * as moment from "moment";
import {AuthService} from "./auth.service";

@Injectable()
export class ReservationService {

    private lastReservationMade: ReplaySubject<Reservation> = new ReplaySubject<Reservation>(1);

    constructor(private apiService: APIService,
                private authService: AuthService) {
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

    public makeReservationDecision(approved: boolean, reservation: Reservation): Observable<boolean> {
        return Observable.create(listener => {
            this.apiService.patch("reservations/" + reservation.id + (approved ? "/approved" : "/rejected")).subscribe(
                response => listener.next(true),
                err => listener.next(false)
            );
        });

    }

    public makeReservation(reservation: Reservation): Observable<Reservation> {
        return Observable.create(listener => {
            this.apiService.post("reservations/user/" + reservation.user.id, reservation).subscribe(
                response => {
                    let reservation: Reservation = <Reservation>response;
                    listener.next(reservation);
                    this.lastReservationMade.next(reservation)
                },
                err => listener.next(undefined)
            );

        });
    }

    getLastReservationMade(): ReplaySubject<Reservation> {
        return this.lastReservationMade;
    }

}