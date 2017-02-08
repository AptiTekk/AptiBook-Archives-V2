/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import Moment = moment.Moment;
import moment = require("moment");
export interface Notification {

    id?: number;

    subject?: string

    body?: string

    creation?: Moment

    read?: boolean

}