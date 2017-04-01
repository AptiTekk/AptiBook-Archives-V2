/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuidV4 = require('uuid/v4');
var UUIDGenerator = (function () {
    function UUIDGenerator() {
    }
    UUIDGenerator.generateUUID = function () {
        return uuidV4();
    };
    return UUIDGenerator;
}());
exports.UUIDGenerator = UUIDGenerator;
//# sourceMappingURL=UUIDGenerator.js.map