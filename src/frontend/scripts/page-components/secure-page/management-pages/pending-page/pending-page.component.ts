/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, OnInit} from "@angular/core";
import {ReservationService} from "../../../../services/singleton/reservation.service";
import {AuthService} from "../../../../services/singleton/auth.service";
import {User} from "../../../../models/user.model";
import {Reservation, ReservationWithDecisions} from "../../../../models/reservation.model";
import {ReservationDecision} from "../../../../models/reservation-decision.model";
import {UserGroup, UserGroupWithDecision} from "../../../../models/user-group.model";
import {UserGroupService} from "../../../../services/singleton/usergroup.service";
import {Observable} from "rxjs";
import moment = require("moment");

@Component({
    selector: 'pending-page',
    templateUrl: 'pending-page.component.html'
})
export class PendingPageComponent implements OnInit {

    /**
     * The currently signed in user.
     */
    user: User;

    /**
     * An array containing pending reservations.
     * @type {Array}
     */
    pendingReservations: ReservationWithDecisions[] = [];

    constructor(private userGroupService: UserGroupService,
                private reservationService: ReservationService,
                private authService: AuthService) {
    }

    ngOnInit(): void {
        this.authService.getUser().subscribe(user => this.user = user);

        this.reservationService
            .getPendingReservations(this.user)
            .subscribe((reservations: ReservationWithDecisions[]) => {
                reservations.forEach(reservation => {

                    // By zipping up these Observables, we save time, as they will be fetched at the same time.
                    Observable.zip(
                        this.userGroupService.getUserGroupHierarchyUp(reservation.resource.owner).take(1),
                        this.reservationService.getReservationDecisions(reservation).take(1))
                        .subscribe(value => {

                            let userGroups: UserGroupWithDecision[] = value[0];
                            let decisions: ReservationDecision[] = value[1];

                            // Take the Decisions, and assign them to the correct User Groups.
                            decisions.forEach(decision => {
                                userGroups.forEach(userGroup => {
                                    if (decision.userGroup.id == userGroup.id) {
                                        userGroup.decision = decision;
                                    }
                                });
                            });

                            // It's time to figure out who overrides who!
                            // We start at the top and work our way down.
                            for (let i = userGroups.length - 1; i >= 0; i--) {
                                let thisGroup = userGroups[i];
                                let upperGroup = userGroups[i + 1];

                                if (upperGroup) { // If the upper group exists...
                                    if (upperGroup.overriddenBy) // If the upper group has been overridden by another group
                                        thisGroup.overriddenBy = upperGroup.overriddenBy; // then we are also overridden by that group.
                                    else if (upperGroup.decision) // If the upper group has NOT been overridden, check if the upper group has made a decision.
                                        if (!thisGroup.decision) // If they have a decision but we do NOT...
                                            thisGroup.overriddenBy = upperGroup; // ... then we are overridden by the upper group.
                                        else if (upperGroup.decision.approved
                                            != thisGroup.decision.approved)  // If we DO have a decision, and it is NOT the same as the upper group's decision...
                                            thisGroup.overriddenBy = upperGroup; // ... then we are overridden by the upper group.
                                }
                            }

                            // We will reverse the array so that it shows up in the correct order on the webpage.
                            reservation.hierarchy = userGroups.reverse();
                        });
                });

                this.pendingReservations = reservations;
            });
    }

    makeDecision(approved: boolean, reservation: Reservation) {
        this.reservationService.makeReservationDecision(approved, reservation).subscribe(response => {
            this.reservationService.getPendingReservations(this.user).subscribe(reservations => {
                this.pendingReservations = reservations;
            })
        });
    }
}

