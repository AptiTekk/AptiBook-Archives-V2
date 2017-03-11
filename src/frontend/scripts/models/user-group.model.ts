/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {User} from "./user.model";
import {ReservationDecision} from "./reservation/reservation-decision.model";
import {Resource} from "./resource.model";

export interface UserGroup {

    id?: number;

    name?: string;

    root?: boolean;

    users?: User[];

    resources?: Resource[];

    parent?: UserGroup;

    children?: UserGroup[];

}