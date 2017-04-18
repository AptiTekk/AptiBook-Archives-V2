/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.enums.Permission;
import com.aptitekk.aptibook.core.domain.entities.enums.Property;
import com.aptitekk.aptibook.core.domain.entities.propertyValidators.PropertyValidator;
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
        if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.PROPERTIES_MODIFY_ALL))
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
        if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.PROPERTIES_MODIFY_ALL))
            return noPermission();

        return ok(propertyService.getProperty(key));
    }

    @RequestMapping(value = "properties/allowedDomains", method = RequestMethod.GET)
    public ResponseEntity<?> getAllowedDomains() {

        return ok(propertyService.getProperty(Property.Key.GOOGLE_SIGN_IN_WHITELIST));
    }

    @RequestMapping(value = "properties", method = RequestMethod.PATCH)
    public ResponseEntity<?> setPropertyValue(@RequestBody Map<Property.Key, String> properties) {
        if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.PROPERTIES_MODIFY_ALL))
            return noPermission();

        Map<Property.Key, String> tenantProperties = propertyService.getProperties();

        //Check that the submitted value is valid
        for (Property.Key propertyKey : Property.Key.values()) {
            PropertyValidator propertyValidator = propertyKey.getPropertyValidator();
            if (!propertyValidator.isValid(properties.get(propertyKey))) {
                return badRequest(propertyValidator.getValidationFailedMessage());
            }

            tenantProperties.put(propertyKey, properties.get(propertyKey));
        }

        // Update value
        propertyService.setProperties(tenantProperties);

        for (Property.Key propertyKey : Property.Key.values()) {
            // Notify change listeners of a change.
            propertyKey.getGroup().firePropertiesChangedEvent();
        }

        return ok(tenantProperties);
    }

    @RequestMapping(value = "properties/{key}", method = RequestMethod.PATCH)
    public ResponseEntity<?> setPropertyValue(@PathVariable Property.Key key,
                                              @RequestBody String value) {
        if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.PROPERTIES_MODIFY_ALL))
            return noPermission();

        //Check that the submitted value is valid
        PropertyValidator propertyValidator = key.getPropertyValidator();
        if (!propertyValidator.isValid(value)) {
            return badRequest(propertyValidator.getValidationFailedMessage());
        }

        // Update value
        propertyService.setProperty(key, value);

        // Notify change listeners of a change.
        key.getGroup().firePropertiesChangedEvent();

        return ok(value);
    }

}
