/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AptiBookErrorHandler = (function () {
    function AptiBookErrorHandler() {
    }
    AptiBookErrorHandler.prototype.handleError = function (error) {
        //TODO: Raygun implementation
        console.error("Uncaught Error: " + error);
    };
    return AptiBookErrorHandler;
}());
exports.AptiBookErrorHandler = AptiBookErrorHandler;
//# sourceMappingURL=error-handler.js.map