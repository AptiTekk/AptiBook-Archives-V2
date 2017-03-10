/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {User} from "../user.model";
import {UserGroup} from "../user-group.model";
import {Reservation} from "./reservation.model";

export interface ReservationDecision {

    id: Number;

    user: User;

    userGroup: UserGroup;

    reservation: Reservation;

    approved: boolean;

    rejected: boolean;

    comment: String;

}