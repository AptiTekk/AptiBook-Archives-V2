/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {User} from "./user.model";
import {ReservationDecision} from "./reservation-decision.model";

export interface UserGroup {

    id: number;

    name: string;

    root: boolean;

    users: User[];

    parent: UserGroup;

    children: UserGroup[];

}

export interface UserGroupWithDecision extends UserGroup {

    decision?: ReservationDecision;

    overriddenBy?: UserGroupWithDecision;

}