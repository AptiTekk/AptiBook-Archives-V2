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

    RESERVATION_APPROVED: NotificationToggles,
    RESERVATION_REQUEST_AUTO_APPROVED: NotificationToggles,
    RESERVATION_CANCELLED_USER: NotificationToggles,
    RESERVATION_REJECTED: NotificationToggles,
    RESERVATION_REQUESTED: NotificationToggles,
    RESERVATION_CANCELLED_USER_GROUPS: NotificationToggles,
    APPROVAL_REQUEST: NotificationToggles

}