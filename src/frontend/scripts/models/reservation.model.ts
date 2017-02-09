/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Resource} from "./resource.model";
import {User} from "./user.model";
import {UserGroupWithDecision} from "./user-group.model";
import moment = require("moment");
import Moment = moment.Moment;
import {ReservationDecision} from "./reservation-decision.model";

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

    decisions?: ReservationDecision[];

    hierarchy?: UserGroupWithDecision[];

}