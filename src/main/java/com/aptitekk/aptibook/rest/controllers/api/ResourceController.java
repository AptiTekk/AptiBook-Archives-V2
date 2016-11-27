/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.Resource;
import com.aptitekk.aptibook.core.domain.repositories.ResourceRepository;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.io.IOException;
import java.io.InputStream;

@APIController
public class ResourceController extends APIControllerAbstract {

    private static final String RESOURCE_NO_IMAGE_PATH = "/static/resource-no-image.jpg";

    private final ResourceRepository resourceRepository;
    private final ResourceLoader resourceLoader;

    @Autowired
    public ResourceController(ResourceRepository resourceRepository, ResourceLoader resourceLoader) {
        this.resourceRepository = resourceRepository;
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

}
