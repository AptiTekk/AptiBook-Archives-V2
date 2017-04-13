/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Permission} from "../../../../models/permissions/permission.model";
export interface PermissionDetails {

    name: string;

    description: string;

    permission: Permission;

}