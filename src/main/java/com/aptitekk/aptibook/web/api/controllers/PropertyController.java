/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.controllers;

import com.aptitekk.aptibook.domain.entities.Permission;
import com.aptitekk.aptibook.domain.entities.property.Property;
import com.aptitekk.aptibook.domain.entities.property.validators.PropertyValidator;
import com.aptitekk.aptibook.service.entity.PropertyService;
import com.aptitekk.aptibook.web.api.APIResponse;
import com.aptitekk.aptibook.web.api.annotations.APIController;
import org.springframework.beans.factory.annotation.Autowired;
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
    public APIResponse getProperties() {
        if (!authService.doesCurrentUserHavePermission(Permission.PROPERTIES_MODIFY_ALL))
            return APIResponse.noPermission();

        Map<Property, String> properties = propertyService.getProperties();

        // Put defaults if needed.
        for (Property key : Property.values()) {
            properties.putIfAbsent(key, key.getDefaultValue());
        }

        return APIResponse.okResponse(properties);
    }

    @RequestMapping(value = "properties/{key}", method = RequestMethod.GET)
    public APIResponse getProperty(@PathVariable Property key) {
        switch (key) {
            case PERSONALIZATION_ORGANIZATION_NAME:
            case AUTHENTICATION_METHOD:
            case GOOGLE_SIGN_IN_WHITELIST:
            case ANALYTICS_ENABLED:
                return APIResponse.okResponse(propertyService.getProperty(key));
            default:
                if (!authService.doesCurrentUserHavePermission(Permission.PROPERTIES_MODIFY_ALL))
                    return APIResponse.noPermission();
                return APIResponse.okResponse(propertyService.getProperty(key));
        }

    }

    @RequestMapping(value = "properties/allowedDomains", method = RequestMethod.GET)
    public APIResponse getAllowedDomains() {

        return APIResponse.okResponse(propertyService.getProperty(Property.GOOGLE_SIGN_IN_WHITELIST));
    }

    @RequestMapping(value = "properties", method = RequestMethod.PATCH)
    public APIResponse setPropertyValue(@RequestBody Map<Property, String> propertiesPatch) {
        if (!authService.doesCurrentUserHavePermission(Permission.PROPERTIES_MODIFY_ALL))
            return APIResponse.noPermission();

        Map<Property, String> tenantProperties = propertyService.getProperties();

        //Check that the submitted value is valid
        for (Map.Entry<Property, String> entry : propertiesPatch.entrySet()) {
            PropertyValidator propertyValidator = entry.getKey().getPropertyValidator();
            if (!propertyValidator.isValid(propertiesPatch.get(entry.getKey()))) {
                return APIResponse.badRequest("validation_failed", propertyValidator.getValidationFailedMessage());
            }

            tenantProperties.put(entry.getKey(), propertiesPatch.get(entry.getKey()));
        }

        // Update values
        propertyService.mergeProperties(tenantProperties);

        return APIResponse.okResponse(tenantProperties);
    }

    @RequestMapping(value = "properties/{key}", method = RequestMethod.PATCH)
    public APIResponse setPropertyValue(@PathVariable Property key,
                                              @RequestBody String value) {
        if (!authService.doesCurrentUserHavePermission(Permission.PROPERTIES_MODIFY_ALL))
            return APIResponse.noPermission();

        //Check that the submitted value is valid
        PropertyValidator propertyValidator = key.getPropertyValidator();
        if (!propertyValidator.isValid(value)) {
            return APIResponse.badRequest("validation_failed", propertyValidator.getValidationFailedMessage());
        }

        // Update value
        propertyService.setProperty(key, value);

        return APIResponse.okResponse(value);
    }

}
