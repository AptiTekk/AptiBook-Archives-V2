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
        if (authService.doesCurrentUserHavePermission(Permission.Descriptor.PROPERTIES_MODIFY_ALL)) {
            return ok(modelMapper.map(propertiesRepository.findAll(), new TypeToken<LinkedList<PropertyDTO>>() {
            }.getType()));
        } else
            return noPermission();
    }

    @RequestMapping(value = "properties/{keyName}", method = RequestMethod.GET)
    public ResponseEntity<?> getProperty(@PathVariable String keyName) {

        if (authService.doesCurrentUserHavePermission(Permission.Descriptor.PROPERTIES_MODIFY_ALL)) {
            Property property = propertiesRepository.findPropertyByKey(Property.Key.valueOf(keyName));
            if (property != null) {
                return ok(modelMapper.map(property, PropertyDTO.class));
            }
        }

        return noPermission();
    }

    @RequestMapping(value = "properties/{keyName}", method = RequestMethod.PATCH)
    public ResponseEntity<?> setPropertyValue(@PathVariable String keyName, @RequestBody PropertyDTO propertyDTO) {
        if (propertyDTO != null && propertyDTO.propertyValue != null) {
            if (authService.doesCurrentUserHavePermission(Permission.Descriptor.PROPERTIES_MODIFY_ALL)) {
                Property property = propertiesRepository.findPropertyByKey(Property.Key.valueOf(keyName));
                if (property != null) {

                    //Check that the submitted value is valid
                    PropertyValidator propertyValidator = property.propertyKey.getPropertyValidator();
                    if (propertyValidator.isValid(propertyDTO.propertyValue)) {
                        property.propertyValue = propertyDTO.propertyValue;

                        //Save Property
                        property = propertiesRepository.save(property);

                        //Notify Property Group Change Listeners
                        property.propertyKey.getGroup().firePropertiesChangedEvent();
                        return ok(property);
                    } else {
                        //Validation failed
                        System.out.println("validation failed");
                        return badRequest(propertyValidator.getValidationFailedMessage());
                    }
                }
            }
            return noPermission();
        }
        return badRequest("ID or Property was invalid / missing");
    }

}
