/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("core-js/es6");
require("core-js/es7/reflect");
require("web-animations-js/web-animations.min.js");
require('zone.js/dist/zone');
if (process.env.ENV === 'production') {
    // Production
}
else {
    // Development
    Error['stackTraceLimit'] = 5;
    require('zone.js/dist/long-stack-trace-zone');
}
//# sourceMappingURL=polyfills.js.map