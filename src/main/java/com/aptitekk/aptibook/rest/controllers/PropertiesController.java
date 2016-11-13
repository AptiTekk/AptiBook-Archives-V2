/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers;

import com.aptitekk.aptibook.core.domain.entities.Property;
import com.aptitekk.aptibook.core.domain.repositories.PropertiesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PropertiesController extends APIControllerAbstract {

    private final PropertiesRepository propertiesRepository;

    @Autowired
    public PropertiesController(PropertiesRepository propertiesRepository) {
        this.propertiesRepository = propertiesRepository;
    }

    @RequestMapping(value = "/properties", method = RequestMethod.GET)
    public ResponseEntity<?> getProperties() {
        return ok(propertiesRepository.findAll());
    }

    @RequestMapping(value = "/properties/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getProperty(@PathVariable("id") Long id) {
        if (id != null) {
            Property property = propertiesRepository.findInCurrentTenant(id);
            if (property != null) {
                return ok(property);
            }
        }

        return badRequest();
    }

    @RequestMapping(value = "/properties/{id}", method = RequestMethod.PATCH)
    public ResponseEntity<?> setPropertyValue(@PathVariable("id") Long id, String value) {
        if (id != null && value != null) {
            Property property = propertiesRepository.findInCurrentTenant(id);
            if (property != null) {
                property.setPropertyValue(value);
                return ok(propertiesRepository.save(property));
            }
        }

        return badRequest();
    }

}
