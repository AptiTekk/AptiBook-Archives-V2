/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Resource} from "../resource.model";
import {User} from "../user.model";
import {UserGroup} from "../user-group.model";
import {ReservationDecision} from "./reservation-decision.model";
import moment = require("moment");
import Moment = moment.Moment;
import {DecisionHierarchyRelation} from "./decision-hierarchy-relation.model";

export interface Reservation {

    id?: number;

    dateCreated?: string;

    title?: string;
    status?: string;

    start?: string;
    end?: string;

    resource?: Resource;
    user?: User;
    fieldEntries?: number[];

    pending?: boolean;
    approved?: boolean;
    rejected?: boolean;
    cancelled?: boolean;
}

export interface ReservationWithUnorganizedDecisions extends Reservation {

    decisions?: ReservationDecision[];

}

export interface ReservationWithOrganizedDecisions extends Reservation {

    /**
     * The decisions made on this reservation.
     */
    decisions?: ReservationDecision[];

    /**
     * The decision hierarchy, with the uppermost group at the beginning of the array.
     */
    decisionHierarchy?: DecisionHierarchyRelation[];

    /**
     * The relation that the user is acting as a part of when making a decision.
     */
    decidingFor?: DecisionHierarchyRelation;

}