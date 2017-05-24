/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.File;
import com.aptitekk.aptibook.core.domain.entities.Resource;
import com.aptitekk.aptibook.core.domain.repositories.FileRepository;
import com.aptitekk.aptibook.core.domain.repositories.ResourceRepository;
import com.aptitekk.aptibook.core.util.ImageHelper;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import net.coobird.thumbnailator.geometry.Positions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> getImage(@PathVariable Long id) {
        Resource resource = resourceRepository.findInCurrentTenant(id);
        if (resource == null)
            return badRequest("Resource not found.");

        if (resource.getImage() == null || resource.getImage().getData() == null)
            return noContent();

        return ok(resource.getImage().getData());
    }

    @RequestMapping(value = "/resources/{id}/image", method = RequestMethod.PUT, consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<?> setImage(@PathVariable Long id, @RequestPart("file") MultipartFile multipartFile) {
        Resource resource = resourceRepository.findInCurrentTenant(id);

        if (!permissionsService.canUserEditResource(resource, authService.getCurrentUser()))
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
                bufferedImage = ImageHelper.scaleDownImageToBounds(bufferedImage, 150);

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

                File oldImage = resource.getImage();

                // Set and save new image
                resource.setImage(imageFile);
                resource = resourceRepository.save(resource);

                // Delete old image
                if (oldImage != null) {
                    fileRepository.delete(oldImage);
                }

                // Return the image.
                return ok(resource.getImage().getData());
            } catch (IOException e) {
                return badRequest("Could not read image. It may be corrupt.");
            }
        }
    }

    @RequestMapping(value = "/resources/{id}/image", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteImage(@PathVariable Long id) {
        Resource resource = resourceRepository.findInCurrentTenant(id);

        if (resource == null)
            return noPermission();

        if (!permissionsService.canUserEditResource(resource, authService.getCurrentUser()))
            return noPermission();

        File imageFile = resource.getImage();

        if (imageFile != null) {
            resource.setImage(null);
            fileRepository.delete(imageFile);
        }

        return noContent();
    }

}
