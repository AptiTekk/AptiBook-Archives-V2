/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities.enums.property.validators;

public abstract class PropertyValidator {

    private String validationFailedMessage;

    public PropertyValidator(String validationFailedMessage) {
        this.validationFailedMessage = validationFailedMessage;
    }

    public abstract boolean isValid(String inputValue);

    public String getValidationFailedMessage() {
        return validationFailedMessage;
    }
}
