/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.Permission;
import com.aptitekk.aptibook.core.domain.entities.Resource;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.entities.UserGroup;
import com.aptitekk.aptibook.core.domain.repositories.ResourceRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.ResourceDTO;
import com.aptitekk.aptibook.core.services.entity.ReservationService;
import com.aptitekk.aptibook.core.services.entity.UserGroupService;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.apache.commons.lang3.time.DateUtils;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@APIController
public class ResourceController extends APIControllerAbstract {

    private static final String RESOURCE_NO_IMAGE_PATH = "/static/resource-no-image.jpg";

    private final ResourceRepository resourceRepository;
    private final UserGroupService userGroupService;
    private final ReservationService reservationService;
    private final ResourceLoader resourceLoader;

    @Autowired
    public ResourceController(ResourceRepository resourceRepository, UserGroupService userGroupService, ReservationService reservationService, ResourceLoader resourceLoader) {
        this.resourceRepository = resourceRepository;
        this.userGroupService = userGroupService;
        this.reservationService = reservationService;
        this.resourceLoader = resourceLoader;
    }

    @RequestMapping(value = "/resources/{id}/image", method = RequestMethod.GET, produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<?> getImage(@PathVariable Long id) {
        if (authService.isUserSignedIn()) {
            if (id != null) {
                Resource resource = resourceRepository.findInCurrentTenant(id);
                if (resource != null) {
                    if (resource.image != null && resource.image.getData() != null) {
                        return ok(resource.image.getData());
                    }
                }
            }
        }

        try {
            org.springframework.core.io.Resource noImageSpringResource = resourceLoader.getResource(RESOURCE_NO_IMAGE_PATH);
            if (noImageSpringResource != null) {
                InputStream inputStream = noImageSpringResource.getInputStream();
                return ok(StreamUtils.copyToByteArray(inputStream));
            }
        } catch (IOException e) {
            logService.logException(getClass(), e, "Could not read or write resource-no-image.jpg");
        }

        return null;
    }

    @RequestMapping(value = "/resources/available", method = RequestMethod.GET)
    public ResponseEntity<?> getAvailableResources(@RequestParam(value = "start") String start, @RequestParam(value = "end") String end) {
        if (authService.isUserSignedIn()) {
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
        return unauthorized();
    }

    @RequestMapping(value = "/resources/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteResource(@PathVariable Long id) {
        if (authService.isUserSignedIn()) {
            User currentUser = authService.getCurrentUser();
            Resource resource = resourceRepository.findInCurrentTenant(id);

            //Check Permissions
            if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.RESOURCES_MODIFY_ALL)) {
                boolean ownsResource = false;
                boolean hierarchyOwnsResource = false;
                List<UserGroup> currentUserGroups = currentUser.userGroups;
                for (UserGroup userGroup : currentUserGroups) {
                    if (resource.owner.equals(userGroup))
                        ownsResource = true;

                    List<UserGroup> hierarchyDown = userGroupService.getHierarchyDown(userGroup);
                    for (UserGroup hierarchyGroup : hierarchyDown) {
                        if (resource.owner.equals(hierarchyGroup)) {
                            hierarchyOwnsResource = true;
                            break;
                        }
                    }
                }

                if (!(authService.doesCurrentUserHavePermission(Permission.Descriptor.RESOURCES_MODIFY_OWN) && ownsResource)
                        && !(authService.doesCurrentUserHavePermission(Permission.Descriptor.RESOURCES_MODIFY_HIERARCHY) && hierarchyOwnsResource))
                    return noPermission();
            }

            //Permissions are okay. Delete Resource.
            resourceRepository.delete(resource);
            return noContent();
        }
        return unauthorized();
    }

}
