/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.domain.entities.property;

import com.aptitekk.aptibook.domain.entities.property.validators.*;

public enum Property {

    PERSONALIZATION_ORGANIZATION_NAME(null, new MaxLengthPropertyValidator(64)),

    REGISTRATION_ENABLED("true", new BooleanPropertyValidator()),

    AUTHENTICATION_METHOD(AuthenticationMethod.BUILT_IN.name(), new AuthenticationMethodPropertyValidator()),

    GOOGLE_SIGN_IN_ENABLED("false", new BooleanPropertyValidator()),
    GOOGLE_SIGN_IN_WHITELIST("", new MaxLengthPropertyValidator(256)),

    CAS_SERVER_URL("", new CASServerUrlPropertyValidator()),

    ANALYTICS_ENABLED("true", new BooleanPropertyValidator());

    private final String defaultValue;
    private PropertyValidator propertyValidator;

    Property(String defaultValue, PropertyValidator propertyValidator) {
        this.defaultValue = defaultValue;
        this.propertyValidator = propertyValidator;
    }

    public String getDefaultValue() {
        return defaultValue;
    }

    public PropertyValidator getPropertyValidator() {
        return propertyValidator;
    }

    public enum AuthenticationMethod {

        BUILT_IN,
        CAS;

    }
}
