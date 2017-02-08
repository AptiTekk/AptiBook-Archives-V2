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

import java.util.List;

@APIController
public class PropertiesController extends APIControllerAbstract {

    private final PropertiesRepository propertiesRepository;

    @Autowired
    public PropertiesController(PropertiesRepository propertiesRepository) {
        this.propertiesRepository = propertiesRepository;
    }

    @RequestMapping(value = "properties", method = RequestMethod.GET)
    public ResponseEntity<?> getProperties() {
        if (authService.doesCurrentUserHavePermission(Permission.Descriptor.PROPERTIES_MODIFY_ALL)) {
            return ok(modelMapper.map(propertiesRepository.findAll(), new TypeToken<List<PropertyDTO>>() {
            }.getType()));
        } else
            return noPermission();
    }

    @RequestMapping(value = "properties/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getProperty(@PathVariable Long id) {
        if (id != null) {
            if (authService.doesCurrentUserHavePermission(Permission.Descriptor.PROPERTIES_MODIFY_ALL)) {
                Property property = propertiesRepository.findInCurrentTenant(id);
                if (property != null) {
                    return ok(modelMapper.map(property, PropertyDTO.class));
                }
            }
            return noPermission();
        }

        return badRequest();
    }

    @RequestMapping(value = "properties/{id}", method = RequestMethod.PATCH)
    public ResponseEntity<?> setPropertyValue(@PathVariable Long id, @RequestBody PropertyDTO property) {
        if (id != null && property != null && property.propertyValue != null) {
            if (authService.doesCurrentUserHavePermission(Permission.Descriptor.PROPERTIES_MODIFY_ALL)) {
                Property currentProperty = propertiesRepository.findInCurrentTenant(id);
                if (currentProperty != null) {

                    //Check that the submitted value is valid
                    PropertyValidator propertyValidator = currentProperty.propertyKey.getPropertyValidator();
                    if (propertyValidator.isValid(property.propertyValue)) {
                        currentProperty.propertyValue = property.propertyValue;

                        //Save Property
                        currentProperty = propertiesRepository.save(currentProperty);

                        //Notify Property Group Change Listeners
                        currentProperty.propertyKey.getGroup().firePropertiesChangedEvent();
                        return ok(currentProperty);
                    } else {
                        //Validation failed
                        return badRequest(propertyValidator.getValidationFailedMessage());
                    }
                }
            }
            return noPermission();
        }

        return badRequest("ID or Property was invalid / missing");
    }

}
