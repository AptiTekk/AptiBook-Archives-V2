/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.controllers;

import com.aptitekk.aptibook.domain.entities.Permission;
import com.aptitekk.aptibook.domain.entities.Resource;
import com.aptitekk.aptibook.domain.entities.ResourceCategory;
import com.aptitekk.aptibook.domain.entities.UserGroup;
import com.aptitekk.aptibook.domain.repositories.ResourceCategoryRepository;
import com.aptitekk.aptibook.domain.repositories.ResourceRepository;
import com.aptitekk.aptibook.domain.repositories.UserGroupRepository;
import com.aptitekk.aptibook.web.api.APIResponse;
import com.aptitekk.aptibook.web.api.annotations.APIController;
import com.aptitekk.aptibook.web.api.dtos.ResourceCategoryDTO;
import com.aptitekk.aptibook.web.api.dtos.ResourceDTO;
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
    private final ResourceRepository resourceRepository;
    private final UserGroupRepository userGroupRepository;

    @Autowired
    public ResourceCategoryController(ResourceCategoryRepository resourceCategoryRepository,
                                      ResourceRepository resourceRepository,
                                      UserGroupRepository userGroupRepository) {
        this.resourceCategoryRepository = resourceCategoryRepository;
        this.resourceRepository = resourceRepository;
        this.userGroupRepository = userGroupRepository;
    }

    @RequestMapping(value = "/resourceCategories", method = RequestMethod.GET)
    public APIResponse getAll() {
        return APIResponse.ok(modelMapper.map(resourceCategoryRepository.findAll(), new TypeToken<List<ResourceCategoryDTO.WithResources>>() {
        }.getType()));
    }

    @RequestMapping(value = "/resourceCategories/{id}", method = RequestMethod.GET)
    public APIResponse get(@PathVariable Long id) {
        ResourceCategory resourceCategory = resourceCategoryRepository.findInCurrentTenant(id);

        if (resourceCategory == null)
            return APIResponse.notFound("The Resource Category could not be found.");

        return APIResponse.ok(modelMapper.map(resourceCategory, ResourceCategoryDTO.WithResources.class));
    }

    @RequestMapping(value = "/resourceCategories/{id}/resources", method = RequestMethod.GET)
    public APIResponse getResources(@PathVariable Long id) {
        ResourceCategory resourceCategory = resourceCategoryRepository.findInCurrentTenant(id);

        if (resourceCategory == null)
            return APIResponse.notFound("The Resource Category could not be found.");

        return APIResponse.ok(modelMapper.map(resourceCategory.getResources(), new TypeToken<List<ResourceDTO>>() {}.getType()));
    }

    @RequestMapping(value = "/resourceCategories", method = RequestMethod.POST)
    public APIResponse add(@RequestBody ResourceCategoryDTO resourceCategoryDTO) {
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
        return APIResponse.created(modelMapper.map(resourceCategory, ResourceCategoryDTO.WithResources.class), "/api/resourceCategories/" + resourceCategory.getId());
    }

    /**
     * Creates a new Resource under the given Resource Category.
     * @param resourceDTO The Resource's information.
     * @param id The ID of the Resource Category that the Resource will be assigned to.
     * @return The newly created Resource.
     */
    @RequestMapping(value = "/resourceCategories/{id}/resources", method = RequestMethod.POST)
    public APIResponse addResource(@RequestBody ResourceDTO resourceDTO, @PathVariable("id") Long id) {
        if (!authService.doesCurrentUserHavePermission(Permission.RESOURCES_MODIFY_ALL))
            return APIResponse.noPermission();

        ResourceCategory resourceCategory = resourceCategoryRepository.findInCurrentTenant(id);
        if (resourceCategory == null)
            return APIResponse.notFound("No Resource Category was found with the given id.");

        Resource resource = new Resource();
        resource.setResourceCategory(resourceCategory);

        if (resourceDTO.name == null)
            return APIResponse.badRequestMissingField("name");
        else if (resourceDTO.name.length() > 30)
            return APIResponse.badRequestFieldTooLong("name", 30);
        else if (!resourceDTO.name.matches(VALID_CHARACTER_PATTERN))
            return APIResponse.badRequestInvalidCharacters("name", INVALID_CHARACTERS);
        else if (resourceRepository.findByName(resourceDTO.name, resourceCategory) != null)
            return APIResponse.badRequestConflict("A Resource by that name already exists!");
        else
            resource.setName(resourceDTO.name);

        if (resourceDTO.owner == null)
            return APIResponse.badRequestMissingField("owner");
        else {
            UserGroup owner = userGroupRepository.findInCurrentTenant(resourceDTO.owner.id);
            if (owner == null)
                return APIResponse.notFound("The resource owner group was not found.");
            else if (owner.isRoot())
                return APIResponse.forbidden("The resource owner group cannot be the root group.");
            else
                resource.setOwner(owner);
        }

        resource.setNeedsApproval(resourceDTO.needsApproval != null ? resourceDTO.needsApproval : false);

        resource = resourceRepository.save(resource);
        return APIResponse.created(modelMapper.map(resource, ResourceDTO.WithResourceCategory.class), "/resources/" + resource.getId());
    }

    @RequestMapping(value = "/resourceCategories/{id}", method = RequestMethod.PATCH)
    public APIResponse patch(@RequestBody ResourceCategoryDTO resourceCategoryDTO, @PathVariable Long id) {
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
        return APIResponse.ok(modelMapper.map(resourceCategory, ResourceCategoryDTO.WithResources.class));
    }

    @RequestMapping(value = "/resourceCategories/{id}", method = RequestMethod.DELETE)
    public APIResponse delete(@PathVariable Long id) {
        if (!authService.doesCurrentUserHavePermission(Permission.RESOURCE_CATEGORIES_MODIFY_ALL))
            return APIResponse.noPermission();

        ResourceCategory resourceCategory = resourceCategoryRepository.findInCurrentTenant(id);
        this.resourceCategoryRepository.delete(resourceCategory);
        return APIResponse.noContentResponse();
    }

}
