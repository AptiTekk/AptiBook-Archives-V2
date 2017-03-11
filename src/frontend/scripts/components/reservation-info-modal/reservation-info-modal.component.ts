/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, ViewChild} from "@angular/core";
import {Reservation} from "../../models/reservation/reservation.model";
import {ModalComponent} from "../modal/modal.component";
import {APIService} from "../../services/singleton/api.service";
import moment = require("moment");
import Moment = moment.Moment;

@Component({
    selector: 'reservation-info-modal',
    templateUrl: 'reservation-info-modal.component.html'
})
export class ReservationInfoModalComponent {

    @ViewChild('modal')
    modal: ModalComponent;

    reservation: Reservation;

    reservationStartMoment: Moment;
    reservationEndMoment: Moment;

    constructor(protected apiService: APIService) {
    }

    public display(reservation: Reservation) {
        this.reservation = reservation;
        this.reservationStartMoment = moment(reservation.start);
        this.reservationEndMoment = moment(reservation.end ? reservation.end : reservation.start);
        this.modal.openModal();
    }

    humanizeDifference(): string {
        return moment.duration(this.reservationEndMoment.diff(this.reservationStartMoment)).humanize();
    }

}