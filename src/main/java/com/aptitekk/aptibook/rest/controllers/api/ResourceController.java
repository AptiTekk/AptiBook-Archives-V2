/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.*;
import com.aptitekk.aptibook.core.domain.repositories.FileRepository;
import com.aptitekk.aptibook.core.domain.repositories.ResourceCategoryRepository;
import com.aptitekk.aptibook.core.domain.repositories.ResourceRepository;
import com.aptitekk.aptibook.core.domain.repositories.UserGroupRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.ResourceDTO;
import com.aptitekk.aptibook.core.services.entity.ReservationService;
import com.aptitekk.aptibook.core.services.entity.UserGroupService;
import com.aptitekk.aptibook.core.util.ImageHelper;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import net.coobird.thumbnailator.geometry.Positions;
import org.apache.commons.lang3.time.DateUtils;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@APIController
public class ResourceController extends APIControllerAbstract {

    private static final String RESOURCE_NO_IMAGE_PATH = "/static/resource-no-image.jpg";
    private static final List<String> ACCEPTED_IMAGE_TYPES = Arrays.asList("image/jpeg", "image/pjpeg", "image/png");

    private final ResourceRepository resourceRepository;
    private final ResourceCategoryRepository resourceCategoryRepository;
    private final FileRepository fileRepository;
    private final UserGroupRepository userGroupRepository;
    private final UserGroupService userGroupService;
    private final ReservationService reservationService;
    private final ResourceLoader resourceLoader;

    @Autowired
    public ResourceController(ResourceRepository resourceRepository,
                              ResourceCategoryRepository resourceCategoryRepository,
                              FileRepository fileRepository,
                              UserGroupRepository userGroupRepository,
                              UserGroupService userGroupService,
                              ReservationService reservationService,
                              ResourceLoader resourceLoader) {
        this.resourceRepository = resourceRepository;
        this.resourceCategoryRepository = resourceCategoryRepository;
        this.fileRepository = fileRepository;
        this.userGroupRepository = userGroupRepository;
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

    @RequestMapping(value = "/resources/{id}/image", method = RequestMethod.PUT, consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<?> setImage(@PathVariable Long id, @RequestPart("file") MultipartFile multipartFile) {
        if (!authService.isUserSignedIn())
            return unauthorized();

        Resource resource = resourceRepository.findInCurrentTenant(id);

        if (!canUserEditResource(resource, authService.getCurrentUser()))
            return noPermission();

        if (multipartFile == null)
            return badRequest("No image supplied.");
        else if (multipartFile.getSize() > 5000000)
            return badRequest("Image cannot be larger than 5MB.");
        else if (!ACCEPTED_IMAGE_TYPES.contains(multipartFile.getContentType()))
            return badRequest("Image type not supported.");
        else {
            try {
                // Read the image
                BufferedImage bufferedImage = ImageIO.read(multipartFile.getInputStream());

                // Remove alpha
                bufferedImage = ImageHelper.removeAlpha(bufferedImage);

                // Make sure the image is at max 1024px wide or tall.
                bufferedImage = ImageHelper.scaleDownImageToBounds(bufferedImage, 1024);

                // Crop the image to a square
                bufferedImage = ImageHelper.cropToSquare(bufferedImage, Positions.CENTER);

                // Parse as a JPEG
                byte[] parsedImage = ImageHelper.parseImageAsJPEG(bufferedImage);

                // Save image to file entity.
                File imageFile = new File();
                imageFile.setData(parsedImage);
                imageFile = fileRepository.save(imageFile);

                if (imageFile == null)
                    return serverError("Could not save image.");

                File oldImage = resource.image;

                // Set and save new image
                resource.image = imageFile;
                resource = resourceRepository.save(resource);

                // Delete old image
                if (oldImage != null) {
                    fileRepository.delete(oldImage);
                }

                // Return the image.
                return ok(resource.image.getData());
            } catch (IOException e) {
                return badRequest("Could not read image. It may be corrupt.");
            }
        }
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

    @RequestMapping(value = "/resources", method = RequestMethod.POST)
    public ResponseEntity<?> addResource(@RequestBody ResourceDTO resourceDTO) {
        if (!authService.isUserSignedIn())
            return unauthorized();
        else if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.RESOURCES_MODIFY_ALL))
            return noPermission();
        else {
            Resource resource = new Resource();

            if (resourceDTO.name == null)
                return badRequest("Name not supplied.");
            else if (resourceDTO.name.length() > 30)
                return badRequest("Name must be 30 characters or less.");
            else if (!resourceDTO.name.matches(VALID_CHARACTER_PATTERN))
                return badRequest("Name includes invalid characters.");
            else
                resource.name = resourceDTO.name;

            if (resourceDTO.owner == null)
                return badRequest("Owner not supplied.");
            else {
                UserGroup owner = userGroupRepository.findInCurrentTenant(resourceDTO.owner.id);
                if (owner == null)
                    return badRequest("Owner not found.");
                else if (owner.isRoot())
                    return badRequest("Owner cannot be root.");
                else
                    resource.owner = owner;
            }

            if (resourceDTO.resourceCategory == null)
                return badRequest("Resource Category not supplied.");
            else {
                ResourceCategory resourceCategory = resourceCategoryRepository.findInCurrentTenant(resourceDTO.resourceCategory.id);
                if (resourceCategory == null)
                    return badRequest("Category not found.");
                else
                    resource.resourceCategory = resourceCategory;
            }

            resource.needsApproval = resourceDTO.needsApproval != null ? resourceDTO.needsApproval : false;

            resource = resourceRepository.save(resource);
            return created(modelMapper.map(resource, ResourceDTO.class), "/resources/" + resource.id);
        }
    }

    @RequestMapping(value = "/resources/{id}", method = RequestMethod.PATCH)
    public ResponseEntity<?> patchResource(@RequestBody ResourceDTO resourceDTO, @PathVariable Long id) {
        if (!authService.isUserSignedIn())
            return unauthorized();
        else {
            Resource resource = resourceRepository.findInCurrentTenant(id);

            if (resource == null)
                return noPermission();

            if (!canUserEditResource(resource, authService.getCurrentUser()))
                return noPermission();

            if (resourceDTO.name != null) {
                if (resourceDTO.name.length() > 30)
                    return badRequest("Name must be 30 characters or less.");
                else if (!resourceDTO.name.matches(VALID_CHARACTER_PATTERN))
                    return badRequest("Name includes invalid characters.");
                else
                    resource.name = resourceDTO.name;
            }

            if (resourceDTO.owner != null) {
                UserGroup owner = userGroupRepository.findInCurrentTenant(resourceDTO.owner.id);
                if (owner == null)
                    return badRequest("Owner not found.");
                else if (owner.isRoot())
                    return badRequest("Owner cannot be root.");
                else
                    resource.owner = owner;
            }

            if (resourceDTO.resourceCategory != null) {
                ResourceCategory resourceCategory = resourceCategoryRepository.findInCurrentTenant(resourceDTO.resourceCategory.id);
                if (resourceCategory == null)
                    return badRequest("Category not found.");
                else
                    resource.resourceCategory = resourceCategory;
            }

            if (resourceDTO.needsApproval != null)
                resource.needsApproval = resourceDTO.needsApproval;

            resource = resourceRepository.save(resource);
            return ok(modelMapper.map(resource, ResourceDTO.class));
        }
    }

    @RequestMapping(value = "/resources/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteResource(@PathVariable Long id) {
        if (!authService.isUserSignedIn())
            return unauthorized();

        Resource resource = resourceRepository.findInCurrentTenant(id);

        if (!canUserEditResource(resource, authService.getCurrentUser()))
            return noPermission();

        resourceRepository.delete(resource);
        return noContent();
    }

    private boolean canUserEditResource(Resource resource, User user) {
        // True if they can edit all resources
        if (authService.doesCurrentUserHavePermission(Permission.Descriptor.RESOURCES_MODIFY_ALL))
            return true;

        // False if they have no other resource permissions
        if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.RESOURCES_MODIFY_OWN)
                && !authService.doesCurrentUserHavePermission(Permission.Descriptor.RESOURCES_MODIFY_HIERARCHY))
            return false;

        // Check every group the user belongs to.
        for (UserGroup userGroup : user.userGroups) {

            // True if the User belongs to the User Group that owns the resource.
            if (resource.owner.equals(userGroup))
                return true;

            // Check every group below the user's own if they have permission.
            if (authService.doesCurrentUserHavePermission(Permission.Descriptor.RESOURCES_MODIFY_HIERARCHY))

                for (UserGroup hierarchyGroup : userGroupService.getHierarchyDown(userGroup))

                    // True if the User has hierarchy over the User Group that owns the resource.
                    if (resource.owner.equals(hierarchyGroup))
                        return true;

        }

        // False otherwise.
        return false;
    }

}
