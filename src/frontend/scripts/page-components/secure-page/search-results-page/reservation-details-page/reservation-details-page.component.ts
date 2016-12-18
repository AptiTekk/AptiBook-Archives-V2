import {Component} from "@angular/core";
import {Resource} from "../../../../models/resource.model";
import {ReservationDetailsService} from "../../../../services/singleton/reservation-details.service";
import {SearchService} from "../../../../services/singleton/search.service";
import {User} from "../../../../models/user.model";
import {AuthService} from "../../../../services/singleton/auth.service";
import {Reservation} from "../../../../models/reservation.model";
import {ReservationService} from "../../../../services/singleton/reservation.service";
import {Router} from "@angular/router";
import {APIService} from "../../../../services/singleton/api.service";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import Moment = moment.Moment;
import moment = require("moment");
@Component({
    selector: 'reservation-details-page',
    templateUrl: 'reservation-details-page.component.html'
})
export class ReservationDetailsComponent {

    reservation: Reservation = {
        id: null,
        dateCreated: null,
        title: null,
        status: null,
        start: null,
        end: null,
        resource: null,
        user: null,
        decisions: null,
        fieldEntries: null,
        pending: null,
        approved: null,
        rejected: null,
        cancelled: null
    };

    resource: Resource;
    start: Moment;
    end: Moment;
    user: User;

    formGroup: FormGroup;

    constructor(protected apiService: APIService,
                private formBuilder: FormBuilder,
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
        this.reservation.user = this.user;
        this.reservation.title = this.formGroup.controls['title'].value;
        this.reservation.start = this.start.toISOString();
        this.reservation.end = this.end.toISOString();
        this.reservation.resource = this.resource;

        this.reservationService.makeReservation(this.reservation).subscribe(reservation => {
            if (reservation) {
                this.router.navigateByUrl("/secure/search-results/success");
            }
        })
    }

}