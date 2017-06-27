/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {ReplaySubject} from "rxjs";
import {User} from "../../models/user.model";
import {Reservation} from "../../models/reservation/reservation.model";
import * as moment from "moment";

@Injectable()
export class ReservationService {

    private lastReservationMade: ReplaySubject<Reservation> = new ReplaySubject<Reservation>(1);

    constructor(private apiService: APIService) {
    }

    /**
     * TODO JAVADOCS
     * @param user
     * @returns {any}
     */
    public getUpcomingUserReservations(user: User): Promise<Reservation[]> {
        return new Promise((resolve, reject) => {
            this.apiService.get("reservations/user/" + user.id + "?start=" + moment().utc().format("YYYY-MM-DDTHH:mm:ss"))
                .then(response => resolve(response))
                .catch(err => reject(err))
        });
    }

    /**
     * TODO JAVADOCS
     * @param approved
     * @param reservation
     * @returns {Promise<T>}
     */
    public makeReservationDecision(approved: boolean, reservation: Reservation): Promise<any> {
        return new Promise((resolve, reject) => {
            this.apiService.patch("reservations/" + reservation.id + (approved ? "/approved" : "/rejected"))
                .then(response => resolve())
                .catch(err => reject(err))
        });

    }

    /**
     * TODO JAVADOCS
     * @param reservation
     * @returns {any}
     */
    public makeReservation(reservation: Reservation): Promise<Reservation> {
        return new Promise((resolve, reject) => {
            this.apiService.post("reservations/user/" + reservation.user.id, reservation)
                .then(response => {
                    let reservation: Reservation = response
                    this.lastReservationMade.next(reservation)
                    resolve(reservation)
                })
                .catch(err => reject(err))
        });
    }

    getLastReservationMade(): ReplaySubject<Reservation> {
        return this.lastReservationMade;
    }

}