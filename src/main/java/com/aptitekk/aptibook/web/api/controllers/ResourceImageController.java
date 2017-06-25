/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.controllers;

import com.aptitekk.aptibook.domain.entities.File;
import com.aptitekk.aptibook.domain.entities.Resource;
import com.aptitekk.aptibook.domain.repositories.FileRepository;
import com.aptitekk.aptibook.domain.repositories.ResourceRepository;
import com.aptitekk.aptibook.util.ImageUtils;
import com.aptitekk.aptibook.web.api.APIResponse;
import com.aptitekk.aptibook.web.api.annotations.APIController;
import net.coobird.thumbnailator.geometry.Positions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@APIController
public class ResourceImageController extends APIControllerAbstract {

    private static final List<String> ACCEPTED_IMAGE_TYPES = Arrays.asList("image/jpeg", "image/pjpeg", "image/png");

    private final ResourceRepository resourceRepository;
    private final FileRepository fileRepository;

    @Autowired
    public ResourceImageController(ResourceRepository resourceRepository,
                                   FileRepository fileRepository) {
        this.resourceRepository = resourceRepository;
        this.fileRepository = fileRepository;
    }

    @RequestMapping(value = "/resources/{id}/image", method = RequestMethod.GET, produces = MediaType.IMAGE_JPEG_VALUE)
    public APIResponse getImage(@PathVariable Long id) {
        Resource resource = resourceRepository.findInCurrentTenant(id);
        if (resource == null)
            return APIResponse.notFound("Resource not found.");

        if (resource.getImage() == null || resource.getImage().getData() == null)
            return APIResponse.noContentResponse();

        return APIResponse.ok(resource.getImage().getData());
    }

    @RequestMapping(value = "/resources/{id}/image", method = RequestMethod.PUT, consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.IMAGE_JPEG_VALUE)
    public APIResponse setImage(@PathVariable Long id, @RequestPart("file") MultipartFile multipartFile) {
        Resource resource = resourceRepository.findInCurrentTenant(id);

        if (!permissionsService.canUserEditResource(resource, authService.getCurrentUser()))
            return APIResponse.noPermission();

        if (multipartFile.getSize() > 5000000)
            return APIResponse.badRequest("maximum_file_size_exceeded", "Image cannot be larger than 5MB.");
        else if (!ACCEPTED_IMAGE_TYPES.contains(multipartFile.getContentType()))
            return APIResponse.badRequest("image_type_not_supported", "The provided image type is not supported.");
        else {
            try {
                // Read the image
                BufferedImage bufferedImage = ImageIO.read(multipartFile.getInputStream());

                // Remove alpha
                bufferedImage = ImageUtils.removeAlpha(bufferedImage);

                // Make sure the image is at max 1024px wide or tall.
                bufferedImage = ImageUtils.scaleDownImageToBounds(bufferedImage, 150);

                // Crop the image to a square
                bufferedImage = ImageUtils.cropToSquare(bufferedImage, Positions.CENTER);

                // Parse as a JPEG
                byte[] parsedImage = ImageUtils.parseImageAsJPEG(bufferedImage);

                // Save image to file entities.
                File imageFile = new File();
                imageFile.setData(parsedImage);
                imageFile = fileRepository.save(imageFile);

                File oldImage = resource.getImage();

                // Set and save new image
                resource.setImage(imageFile);
                resource = resourceRepository.save(resource);

                // Delete old image
                if (oldImage != null) {
                    fileRepository.delete(oldImage);
                }

                // Return the image.
                return APIResponse.ok(resource.getImage().getData());
            } catch (IOException e) {
                return APIResponse.badRequestNotParsable("Could not read image. It may be corrupt.");
            }
        }
    }

    @RequestMapping(value = "/resources/{id}/image", method = RequestMethod.DELETE)
    public APIResponse deleteImage(@PathVariable Long id) {
        Resource resource = resourceRepository.findInCurrentTenant(id);

        if (resource == null)
            return APIResponse.noPermission();

        if (!permissionsService.canUserEditResource(resource, authService.getCurrentUser()))
            return APIResponse.noPermission();

        File imageFile = resource.getImage();

        if (imageFile != null) {
            resource.setImage(null);
            fileRepository.delete(imageFile);
        }

        return APIResponse.noContentResponse();
    }

}
