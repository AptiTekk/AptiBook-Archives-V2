/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {ResourceCategory} from "./resource-category.model";
import {UserGroup} from "./user-group.model";
export interface Resource {
    id?: number;
    name?: string;
    needsApproval?: boolean;
    hasImage?: boolean;
    reservations?: any[];
    resourceCategory?: ResourceCategory;
    owner?: UserGroup;
}