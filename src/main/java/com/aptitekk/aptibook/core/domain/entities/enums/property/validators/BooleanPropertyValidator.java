/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities.enums.property.validators;

public class BooleanPropertyValidator extends PropertyValidator {

    public BooleanPropertyValidator() {
        super("This should only be true or false.");
    }

    @Override
    public boolean isValid(String inputValue) {
        return inputValue != null && (inputValue.equalsIgnoreCase("true") || inputValue.equalsIgnoreCase("false"));
    }
}
