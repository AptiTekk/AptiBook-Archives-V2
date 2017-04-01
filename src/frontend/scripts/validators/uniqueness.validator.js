/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Validators for ensuring that the control contains a unique value.
 */
var UniquenessValidator = (function () {
    function UniquenessValidator() {
    }
    /**
     * Ensures that the value of the control is not already within the provided array of strings.
     * @param disallowedValues An array of strings that the value CANNOT be.
     * @param caseSensitive If the value of the control should exactly match the value inside the array, including case.
     */
    UniquenessValidator.isUnique = function (disallowedValues, caseSensitive) {
        if (caseSensitive === void 0) { caseSensitive = false; }
        return function (control) {
            if (!control.value)
                return null;
            if (!disallowedValues)
                return null;
            if (caseSensitive) {
                if (disallowedValues.includes(control.value))
                    return { isUnique: false };
            }
            else {
                if (disallowedValues.filter(function (value) { return value.toLowerCase() === control.value.toString().toLowerCase(); }).length > 0)
                    return { isUnique: false };
            }
            return null;
        };
    };
    return UniquenessValidator;
}());
exports.UniquenessValidator = UniquenessValidator;
//# sourceMappingURL=uniqueness.validator.js.map