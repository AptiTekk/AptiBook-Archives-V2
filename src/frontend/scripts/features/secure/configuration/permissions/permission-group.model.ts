/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {PermissionDetails} from "./permission-details.model";
export interface PermissionGroup {

    /**
     * The group's name, as displayed to the user.
     */
    name: string;

    /**
     * The group's API key.
     */
    key: string;

    /**
     * The group's details (descriptors)
     */
    permissions: PermissionDetails[];

}