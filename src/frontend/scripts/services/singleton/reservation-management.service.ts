/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {ReservationWithDecisions} from "../../models/reservation.model";
import {Observable, ReplaySubject} from "rxjs";
import {UserGroupWithDecision} from "../../models/user-group.model";
import {ReservationDecision} from "../../models/reservation-decision.model";
import {ReservationService} from "./reservation.service";
import {UserGroupService} from "./usergroup.service";

@Injectable()
export class ReservationManagementService {

    private pendingReservations = new ReplaySubject<ReservationWithDecisions[]>(1);

    constructor(private apiService: APIService,
                private reservationService: ReservationService,
                private userGroupService: UserGroupService) {
        this.fetchPendingReservations();
    }

    fetchPendingReservations(): void {
        this.reservationService
            .getPendingReservations()
            .subscribe((reservations: ReservationWithDecisions[]) => {
                this.organizeReservations(reservations);
                this.pendingReservations.next(reservations);
            });
    }

    getPendingReservations(): ReplaySubject<ReservationWithDecisions[]> {
        return this.pendingReservations;
    }

    private organizeReservations(reservations: ReservationWithDecisions[]) {
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
    }

}