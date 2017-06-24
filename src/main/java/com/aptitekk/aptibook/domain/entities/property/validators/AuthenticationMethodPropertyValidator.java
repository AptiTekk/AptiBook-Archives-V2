/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.domain.entities.property.validators;

import com.aptitekk.aptibook.domain.entities.property.Property;

public class AuthenticationMethodPropertyValidator extends PropertyValidator {

    public AuthenticationMethodPropertyValidator() {
        super("The Authentication Method is not valid.");
    }

    @Override
    public boolean isValid(String inputValue) {
        try {
            // Try to get the enum with this name.
            Property.AuthenticationMethod.valueOf(inputValue);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

}
