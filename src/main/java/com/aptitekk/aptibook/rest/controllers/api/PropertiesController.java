/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.Permission;
import com.aptitekk.aptibook.core.domain.entities.Property;
import com.aptitekk.aptibook.core.domain.entities.propertyValidators.PropertyValidator;
import com.aptitekk.aptibook.core.domain.repositories.PropertiesRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.PropertyDTO;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.LinkedList;

@APIController
public class PropertiesController extends APIControllerAbstract {

    private final PropertiesRepository propertiesRepository;

    @Autowired
    public PropertiesController(PropertiesRepository propertiesRepository) {
        this.propertiesRepository = propertiesRepository;
    }

    @RequestMapping(value = "properties", method = RequestMethod.GET)
    public ResponseEntity<?> getProperties() {
        if (!authService.isUserSignedIn())
            return unauthorized();

        if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.PROPERTIES_MODIFY_ALL))
            return noPermission();

        return ok(modelMapper.map(propertiesRepository.findAll(), new TypeToken<LinkedList<PropertyDTO>>() {
        }.getType()));
    }

    @RequestMapping(value = "properties/{keyName}", method = RequestMethod.GET)
    public ResponseEntity<?> getProperty(@PathVariable String keyName) {

        if (!authService.isUserSignedIn())
            return unauthorized();

        if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.PROPERTIES_MODIFY_ALL))
            return noPermission();

        Property property = propertiesRepository.findPropertyByKey(Property.Key.valueOf(keyName));

        if (property == null)
            return badRequest("No property exists with the key name: " + keyName);

        return ok(modelMapper.map(property, PropertyDTO.class));
    }

    @RequestMapping(value = "properties/{keyName}", method = RequestMethod.PATCH)
    public ResponseEntity<?> setPropertyValue(@PathVariable String keyName, @RequestBody PropertyDTO propertyDTO) {

        if (!authService.isUserSignedIn())
            return unauthorized();

        if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.PROPERTIES_MODIFY_ALL))
            return noPermission();

        Property property = propertiesRepository.findPropertyByKey(Property.Key.valueOf(keyName));

        if (property == null)
            return badRequest("No property exists with the key name: " + keyName);

        //Check that the submitted value is valid
        PropertyValidator propertyValidator = property.propertyKey.getPropertyValidator();
        if (!propertyValidator.isValid(propertyDTO.propertyValue)) {
            return badRequest(propertyValidator.getValidationFailedMessage());
        }

        // Update the property value
        property.propertyValue = propertyDTO.propertyValue;

        // Save the property
        property = propertiesRepository.save(property);

        // Notify change listeners of a change.
        property.propertyKey.getGroup().firePropertiesChangedEvent();

        return ok(modelMapper.map(property, PropertyDTO.class));
    }

}
