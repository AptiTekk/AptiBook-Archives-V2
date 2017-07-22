/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.controllers;

import com.aptitekk.aptibook.domain.entities.Resource;
import com.aptitekk.aptibook.domain.entities.ResourceCategory;
import com.aptitekk.aptibook.domain.entities.UserGroup;
import com.aptitekk.aptibook.domain.repositories.ResourceCategoryRepository;
import com.aptitekk.aptibook.domain.repositories.ResourceRepository;
import com.aptitekk.aptibook.domain.repositories.UserGroupRepository;
import com.aptitekk.aptibook.service.entity.ReservationService;
import com.aptitekk.aptibook.web.api.APIResponse;
import com.aptitekk.aptibook.web.api.annotations.APIController;
import com.aptitekk.aptibook.web.api.dtos.ResourceCategoryDTO;
import com.aptitekk.aptibook.web.api.dtos.ResourceDTO;
import org.apache.commons.lang3.time.DateUtils;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@APIController
public class ResourceController extends APIControllerAbstract {

    private final ResourceRepository resourceRepository;
    private final ResourceCategoryRepository resourceCategoryRepository;
    private final UserGroupRepository userGroupRepository;
    private final ReservationService reservationService;

    @Autowired
    public ResourceController(ResourceRepository resourceRepository,
                              ResourceCategoryRepository resourceCategoryRepository,
                              UserGroupRepository userGroupRepository,
                              ReservationService reservationService) {
        this.resourceRepository = resourceRepository;
        this.resourceCategoryRepository = resourceCategoryRepository;
        this.userGroupRepository = userGroupRepository;
        this.reservationService = reservationService;
    }

    @RequestMapping(value = "/resources", method = RequestMethod.GET)
    public APIResponse getAll() {
        return APIResponse.okResponse(modelMapper.map(resourceRepository.findAll(), new TypeToken<List<ResourceDTO.WithResourceCategory>>() {}.getType()));
    }

    @RequestMapping(value = "/resources/{id}", method = RequestMethod.GET)
    public APIResponse get(@PathVariable("id") Long id) {

        Resource resource = resourceRepository.findInCurrentTenant(id);
        if (resource == null)
            return APIResponse.notFound("No Resource was found with the given id");

        return APIResponse.okResponse(modelMapper.map(resource, ResourceDTO.class));
    }

    @RequestMapping(value = "/resources/{id}/resourceCategory", method = RequestMethod.GET)
    public APIResponse getResourceCategory(@PathVariable("id") Long id) {

        Resource resource = resourceRepository.findInCurrentTenant(id);
        if (resource == null)
            return APIResponse.notFound("No Resource was found with the given id");

        return APIResponse.okResponse(modelMapper.map(resource.getResourceCategory(), ResourceCategoryDTO.WithResources.class));
    }

    @RequestMapping(value = "/resources/available", method = RequestMethod.GET)
    public APIResponse getAvailable(@RequestParam(value = "start") String start, @RequestParam(value = "end") String end) {
        try {
            Date startDate = DateUtils.parseDate(start, ACCEPTED_TIME_FORMATS);
            Date endDate = DateUtils.parseDate(end, ACCEPTED_TIME_FORMATS);
            LocalDateTime startLocalDateTime = LocalDateTime.ofInstant(startDate.toInstant(), ZoneId.systemDefault());
            LocalDateTime endLocalDateTime = LocalDateTime.ofInstant(endDate.toInstant(), ZoneId.systemDefault());

            List<Resource> availableResources = reservationService.findAvailableResources(startLocalDateTime, endLocalDateTime);
            return APIResponse.okResponse(modelMapper.map(availableResources, new TypeToken<List<ResourceDTO>>() {
            }.getType()));
        } catch (ParseException e) {
            return APIResponse.badRequestNotParsable("Could not parse start or end times.");
        }
    }

    /**
     * Changes the Resource Category that this Resource is assigned to.
     * @param resourceCategoryDTO Must contain the ID of the new Resource Category.
     * @param id The ID of the Resource.
     * @return The newly assigned Resource Category.
     */
    @RequestMapping(value = "/resources/{id}/resourceCategory", method = RequestMethod.PUT)
    public APIResponse setResourceCategory(@RequestBody ResourceCategoryDTO resourceCategoryDTO, @PathVariable("id") Long id) {

        Resource resource = resourceRepository.findInCurrentTenant(id);
        if (resource == null)
            return APIResponse.notFound("No Resource was found with the given id.");

        if(resourceCategoryDTO.id == null)
            return APIResponse.badRequestMissingField("id");

        ResourceCategory newResourceCategory = resourceCategoryRepository.findInCurrentTenant(resourceCategoryDTO.id);
        if(newResourceCategory == null)
            return APIResponse.notFound("No Resource Category was found with the given id.");

        // Check for a conflicting Resource name in the new Resource Category.
        Resource existingResource = resourceRepository.findByName(resource.getName(), newResourceCategory);
        if(existingResource != null)
            return APIResponse.badRequestConflict("A Resource with the same name already exists in the new Resource Category");

        resource.setResourceCategory(newResourceCategory);
        resource = resourceRepository.save(resource);

        return APIResponse.okResponse(modelMapper.map(resource.getResourceCategory(), ResourceCategoryDTO.WithResources.class));
    }

    @RequestMapping(value = "/resources/{id}", method = RequestMethod.PATCH)
    public APIResponse patch(@RequestBody ResourceDTO resourceDTO, @PathVariable Long id) {
        Resource resource = resourceRepository.findInCurrentTenant(id);

        if (resource == null)
            return APIResponse.noPermission();

        if (!permissionsService.canUserEditResource(resource, authService.getCurrentUser()))
            return APIResponse.noPermission();

        if (resourceDTO.name != null) {
            if (resourceDTO.name.length() > 30)
                return APIResponse.badRequestFieldTooLong("name", 30);

            if (!resourceDTO.name.matches(VALID_CHARACTER_PATTERN))
                return APIResponse.badRequestInvalidCharacters("name", INVALID_CHARACTERS);

            Resource existingResource = resourceRepository.findByName(resourceDTO.name, resource.getResourceCategory());
            if (existingResource != null && !existingResource.getId().equals(resourceDTO.id))
                return APIResponse.badRequestConflict("A Resource by that name already exists!");

            resource.setName(resourceDTO.name);
        }

        if (resourceDTO.owner != null) {
            UserGroup owner = userGroupRepository.findInCurrentTenant(resourceDTO.owner.id);
            if (owner == null)
                return APIResponse.notFound("The resource owner group was not found.");
            else if (owner.isRoot())
                return APIResponse.forbidden("The resource owner group cannot be the root group.");
            else
                resource.setOwner(owner);
        }

        if (resourceDTO.needsApproval != null)
            resource.setNeedsApproval(resourceDTO.needsApproval);

        resource = resourceRepository.save(resource);
        return APIResponse.okResponse(modelMapper.map(resource, ResourceDTO.class));
    }

    @RequestMapping(value = "/resources/{id}", method = RequestMethod.DELETE)
    public APIResponse delete(@PathVariable Long id) {
        Resource resource = resourceRepository.findInCurrentTenant(id);

        if (!permissionsService.canUserEditResource(resource, authService.getCurrentUser()))
            return APIResponse.noPermission();

        resourceRepository.delete(resource);
        return APIResponse.noContentResponse();
    }

}
