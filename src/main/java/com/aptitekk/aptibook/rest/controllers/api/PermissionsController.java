/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.entities.UserGroup;
import com.aptitekk.aptibook.core.domain.entities.enums.Permission;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.UserDTO;
import com.aptitekk.aptibook.core.domain.rest.dtos.UserGroupDTO;
import com.aptitekk.aptibook.core.services.entity.PermissionsService;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
        Set<Permission.Descriptor> allPermissionsForUser = permissionsService.getAllPermissionsForUser(authService.getCurrentUser());
        return ok(modelMapper.map(allPermissionsForUser, new TypeToken<Set<Permission.Descriptor>>() {
        }.getType()));
    }

    /**
     * Finds all the User Groups assigned to the Permissions in a particular Permission Group.
     *
     * @param group The Permission Group.
     * @return A list of the Permissions in the Permission Group, and which User Groups are assigned to them.
     */
    @RequestMapping(value = "/permissions/group/{name}/user_groups", method = RequestMethod.GET)
    public ResponseEntity getUserGroupsAssignedToPermissionsInGroup(@PathVariable("name") Permission.Group group) {

        // Make sure the user has the permission to list the assignments.
        if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.GENERAL_FULL_PERMISSIONS))
            return noPermission();

        // Create a map with the descriptors for this Permission Group, mapped to the List of User Groups assigned to the descriptor.
        Map<Permission.Descriptor, List<UserGroup>> permissionMap = new HashMap<>();

        // For each descriptor, find the User Groups assigned.
        for (Permission.Descriptor descriptor : group.getDescriptors()) {
            permissionMap.put(descriptor, permissionsService.getUserGroupsAssignedToPermission(descriptor));
        }

        // We cannot simply modelMap the entire map, we must map each individual list within the map.
        Map<Permission.Descriptor, List<UserDTO.WithoutUserGroups>> modelMappedDescriptorMap = new HashMap<>();
        for (Map.Entry<Permission.Descriptor, List<UserGroup>> entry : permissionMap.entrySet()) {
            modelMappedDescriptorMap.put(entry.getKey(), modelMapper.map(entry.getValue(), new TypeToken<List<UserGroupDTO.WithoutParentOrChildren>>() {
            }.getType()));
        }

        return ok(modelMappedDescriptorMap);
    }

    /**
     * Finds all the Users assigned to the Permissions in a particular Permission Group.
     *
     * @param group     The Permission Group.
     * @param inherited Whether or not to include inherited assignments, from the Users' User Groups. Defaults to true.
     * @return A list of the Permissions in the Permission Group, and which Users are assigned to them.
     */
    @RequestMapping(value = "/permissions/group/{name}/users", method = RequestMethod.GET)
    public ResponseEntity getUsersAssignedToPermissionsInGroup(@PathVariable("name") Permission.Group group,
                                                               @RequestParam(name = "inherited", defaultValue = "true") boolean inherited) {

        // Make sure the user has the permission to list the assignments.
        if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.GENERAL_FULL_PERMISSIONS))
            return noPermission();

        // Create a map with the descriptors for this Permission Group, mapped to the List of Users assigned to the descriptor.
        Map<Permission.Descriptor, List<User>> permissionMap = new HashMap<>();

        // For each descriptor, find the User Groups assigned.
        for (Permission.Descriptor descriptor : group.getDescriptors()) {
            permissionMap.put(descriptor, permissionsService.getUsersAssignedToPermission(descriptor, inherited));
        }

        // We cannot simply modelMap the entire map, we must map each individual list within the map.
        Map<Permission.Descriptor, List<UserDTO.WithoutUserGroups>> modelMappedDescriptorMap = new HashMap<>();
        for (Map.Entry<Permission.Descriptor, List<User>> entry : permissionMap.entrySet()) {
            modelMappedDescriptorMap.put(entry.getKey(), modelMapper.map(entry.getValue(), new TypeToken<List<UserDTO.WithoutUserGroups>>() {
            }.getType()));
        }

        return ok(modelMappedDescriptorMap);
    }

}
