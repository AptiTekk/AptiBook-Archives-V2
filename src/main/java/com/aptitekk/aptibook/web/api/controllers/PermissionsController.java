/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.controllers;

import com.aptitekk.aptibook.domain.entities.Permission;
import com.aptitekk.aptibook.domain.entities.User;
import com.aptitekk.aptibook.domain.entities.UserGroup;
import com.aptitekk.aptibook.service.entity.PermissionsService;
import com.aptitekk.aptibook.web.api.APIResponse;
import com.aptitekk.aptibook.web.api.annotations.APIController;
import com.aptitekk.aptibook.web.api.dtos.UserDTO;
import com.aptitekk.aptibook.web.api.dtos.UserGroupDTO;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.*;

@APIController
public class PermissionsController extends APIControllerAbstract {

    private final PermissionsService permissionsService;

    @Autowired
    public PermissionsController(PermissionsService permissionsService) {
        this.permissionsService = permissionsService;
    }

    @RequestMapping(value = "/users/current/permissions", method = RequestMethod.GET)
    public APIResponse getCurrentUserPermissions() {
        Set<Permission> allPermissionsForUser = permissionsService.getAllPermissionsForUser(authService.getCurrentUser());
        return APIResponse.okResponse(modelMapper.map(allPermissionsForUser, new TypeToken<Set<Permission>>() {
        }.getType()));
    }

    /**
     * Finds all the Users assigned to the Permissions in all Permission Groups.
     *
     * @param inherited Whether or not to include inherited assignments, from the Users' User Groups. Defaults to true.
     * @return A list of Permission Groups, the Permissions in those groups, and which Users are assigned to them.
     */
    @RequestMapping(value = "/permissions/users", method = RequestMethod.GET)
    public APIResponse getUsersAssignedToPermissionsInAllGroups(@RequestParam(name = "inherited", defaultValue = "true") boolean inherited) {

        // Make sure the user has the permission to list the assignments.
        if (!authService.doesCurrentUserHavePermission(Permission.GENERAL_FULL_PERMISSIONS))
            return APIResponse.noPermission();

        // Create a map containing the Permission Groups and their Permissions
        Map<Permission.Group, Object> permissionGroupMap = new HashMap<>();

        // For each Permission in each Permission Group, get the assigned Users.
        Arrays.stream(Permission.Group.values()).forEach(group -> permissionGroupMap.put(group, getUsersAssignedToPermissionsInGroup(group, inherited).getContent()));

        return APIResponse.okResponse(permissionGroupMap);
    }

    /**
     * Finds all the Users assigned to the Permissions in a particular Permission Group.
     *
     * @param group     The Permission Group.
     * @param inherited Whether or not to include inherited assignments, from the Users' User Groups. Defaults to true.
     * @return A list of the Permissions in the Permission Group, and which Users are assigned to them.
     */
    @RequestMapping(value = "/permissions/groups/{key}/users", method = RequestMethod.GET)
    public APIResponse getUsersAssignedToPermissionsInGroup(@PathVariable("key") Permission.Group group,
                                                            @RequestParam(name = "inherited", defaultValue = "true") boolean inherited) {

        // Make sure the user has the permission to list the assignments.
        if (!authService.doesCurrentUserHavePermission(Permission.GENERAL_FULL_PERMISSIONS))
            return APIResponse.noPermission();

        // Create a map with the permissions for this Permission Group, mapped to the List of Users assigned to the permission.
        Map<Permission, List<User>> permissionMap = new HashMap<>();

        // For each permission, find the User Groups assigned.
        for (Permission permission : group.getPermissions()) {
            permissionMap.put(permission, permissionsService.getUsersAssignedToPermission(permission, inherited));
        }

        // We cannot simply modelMap the entire map, we must map each individual list within the map.
        Map<Permission, List<UserDTO>> permissionMapDTO = new HashMap<>();
        for (Map.Entry<Permission, List<User>> entry : permissionMap.entrySet()) {
            permissionMapDTO.put(entry.getKey(), modelMapper.map(entry.getValue(), new TypeToken<List<UserDTO>>() {
            }.getType()));
        }

        return APIResponse.okResponse(permissionMapDTO);
    }

    /**
     * Finds all the User Groups assigned to the Permissions in all Permission Groups.
     *
     * @return A list of Permission Groups, the Permissions in those groups, and which User Groups are assigned to them.
     */
    @RequestMapping(value = "/permissions/user_groups", method = RequestMethod.GET)
    public APIResponse getUserGroupsAssignedToPermissionsInAllGroups() {

        // Make sure the user has the permission to list the assignments.
        if (!authService.doesCurrentUserHavePermission(Permission.GENERAL_FULL_PERMISSIONS))
            return APIResponse.noPermission();

        // Create a map containing the Permission Groups and their Permissions
        Map<Permission.Group, Object> permissionGroupMap = new HashMap<>();

        // For each Permission in each Permission Group, get the assigned User Groups.
        Arrays.stream(Permission.Group.values()).forEach(group -> permissionGroupMap.put(group, getUserGroupsAssignedToPermissionsInGroup(group).getContent()));

        return APIResponse.okResponse(permissionGroupMap);
    }

    /**
     * Finds all the User Groups assigned to the Permissions in a particular Permission Group.
     *
     * @param group The Permission Group.
     * @return A list of the Permissions in the Permission Group, and which User Groups are assigned to them.
     */
    @RequestMapping(value = "/permissions/groups/{key}/user_groups", method = RequestMethod.GET)
    public APIResponse getUserGroupsAssignedToPermissionsInGroup(@PathVariable("key") Permission.Group group) {

        // Make sure the user has the permission to list the assignments.
        if (!authService.doesCurrentUserHavePermission(Permission.GENERAL_FULL_PERMISSIONS))
            return APIResponse.noPermission();

        // Create a map with the permissions for this Permission Group, mapped to the List of User Groups assigned to the permission.
        Map<Permission, List<UserGroup>> permissionMap = new HashMap<>();

        // For each permission, find the User Groups assigned.
        for (Permission permission : group.getPermissions()) {
            permissionMap.put(permission, permissionsService.getUserGroupsAssignedToPermission(permission));
        }

        // We cannot simply modelMap the entire map, we must map each individual list within the map.
        Map<Permission, List<UserGroupDTO>> permissionMapDTO = new HashMap<>();
        for (Map.Entry<Permission, List<UserGroup>> entry : permissionMap.entrySet()) {
            permissionMapDTO.put(entry.getKey(), modelMapper.map(entry.getValue(), new TypeToken<List<UserGroupDTO>>() {
            }.getType()));
        }

        return APIResponse.okResponse(permissionMapDTO);
    }

}
