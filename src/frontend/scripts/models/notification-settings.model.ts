/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NotificationToggles} from "./notification-toggles.model";
/**
 * All the different types of Notifications and their associated toggles.
 */
export interface NotificationSettings {

    "TYPE_RESERVATION_APPROVED": NotificationToggles,
    "TYPE_RESERVATION_REQUEST_AUTO_APPROVED": NotificationToggles,
    "TYPE_RESERVATION_CANCELLED_USER": NotificationToggles,
    "TYPE_RESERVATION_REJECTED": NotificationToggles,
    "TYPE_RESERVATION_REQUESTED": NotificationToggles,
    "TYPE_RESERVATION_CANCELLED_USER_GROUPS": NotificationToggles,
    "TYPE_APPROVAL_REQUEST": NotificationToggles

}