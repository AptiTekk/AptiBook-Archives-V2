/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.ResourceCategory;
import com.aptitekk.aptibook.core.domain.entities.enums.Permissions;
import com.aptitekk.aptibook.core.domain.repositories.ResourceCategoryRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.ResourceCategoryDTO;
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
public class ResourceCategoryController extends APIControllerAbstract {

    private final ResourceCategoryRepository resourceCategoryRepository;

    @Autowired
    public ResourceCategoryController(ResourceCategoryRepository resourceCategoryRepository) {
        this.resourceCategoryRepository = resourceCategoryRepository;
    }

    @RequestMapping(value = "/resourceCategories", method = RequestMethod.GET)
    public ResponseEntity<?> getResourceCategories() {
        return ok(modelMapper.map(resourceCategoryRepository.findAll(), new TypeToken<List<ResourceCategoryDTO>>() {
        }.getType()));
    }

    @RequestMapping(value = "/resourceCategories", method = RequestMethod.POST)
    public ResponseEntity<?> addResourceCategory(@RequestBody ResourceCategoryDTO.WithoutResources resourceCategoryDTO) {
        if (authService.doesCurrentUserHavePermission(Permissions.Descriptor.RESOURCE_CATEGORIES_MODIFY_ALL)) {
            ResourceCategory resourceCategory = new ResourceCategory();

            if (resourceCategoryDTO == null)
                return badRequest("Resource Category not supplied.");

            if (resourceCategoryDTO.name == null)
                return badRequest("Name not supplied.");

            if (resourceCategoryDTO.name.length() > 30)
                return badRequest("The Name must be 30 characters or less.");

            if (!resourceCategoryDTO.name.matches(VALID_CHARACTER_PATTERN))
                return badRequest("The Name cannot contain these characters: < > ; =");

            if (resourceCategoryRepository.findByName(resourceCategoryDTO.name) != null)
                return badRequest("A Category with that name already exists!");

            resourceCategory.name = resourceCategoryDTO.name;
            resourceCategory = this.resourceCategoryRepository.save(resourceCategory);
            return created(modelMapper.map(resourceCategory, ResourceCategoryDTO.class), "/resourceCategories/" + resourceCategory.id);
        }
        return noPermission();
    }

    @RequestMapping(value = "/resourceCategories/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getResourceCategory(@PathVariable Long id) {
        ResourceCategory resourceCategory = resourceCategoryRepository.findInCurrentTenant(id);

        if (resourceCategory == null)
            return noPermission();

        return ok(modelMapper.map(resourceCategory, ResourceCategoryDTO.class));
    }

    @RequestMapping(value = "/resourceCategories/{id}", method = RequestMethod.PATCH)
    public ResponseEntity<?> patchResourceCategory(@RequestBody ResourceCategoryDTO.WithoutResources resourceCategoryDTO, @PathVariable Long id) {
        if (authService.doesCurrentUserHavePermission(Permissions.Descriptor.RESOURCE_CATEGORIES_MODIFY_ALL)) {
            ResourceCategory resourceCategory = resourceCategoryRepository.findInCurrentTenant(id);

            if (resourceCategory == null)
                return noPermission();

            if (resourceCategoryDTO == null)
                return badRequest("Resource Category not supplied.");

            if (resourceCategoryDTO.name != null) {
                if (resourceCategoryDTO.name.length() > 30)
                    return badRequest("The Name must be 30 characters or less.");

                if (!resourceCategoryDTO.name.matches(VALID_CHARACTER_PATTERN))
                    return badRequest("The Name cannot contain these characters: < > ; =");

                ResourceCategory existingCategory = resourceCategoryRepository.findByName(resourceCategoryDTO.name);
                if (existingCategory != null && !existingCategory.id.equals(id))
                    return badRequest("A Category with that name already exists!");

                resourceCategory.name = resourceCategoryDTO.name;
            }

            resourceCategory = this.resourceCategoryRepository.save(resourceCategory);
            return ok(modelMapper.map(resourceCategory, ResourceCategoryDTO.class));
        }
        return noPermission();
    }

    @RequestMapping(value = "/resourceCategories/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteResourceCategory(@PathVariable Long id) {
        if (authService.doesCurrentUserHavePermission(Permissions.Descriptor.RESOURCE_CATEGORIES_MODIFY_ALL)) {
            ResourceCategory resourceCategory = resourceCategoryRepository.findInCurrentTenant(id);
            this.resourceCategoryRepository.delete(resourceCategory);
            return noContent();
        }
        return noPermission();
    }

}
