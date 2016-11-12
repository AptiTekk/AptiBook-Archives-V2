/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers;

import com.aptitekk.aptibook.core.domain.entities.Property;
import com.aptitekk.aptibook.core.services.entities.PropertiesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;

@RestController
@Scope(WebApplicationContext.SCOPE_REQUEST)
public class PropertiesController extends APIControllerAbstract {

    private final PropertiesService propertiesService;

    @Autowired
    public PropertiesController(PropertiesService propertiesService) {
        System.out.println("Properties");
        this.propertiesService = propertiesService;
    }

    @RequestMapping(value = "/properties", method = RequestMethod.GET)
    public List<Property> getProperties() {
        return this.propertiesService.findAll();
    }

}
