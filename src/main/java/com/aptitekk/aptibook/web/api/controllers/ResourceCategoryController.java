/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.controllers;

import com.aptitekk.aptibook.domain.entities.Permission;
import com.aptitekk.aptibook.domain.entities.ResourceCategory;
import com.aptitekk.aptibook.domain.repositories.ResourceCategoryRepository;
import com.aptitekk.aptibook.web.api.APIResponse;
import com.aptitekk.aptibook.web.api.annotations.APIController;
import com.aptitekk.aptibook.web.api.dtos.ResourceCategoryDTO;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
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
    public APIResponse getResourceCategories() {
        return APIResponse.ok(modelMapper.map(resourceCategoryRepository.findAll(), new TypeToken<List<ResourceCategoryDTO>>() {
        }.getType()));
    }

    @RequestMapping(value = "/resourceCategories", method = RequestMethod.POST)
    public APIResponse addResourceCategory(@RequestBody ResourceCategoryDTO.WithoutResources resourceCategoryDTO) {
        if (!authService.doesCurrentUserHavePermission(Permission.RESOURCE_CATEGORIES_MODIFY_ALL)) {
            return APIResponse.noPermission();
        }

        ResourceCategory resourceCategory = new ResourceCategory();

        if (resourceCategoryDTO.name == null)
            return APIResponse.badRequestMissingField("name");

        if (resourceCategoryDTO.name.length() > 30)
            return APIResponse.badRequestFieldTooLong("name", 30);

        if (!resourceCategoryDTO.name.matches(VALID_CHARACTER_PATTERN))
            return APIResponse.badRequestInvalidCharacters("name", INVALID_CHARACTERS);

        if (resourceCategoryRepository.findByName(resourceCategoryDTO.name) != null)
            return APIResponse.badRequest("not_unique", "A Category with that name already exists!");

        resourceCategory.setName(resourceCategoryDTO.name);
        resourceCategory = this.resourceCategoryRepository.save(resourceCategory);
        return APIResponse.created(modelMapper.map(resourceCategory, ResourceCategoryDTO.class), "/api/resourceCategories/" + resourceCategory.getId());
    }

    @RequestMapping(value = "/resourceCategories/{id}", method = RequestMethod.GET)
    public APIResponse getResourceCategory(@PathVariable Long id) {
        ResourceCategory resourceCategory = resourceCategoryRepository.findInCurrentTenant(id);

        if (resourceCategory == null)
            return APIResponse.notFound("The Resource Category could not be found.");

        return APIResponse.ok(modelMapper.map(resourceCategory, ResourceCategoryDTO.class));
    }

    @RequestMapping(value = "/resourceCategories/{id}", method = RequestMethod.PATCH)
    public APIResponse patchResourceCategory(@RequestBody ResourceCategoryDTO.WithoutResources resourceCategoryDTO, @PathVariable Long id) {
        if (!authService.doesCurrentUserHavePermission(Permission.RESOURCE_CATEGORIES_MODIFY_ALL))
            return APIResponse.noPermission();

        ResourceCategory resourceCategory = resourceCategoryRepository.findInCurrentTenant(id);

        if (resourceCategory == null)
            return APIResponse.notFound("The Resource Category could not be found.");

        if (resourceCategoryDTO.name != null) {
            if (resourceCategoryDTO.name.length() > 30)
                return APIResponse.badRequestFieldTooLong("name", 30);

            if (!resourceCategoryDTO.name.matches(VALID_CHARACTER_PATTERN))
                return APIResponse.badRequestInvalidCharacters("name", INVALID_CHARACTERS);

            ResourceCategory existingCategory = resourceCategoryRepository.findByName(resourceCategoryDTO.name);
            if (existingCategory != null && !existingCategory.getId().equals(id))
                return APIResponse.badRequest("not_unique", "A Category with that name already exists!");

            resourceCategory.setName(resourceCategoryDTO.name);
        }

        resourceCategory = this.resourceCategoryRepository.save(resourceCategory);
        return APIResponse.ok(modelMapper.map(resourceCategory, ResourceCategoryDTO.class));
    }

    @RequestMapping(value = "/resourceCategories/{id}", method = RequestMethod.DELETE)
    public APIResponse deleteResourceCategory(@PathVariable Long id) {
        if (!authService.doesCurrentUserHavePermission(Permission.RESOURCE_CATEGORIES_MODIFY_ALL))
            return APIResponse.noPermission();

        ResourceCategory resourceCategory = resourceCategoryRepository.findInCurrentTenant(id);
        this.resourceCategoryRepository.delete(resourceCategory);
        return APIResponse.noContentResponse();
    }

}
