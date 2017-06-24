/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.controllers;

import com.aptitekk.aptibook.domain.entities.Resource;
import com.aptitekk.aptibook.domain.entities.ResourceCategory;
import com.aptitekk.aptibook.domain.entities.UserGroup;
import com.aptitekk.aptibook.domain.entities.Permission;
import com.aptitekk.aptibook.domain.repositories.ResourceCategoryRepository;
import com.aptitekk.aptibook.domain.repositories.ResourceRepository;
import com.aptitekk.aptibook.domain.repositories.UserGroupRepository;
import com.aptitekk.aptibook.web.api.dto.ResourceDTO;
import com.aptitekk.aptibook.service.entity.ReservationService;
import com.aptitekk.aptibook.web.api.annotations.APIController;
import org.apache.commons.lang3.time.DateUtils;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @RequestMapping(value = "/resources/available", method = RequestMethod.GET)
    public ResponseEntity<?> getAvailableResources(@RequestParam(value = "start") String start, @RequestParam(value = "end") String end) {
        try {
            Date startDate = DateUtils.parseDate(start, ACCEPTED_TIME_FORMATS);
            Date endDate = DateUtils.parseDate(end, ACCEPTED_TIME_FORMATS);
            LocalDateTime startLocalDateTime = LocalDateTime.ofInstant(startDate.toInstant(), ZoneId.systemDefault());
            LocalDateTime endLocalDateTime = LocalDateTime.ofInstant(endDate.toInstant(), ZoneId.systemDefault());

            List<Resource> availableResources = reservationService.findAvailableResources(startLocalDateTime, endLocalDateTime);
            return ok(modelMapper.map(availableResources, new TypeToken<List<ResourceDTO>>() {
            }.getType()));
        } catch (ParseException e) {
            return badRequest("Could not parse start or end times.");
        }
    }

    @RequestMapping(value = "/resources", method = RequestMethod.POST)
    public ResponseEntity<?> addResource(@RequestBody ResourceDTO.WithoutReservations resourceDTO) {
        if (!authService.doesCurrentUserHavePermission(Permission.RESOURCES_MODIFY_ALL))
            return noPermission();

        Resource resource = new Resource();
        ResourceCategory resourceCategory = null;

        if (resourceDTO.resourceCategory == null)
            return badRequest("Resource Category not supplied.");
        else {
            resourceCategory = resourceCategoryRepository.findInCurrentTenant(resourceDTO.resourceCategory.id);
            if (resourceCategory == null)
                return badRequest("Category not found.");
            else
                resource.setResourceCategory(resourceCategory);
        }

        if (resourceDTO.name == null)
            return badRequest("Name not supplied.");
        else if (resourceDTO.name.length() > 30)
            return badRequest("Name must be 30 characters or less.");
        else if (!resourceDTO.name.matches(VALID_CHARACTER_PATTERN))
            return badRequest("Name includes invalid characters.");
        else if (resourceRepository.findByName(resourceDTO.name, resourceCategory) != null)
            return badRequest("A Resource by that name already exists!");
        else
            resource.setName(resourceDTO.name);

        if (resourceDTO.owner == null)
            return badRequest("Owner not supplied.");
        else {
            UserGroup owner = userGroupRepository.findInCurrentTenant(resourceDTO.owner.id);
            if (owner == null)
                return badRequest("Owner not found.");
            else if (owner.isRoot())
                return badRequest("Owner cannot be root.");
            else
                resource.setOwner(owner);
        }

        resource.setNeedsApproval(resourceDTO.needsApproval != null ? resourceDTO.needsApproval : false);

        resource = resourceRepository.save(resource);
        return created(modelMapper.map(resource, ResourceDTO.class), "/resources/" + resource.getId());

    }

    @RequestMapping(value = "/resources/{id}", method = RequestMethod.PATCH)
    public ResponseEntity<?> patchResource(@RequestBody ResourceDTO resourceDTO, @PathVariable Long id) {
        Resource resource = resourceRepository.findInCurrentTenant(id);
        ResourceCategory resourceCategory = null;

        if (resource == null)
            return noPermission();

        if (!permissionsService.canUserEditResource(resource, authService.getCurrentUser()))
            return noPermission();

        if (resourceDTO.resourceCategory != null) {
            resourceCategory = resourceCategoryRepository.findInCurrentTenant(resourceDTO.resourceCategory.id);
            if (resourceCategory == null)
                return badRequest("Category not found.");
            else
                resource.setResourceCategory(resourceCategory);
        }

        if (resourceDTO.name != null) {
            if (resourceDTO.name.length() > 30)
                return badRequest("Name must be 30 characters or less.");

            if (!resourceDTO.name.matches(VALID_CHARACTER_PATTERN))
                return badRequest("Name includes invalid characters.");

            Resource existingResource = resourceRepository.findByName(resourceDTO.name, resourceCategory);
            if (existingResource != null && !existingResource.getId().equals(resourceDTO.id))
                return badRequest("A Resource by that name already exists!");

            resource.setName(resourceDTO.name);
        }

        if (resourceDTO.owner != null) {
            UserGroup owner = userGroupRepository.findInCurrentTenant(resourceDTO.owner.id);
            if (owner == null)
                return badRequest("Owner not found.");
            else if (owner.isRoot())
                return badRequest("Owner cannot be root.");
            else
                resource.setOwner(owner);
        }

        if (resourceDTO.needsApproval != null)
            resource.setNeedsApproval(resourceDTO.needsApproval);

        resource = resourceRepository.save(resource);
        return ok(modelMapper.map(resource, ResourceDTO.class));
    }

    @RequestMapping(value = "/resources/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteResource(@PathVariable Long id) {
        Resource resource = resourceRepository.findInCurrentTenant(id);

        if (!permissionsService.canUserEditResource(resource, authService.getCurrentUser()))
            return noPermission();

        resourceRepository.delete(resource);
        return noContent();
    }

}
