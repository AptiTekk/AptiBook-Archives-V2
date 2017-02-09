/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Reservation} from "./reservation.model";
import {UserGroup} from "./user-group.model";
import {ReservationDecision} from "./reservation-decision.model";
export interface ReservationDetails{
    reservation: Reservation;
    behalfUserGroup: UserGroup;
    currentDecision: ReservationDecision;
    hierarchyDecisions: Map<UserGroup, ReservationDecision>;
    hierarchyGroups: UserGroup[];
    overridingDecisions: Map<UserGroup, ReservationDecision>;
    lowerApprovalOverrides: UserGroup[];
    lowerRejectionOverrides: UserGroup[];

}