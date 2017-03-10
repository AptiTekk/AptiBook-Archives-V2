/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {UserGroup} from "../user-group.model";
import {ReservationDecision} from "./reservation-decision.model";

/**
 * Information about a single "row" within the decision hierarchy.
 */
export interface DecisionHierarchyRelation {

    /**
     * The associated user group.
     */
    userGroup?: UserGroup;

    /**
     * The decision made, if any.
     */
    decision?: ReservationDecision;

    /**
     * The relation that overrides this, if any.
     */
    overriddenBy?: DecisionHierarchyRelation;

}