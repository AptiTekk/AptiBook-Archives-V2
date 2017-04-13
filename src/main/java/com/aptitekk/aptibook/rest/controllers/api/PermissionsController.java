/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.entities.enums.Permissions;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.UserDTO;
import com.aptitekk.aptibook.core.services.entity.PermissionsService;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@APIController
public class PermissionsController extends APIControllerAbstract {

    private final PermissionsService permissionsService;
    private final UserRepository userRepository;

    @Autowired
    public PermissionsController(PermissionsService permissionsService,
                                 UserRepository userRepository) {
        this.permissionsService = permissionsService;
        this.userRepository = userRepository;
    }

    @RequestMapping(value = "/users/current/permissions", method = RequestMethod.GET)
    public ResponseEntity<?> getCurrentUserPermissions() {
        Set<Permissions.Descriptor> allPermissionsForUser = permissionsService.getAllPermissionsForUser(authService.getCurrentUser());
        return ok(modelMapper.map(allPermissionsForUser, new TypeToken<Set<Permissions.Descriptor>>() {
        }.getType()));
    }

    @RequestMapping(value = "/permissions/users", method = RequestMethod.GET)
    public ResponseEntity<?> getUsersWithPermissions() {
        if (!authService.doesCurrentUserHavePermission(Permissions.Descriptor.PERMISSIONS_MODIFY_ALL))
            return noPermission();

        Map<Permissions.Descriptor, List<User>> descriptorMap = new HashMap<>();

        for (Permissions.Descriptor descriptor : Permissions.Descriptor.values()) {
            descriptorMap.put(descriptor, this.userRepository.findUsersWithPermission(descriptor));
        }

        return ok(modelMapper.map(descriptorMap, new TypeToken<Map<Permissions.Descriptor, List<UserDTO.WithoutUserGroups>>>() {
        }.getType()));
    }

    @RequestMapping(value = "/permissions/{descriptor}/users", method = RequestMethod.GET)
    public ResponseEntity<?> getUsersWithPermission(@PathVariable("descriptor") Permissions.Descriptor descriptor) {
        if (!authService.doesCurrentUserHavePermission(Permissions.Descriptor.PERMISSIONS_MODIFY_ALL))
            return noPermission();

        List<User> usersWithPermission = this.userRepository.findUsersWithPermission(descriptor);
        return ok(modelMapper.map(usersWithPermission, new TypeToken<List<UserDTO.WithoutUserGroups>>() {
        }.getType()));
    }

}
