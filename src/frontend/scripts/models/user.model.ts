/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {UserGroup} from "./user-group.model";
export interface User {
    id?: number;

    emailAddress?: string;

    firstName?: string;
    lastName?: string;
    fullName?: string;
    verified?: boolean;

    phoneNumber?: string;
    location?: string;

    notifications?: number[];
    notificationTypeSettings?;

    permissions?;
    userGroups?: UserGroup[];
    admin?: boolean;

    /**
     * New Password - not sent by server, but is accepted by server.
     */
    newPassword?: string;

    /**
     * Confirmation password - for client use only, not sent or accepted by server.
     */
    confirmPassword?: string;
}