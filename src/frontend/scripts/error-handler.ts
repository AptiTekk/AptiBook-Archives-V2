/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {ErrorHandler} from "@angular/core";

export class AptiBookErrorHandler implements ErrorHandler {
    handleError(error) {
        //TODO: Raygun implementation
        console.error("Uncaught Error: " + error);
    }
}