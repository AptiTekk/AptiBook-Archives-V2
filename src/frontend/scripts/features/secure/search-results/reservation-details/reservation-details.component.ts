/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component} from "@angular/core";
import {Resource} from "../../../../models/resource.model";
import {ReservationDetailsService} from "../../../../core/services/reservation-details.service";
import {SearchService} from "../../../../core/services/search.service";
import {User} from "../../../../models/user.model";
import {AuthService} from "../../../../core/services/auth.service";
import {Reservation} from "../../../../models/reservation/reservation.model";
import {ReservationService} from "../../../../core/services/reservation.service";
import {Router} from "@angular/router";
import {APIService} from "../../../../core/services/api.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Moment = moment.Moment;
import moment = require("moment");
@Component({
    selector: 'at-search-reservation-details',
    templateUrl: 'reservation-details.component.html',
    styleUrls: ['reservation-details.component.css']
})
export class ReservationDetailsComponent {

    resource: Resource;
    start: Moment;
    end: Moment;
    user: User;

    formGroup: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private reservationDetailsService: ReservationDetailsService,
                private searchService: SearchService,
                private authService: AuthService,
                private reservationService: ReservationService,
                private router: Router) {

        this.formGroup = formBuilder.group({
            title: [null, Validators.compose([Validators.required, Validators.maxLength(100), Validators.pattern("[^<>;=]*")])]
        });

        authService.getUser().subscribe(user => {
            if (user != undefined) {
                this.user = user;
            }
        });
        this.resource = reservationDetailsService.getResource();
        searchService.getStartTime().subscribe(start => this.start = start);
        searchService.getEndTime().subscribe(end => this.end = end);
    }

    reserve() {
        let reservation: Reservation = {};
        reservation.user = {id: this.user.id};
        reservation.title = this.formGroup.controls['title'].value;
        reservation.start = this.start.toISOString();
        reservation.end = this.end.toISOString();
        reservation.resource = {id: this.resource.id};

        this.reservationService.makeReservation(reservation).subscribe(newReservation => {
            if (newReservation) {
                this.router.navigate(['', 'secure', 'search-results', 'success']);
            }
        })
    }

}