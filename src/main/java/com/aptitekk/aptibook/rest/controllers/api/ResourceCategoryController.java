/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.repositories.ResourceCategoryRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.ResourceCategoryDTO;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

@APIController
public class ResourceCategoryController extends APIControllerAbstract {

    private final ResourceCategoryRepository resourceCategoryRepository;

    @Autowired
    public ResourceCategoryController(ResourceCategoryRepository resourceCategoryRepository) {
        this.resourceCategoryRepository = resourceCategoryRepository;
    }

    @RequestMapping(value = "/resourceCategories", method = RequestMethod.GET)
    public ResponseEntity<?> getResourceCategories() {
        if (authService.isUserSignedIn()) {
            return ok(modelMapper.map(resourceCategoryRepository.findAll(), new TypeToken<List<ResourceCategoryDTO>>() {
            }.getType()));
        }

        return unauthorized();
    }

}
