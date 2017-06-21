/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.enums.Permission;
import com.aptitekk.aptibook.core.domain.entities.enums.property.Property;
import com.aptitekk.aptibook.core.domain.entities.enums.property.validators.PropertyValidator;
import com.aptitekk.aptibook.core.services.entity.PropertyService;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Map;

@APIController
public class PropertyController extends APIControllerAbstract {

    private final PropertyService propertyService;

    @Autowired
    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @RequestMapping(value = "properties", method = RequestMethod.GET)
    public ResponseEntity<?> getProperties() {
        if (!authService.doesCurrentUserHavePermission(Permission.PROPERTIES_MODIFY_ALL))
            return noPermission();

        Map<Property.Key, String> properties = propertyService.getProperties();

        // Put defaults if needed.
        for (Property.Key key : Property.Key.values()) {
            properties.putIfAbsent(key, key.getDefaultValue());
        }

        return ok(properties);
    }

    @RequestMapping(value = "properties/{key}", method = RequestMethod.GET)
    public ResponseEntity<?> getProperty(@PathVariable Property.Key key) {
        switch (key) {
            case PERSONALIZATION_ORGANIZATION_NAME:
            case AUTHENTICATION_METHOD:
            case GOOGLE_SIGN_IN_WHITELIST:
            case ANALYTICS_ENABLED:
                return ok(propertyService.getProperty(key));
            default:
                if (!authService.doesCurrentUserHavePermission(Permission.PROPERTIES_MODIFY_ALL))
                    return noPermission();
                return ok(propertyService.getProperty(key));
        }

    }

    @RequestMapping(value = "properties/allowedDomains", method = RequestMethod.GET)
    public ResponseEntity<?> getAllowedDomains() {

        return ok(propertyService.getProperty(Property.Key.GOOGLE_SIGN_IN_WHITELIST));
    }

    @RequestMapping(value = "properties", method = RequestMethod.PATCH)
    public ResponseEntity<?> setPropertyValue(@RequestBody Map<Property.Key, String> propertiesPatch) {
        if (!authService.doesCurrentUserHavePermission(Permission.PROPERTIES_MODIFY_ALL))
            return noPermission();

        Map<Property.Key, String> tenantProperties = propertyService.getProperties();

        //Check that the submitted value is valid
        for (Map.Entry<Property.Key, String> entry : propertiesPatch.entrySet()) {
            PropertyValidator propertyValidator = entry.getKey().getPropertyValidator();
            if (!propertyValidator.isValid(propertiesPatch.get(entry.getKey()))) {
                return badRequest(propertyValidator.getValidationFailedMessage());
            }

            tenantProperties.put(entry.getKey(), propertiesPatch.get(entry.getKey()));
        }

        // Update values
        propertyService.mergeProperties(tenantProperties);

        return ok(tenantProperties);
    }

    @RequestMapping(value = "properties/{key}", method = RequestMethod.PATCH)
    public ResponseEntity<?> setPropertyValue(@PathVariable Property.Key key,
                                              @RequestBody String value) {
        if (!authService.doesCurrentUserHavePermission(Permission.PROPERTIES_MODIFY_ALL))
            return noPermission();

        //Check that the submitted value is valid
        PropertyValidator propertyValidator = key.getPropertyValidator();
        if (!propertyValidator.isValid(value)) {
            return badRequest(propertyValidator.getValidationFailedMessage());
        }

        // Update value
        propertyService.setProperty(key, value);

        return ok(value);
    }

}
