/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.enums.Permissions;
import com.aptitekk.aptibook.core.services.entity.PermissionsService;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Set;

@APIController
public class PermissionsController extends APIControllerAbstract {

    private final PermissionsService permissionsService;

    @Autowired
    public PermissionsController(PermissionsService permissionsService) {
        this.permissionsService = permissionsService;
    }

    @RequestMapping(value = "/users/current/permissions", method = RequestMethod.GET)
    public ResponseEntity<?> getCurrentUserPermissions() {
        Set<Permissions.Descriptor> allPermissionsForUser = permissionsService.getAllPermissionsForUser(authService.getCurrentUser());
        return ok(modelMapper.map(allPermissionsForUser, new TypeToken<Set<Permissions.Descriptor>>() {
        }.getType()));
    }

}
