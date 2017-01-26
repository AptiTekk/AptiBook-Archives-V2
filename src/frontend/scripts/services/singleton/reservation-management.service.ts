/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {ReservationWithDecisions, Reservation} from "../../models/reservation.model";
import {Observable, ReplaySubject} from "rxjs";
import {UserGroup, UserGroupWithDecision} from "../../models/user-group.model";
import {ReservationDecision} from "../../models/reservation-decision.model";
import {UserGroupService} from "./usergroup.service";
import {User} from "../../models/user.model";
import PriorityQueue from "typescript-collections/dist/lib/PriorityQueue";

/**
 * This class contains logic needed for the reservation management page;
 * including getting pending/approved/rejected reservations, getting decisions, and making decisions.
 */
@Injectable()
export class ReservationManagementService {

    private rootUserGroup: UserGroup;
    private pendingReservations = new ReplaySubject<ReservationWithDecisions[]>(1);
    private approvedReservations = new ReplaySubject<ReservationWithDecisions[]>(1);
    private rejectedReservations = new ReplaySubject<ReservationWithDecisions[]>(1);

    constructor(private apiService: APIService,
                private userGroupService: UserGroupService) {
        this.fetchUserGroups().subscribe(
            success => {
                this.fetchReservations();
            });
    }

    private fetchUserGroups(): Observable<boolean> {
        return Observable.create(listener => {
            this.userGroupService
                .getRootUserGroup()
                .subscribe(
                    rootGroup => {
                        this.rootUserGroup = rootGroup;
                        listener.next(true);
                    },
                    err => {
                        this.rootUserGroup = undefined;
                        listener.next(false);
                    }
                )
        })
    }

    fetchReservations(): void {
        this.apiService
            .get("reservations/pending")
            .take(1)
            .subscribe((reservations: ReservationWithDecisions[]) => {
                this.organizeReservations(reservations);
                this.pendingReservations.next(reservations);
            });
        this.apiService
            .get("reservations/approved")
            .take(1)
            .subscribe((reservations: ReservationWithDecisions[]) => {
                this.organizeReservations(reservations);
                this.approvedReservations.next(reservations);
            });
        this.apiService
            .get("reservations/rejected")
            .take(1)
            .subscribe((reservations: ReservationWithDecisions[]) => {
                this.organizeReservations(reservations);
                this.rejectedReservations.next(reservations);
            });
    }

    getPendingReservations(): ReplaySubject<ReservationWithDecisions[]> {
        return this.pendingReservations;
    }

    getApprovedReservations(): ReplaySubject<ReservationWithDecisions[]> {
        return this.approvedReservations;
    }

    getRejectedReservations(): ReplaySubject<ReservationWithDecisions[]> {
        return this.rejectedReservations;
    }

    /**
     * Organizes the decisions of the hierarchies of the passed in reservations.
     * Determines who overrides who, which decisions belong to which groups, etc.
     * @param reservations The reservations to organize.
     */
    private organizeReservations(reservations: ReservationWithDecisions[]) {
        reservations.forEach(reservation => {
            // Start by cloning the root group. (Instead of making a bunch of unnecessary requests)
            let rootGroup: UserGroupWithDecision = jQuery.extend(true, {}, this.rootUserGroup);

            // Add a queue. We will traverse down the tree.
            let userGroupTraversalQueue = new PriorityQueue<UserGroupWithDecision>();
            userGroupTraversalQueue.add(rootGroup);

            // Traverse down the tree until we find the owner of the reservation's resource.
            let currentGroup: UserGroupWithDecision;
            let ownerGroup: UserGroupWithDecision;
            while ((currentGroup = userGroupTraversalQueue.dequeue())) {
                if (reservation.resource.owner.id === currentGroup.id) {
                    ownerGroup = currentGroup;
                    break;
                }

                if (currentGroup.children) {
                    for (let childGroup of currentGroup.children) {
                        userGroupTraversalQueue.add(childGroup);
                        childGroup.parent = currentGroup;
                    }
                }
            }

            // The owner should have been found.
            if (!ownerGroup) {
                console.error("Could not find owner of reservation resource; cannot organize decisions.");
            } else {

                // Now, make a list of the user groups in the branch that the owner group is in,
                // starting from the owner group and working UP. (Hierarchy Up)
                let userGroupsOfReservation: UserGroupWithDecision[] = [ownerGroup];
                currentGroup = ownerGroup;
                while ((currentGroup = currentGroup.parent)) {
                    userGroupsOfReservation.push(currentGroup);
                }

                // Take the Decisions, and assign them to the correct User Groups.
                reservation.decisions.forEach(decision => {
                    userGroupsOfReservation.forEach(userGroup => {
                        if (decision.userGroup.id == userGroup.id) {
                            userGroup.decision = decision;
                        }
                    });
                });

                // It's time to figure out who overrides who!
                // We start at the top and work our way down.
                for (let i = userGroupsOfReservation.length - 1; i >= 0; i--) {
                    let thisGroup = userGroupsOfReservation[i];
                    let upperGroup = userGroupsOfReservation[i + 1];

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

                // We will reverse the array so that it shows up in the correct order on the web-page.
                reservation.hierarchy = userGroupsOfReservation.reverse();
            }
        });
    }

    /**
     * Makes a decision on the provided reservation.
     * @param approved If the decision is an approval or a rejection.
     * @param reservation The reservation deciding upon.
     * @returns The decision that was made, or undefined if one could not be made.
     */
    makeDecision(approved: boolean, reservation: Reservation): Observable<ReservationDecision> {
        return Observable.create(listener => {
            if (!reservation)
                listener.next(undefined);
            else
                this.apiService
                    .patch("/reservations/" + reservation.id + "/decide", approved)
                    .subscribe(
                        decision => listener.next(decision),
                        err => listener.next(undefined)
                    )
        });
    }

}