/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {User} from "../user.model";
import {UserGroup} from "../user-group.model";
export interface UserPermissionAssignments {

    GENERAL_FULL_PERMISSIONS: User[],
    RESOURCE_CATEGORIES_MODIFY_ALL: User[],
    RESOURCES_MODIFY_OWN: User[],
    RESOURCES_MODIFY_HIERARCHY: User[],
    RESOURCES_MODIFY_ALL: User[],
    RESERVATIONS_MODIFY_ALL: User[],
    USERS_MODIFY_ALL: User[],
    GROUPS_MODIFY_ALL: User[],
    PERMISSIONS_MODIFY_ALL: User[],
    PROPERTIES_MODIFY_ALL: User[];

}

export interface UserGroupPermissionAssignments {

    GENERAL_FULL_PERMISSIONS: UserGroup[],
    RESOURCE_CATEGORIES_MODIFY_ALL: UserGroup[],
    RESOURCES_MODIFY_OWN: UserGroup[],
    RESOURCES_MODIFY_HIERARCHY: UserGroup[],
    RESOURCES_MODIFY_ALL: UserGroup[],
    RESERVATIONS_MODIFY_ALL: UserGroup[],
    USERS_MODIFY_ALL: UserGroup[],
    GROUPS_MODIFY_ALL: UserGroup[],
    PERMISSIONS_MODIFY_ALL: UserGroup[],
    PROPERTIES_MODIFY_ALL: UserGroup[];

}