/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities.enums.property.validators;

public class MaxLengthPropertyValidator extends PropertyValidator {

    private int maxLength;

    public MaxLengthPropertyValidator(int maxLength) {
        this(maxLength, "This may only be " + maxLength + " characters long.");
    }

    public MaxLengthPropertyValidator(int maxLength, String validationFailedMessage) {
        super(validationFailedMessage);
        this.maxLength = maxLength;
    }

    @Override
    public boolean isValid(String inputValue) {
        return inputValue == null || inputValue.length() <= maxLength;
    }
}
