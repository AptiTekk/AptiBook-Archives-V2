/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.entities.enums.Permission;
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
        Set<Permission.Descriptor> allPermissionsForUser = permissionsService.getAllPermissionsForUser(authService.getCurrentUser());
        return ok(modelMapper.map(allPermissionsForUser, new TypeToken<Set<Permission.Descriptor>>() {
        }.getType()));
    }

    /**
     * Finds all users with any permissions explicitly assigned to them (not inherited)
     * @return For each permission descriptor, a list of the users who have the permission explicitly.
     */
    @RequestMapping(value = "/permissions/users", method = RequestMethod.GET)
    public ResponseEntity<?> getUsersWithPermissions() {
        if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.GENERAL_FULL_PERMISSIONS))
            return noPermission();

        Map<Permission.Descriptor, List<User>> descriptorMap = new HashMap<>();
        for (Permission.Descriptor descriptor : Permission.Descriptor.values()) {
            descriptorMap.put(descriptor, this.userRepository.findUsersWithPermission(descriptor));
        }

        // We cannot simply modelMap the entire map, we must map each individual list within the map.
        Map<Permission.Descriptor, List<UserDTO.WithoutUserGroups>> modelMappedDescriptorMap = new HashMap<>();
        for (Map.Entry<Permission.Descriptor, List<User>> entry : descriptorMap.entrySet()) {
            modelMappedDescriptorMap.put(entry.getKey(), modelMapper.map(entry.getValue(), new TypeToken<List<UserDTO.WithoutUserGroups>>() {
            }.getType()));
        }

        return ok(modelMappedDescriptorMap);
    }

    /**
     * Finds all users with this specific permission explicitly assigned to them (not inherited).
     * @param descriptor The permission descriptor for filtering.
     * @return A list of the users who have the permission explicitly.
     */
    @RequestMapping(value = "/permissions/{descriptor}/users", method = RequestMethod.GET)
    public ResponseEntity<?> getUsersWithPermission(@PathVariable("descriptor") Permission.Descriptor descriptor) {
        if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.GENERAL_FULL_PERMISSIONS))
            return noPermission();

        List<User> usersWithPermission = this.userRepository.findUsersWithPermission(descriptor);
        return ok(modelMapper.map(usersWithPermission, new TypeToken<List<UserDTO.WithoutUserGroups>>() {
        }.getType()));
    }

}
