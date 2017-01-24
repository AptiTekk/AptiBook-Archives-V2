/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component} from '@angular/core';
import {ReservationService} from "../../../../services/singleton/reservation.service";
import {AuthService} from "../../../../services/singleton/auth.service";
import {User} from "../../../../models/user.model";
import {ReservationDetails} from "../../../../models/reservation-details.model";
import {ResourceCategory} from "../../../../models/resource-category.model";
import moment = require("moment");
import {Reservation} from "../../../../models/reservation.model";
import {ReservationDecision} from "../../../../models/reservation-decision.model";
import {UserGroup} from "../../../../models/user-group.model";
import {UserGroupService} from "../../../../services/singleton/usergroup.service";

@Component({
    selector: 'pending-page',
    templateUrl: 'pending-page.component.html'
})
export class PendingPageComponent {
    user: User;
    pendingReservations: Reservation[] = [];
    behalfUserGroup: UserGroup;
    displayCategories: ResourceCategory[] = [];
    userGroupHierarchy: UserGroup[] = [];
    lowerApprovalOverrides: UserGroup[] = [];
    lowerRejectionOverrides: UserGroup[] = [];
    reservationDecisions: ReservationDecision[][] = [];

    constructor(private userGroupService: UserGroupService, private reservationService: ReservationService, private authService: AuthService) {
        authService.getUser().subscribe(user => this.user = user);
        reservationService.getPendingReservations(this.user).subscribe(reservations => {
            this.pendingReservations = reservations;

            this.pendingReservations.forEach(reservation => {
                let hierarchyUp: UserGroup[] = [];
                this.userGroupService.getUserGroupHierarchyUp(reservation.resource.owner).subscribe(userGroups => {
                    hierarchyUp = userGroups;
                    this.reservationService.getReservationDecisions(reservation).subscribe(decisions => {

                        //figure out which groups haven't decided
                        let reservationDecisions: ReservationDecision[];
                        reservationDecisions = decisions;

                        reservationDecisions.forEach(item => {
                            hierarchyUp.forEach(userGroup => {
                                if (item.userGroup.id == userGroup.id) {
                                    userGroup['decision'] = item;
                                }
                            });
                            for (let i = 0; i < hierarchyUp.length - 1; i++) {
                                if (hierarchyUp[i + 1]['decision']) {
                                    if (!hierarchyUp[i]['decision']) {
                                        hierarchyUp[i]['overriddenBy'] = hierarchyUp[i + 1];
                                    }
                                    else if (hierarchyUp[i + 1]['decision'].approved != hierarchyUp[i]['decision'].approved) {
                                        hierarchyUp[i]['overriddenBy'] = hierarchyUp[i + 1];
                                    }
                                }
                            }
                            hierarchyUp.reverse();
                            reservation['hierarchyUp'] = hierarchyUp;
                            reservation['organizeDecisions'] = reservationDecisions;
                        });

                    })
                });
            });
        });
    }

    makeDecision(approved: boolean, reservation: Reservation) {
        this.reservationService.makeReservationDecision(approved, reservation).subscribe(response => {
            this.reservationService.getPendingReservations(this.user).subscribe(reservations => {
                this.pendingReservations = reservations;
            })
        });
    }

    formatFriendly(date: string){
        return moment(date);
    }
}

