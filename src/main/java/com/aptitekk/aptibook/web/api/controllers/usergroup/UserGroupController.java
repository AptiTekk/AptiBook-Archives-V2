/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.controllers.usergroup;

import com.aptitekk.aptibook.domain.entities.Permission;
import com.aptitekk.aptibook.domain.entities.UserGroup;
import com.aptitekk.aptibook.domain.repositories.UserGroupRepository;
import com.aptitekk.aptibook.service.entity.UserGroupService;
import com.aptitekk.aptibook.web.api.APIResponse;
import com.aptitekk.aptibook.web.api.annotations.APIController;
import com.aptitekk.aptibook.web.api.controllers.APIControllerAbstract;
import com.aptitekk.aptibook.web.api.dtos.ResourceDTO;
import com.aptitekk.aptibook.web.api.dtos.UserDTO;
import com.aptitekk.aptibook.web.api.dtos.UserGroupDTO;
import com.aptitekk.aptibook.web.api.validators.UserGroupValidator;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.websocket.server.PathParam;
import java.util.List;

@APIController
public class UserGroupController extends APIControllerAbstract {

    private final UserGroupRepository userGroupRepository;
    private final UserGroupService userGroupService;
    private final UserGroupValidator userGroupValidator;

    @Autowired
    public UserGroupController(UserGroupRepository userGroupRepository,
                               UserGroupService userGroupService,
                               UserGroupValidator userGroupValidator) {
        this.userGroupRepository = userGroupRepository;
        this.userGroupService = userGroupService;
        this.userGroupValidator = userGroupValidator;
    }

    /**
     * Fetches all the User Groups in a tree structure. Always returns the root User Group as the top-most User Group.
     * This endpoint is equivalent to calling the hierarchy down endpoint on the root User Group.
     */
    @RequestMapping(value = "/userGroups", method = RequestMethod.GET)
    public APIResponse getUserGroups() {
        return APIResponse.ok(modelMapper.map(userGroupRepository.findRootGroup(), UserGroupDTO.HierarchyDown.class));
    }

    @RequestMapping(value = "/userGroups/{id}", method = RequestMethod.GET)
    public APIResponse getUserGroup(@PathVariable Long id) {
        UserGroup userGroup = userGroupRepository.findInCurrentTenant(id);
        if (userGroup == null)
            return APIResponse.notFound("No user groups were found with the ID: " + id);

        return APIResponse.ok(modelMapper.map(userGroup, UserGroupDTO.class));
    }

    @RequestMapping(value = "/userGroups/{id}/children", method = RequestMethod.GET)
    public APIResponse getUserGroupChildren(@PathVariable Long id) {
        UserGroup userGroup = userGroupRepository.findInCurrentTenant(id);
        if (userGroup == null)
            return APIResponse.notFound("No user groups were found with the ID: " + id);

        return APIResponse.ok(modelMapper.map(userGroup.getChildren(), new TypeToken<List<UserGroupDTO>>() {}.getType()));
    }

    @RequestMapping(value = "/userGroups/{id}/children", method = RequestMethod.POST)
    public APIResponse addToUserGroupChildren(@PathVariable Long id, @RequestBody UserGroupDTO userGroupDTO) {

        // Check Permissions
        if (!authService.doesCurrentUserHavePermission(Permission.GROUPS_MODIFY_ALL))
            return APIResponse.noPermission();

        // Find the Parent User Group
        UserGroup userGroup = userGroupRepository.findInCurrentTenant(id);
        if (userGroup == null)
            return APIResponse.notFound("No user groups were found with the ID: " + id);

        // Create a new User Group entity.
        UserGroup newUserGroup = new UserGroup();

        // Check that the name was supplied and is valid.
        if (userGroupDTO.name == null)
            return APIResponse.badRequestMissingField("name");
        userGroupValidator.validateName(userGroupDTO.name, null);
        newUserGroup.setName(userGroupDTO.name);

        // Add the Parent User Group
        newUserGroup.setParent(userGroup);

        // Save the new User Group
        newUserGroup = userGroupRepository.save(newUserGroup);
        return APIResponse.created(modelMapper.map(newUserGroup, UserGroupDTO.class), "/userGroups/" + newUserGroup.getId());
    }

    @RequestMapping(value = "/userGroups/{id}/users", method = RequestMethod.GET)
    public APIResponse getUserGroupUsers(@PathVariable Long id) {
        UserGroup userGroup = userGroupRepository.findInCurrentTenant(id);
        if (userGroup == null)
            return APIResponse.notFound("No user groups were found with the ID: " + id);

        if (!authService.doesCurrentUserHavePermission(Permission.USERS_MODIFY_ALL)
                && !authService.doesCurrentUserHavePermission(Permission.GROUPS_MODIFY_ALL))
            return APIResponse.noPermission();

        return APIResponse.ok(modelMapper.map(userGroup.getUsers(), new TypeToken<List<UserDTO>>() {
        }.getType()));
    }

    @RequestMapping(value = "/userGroups/{id}/resources", method = RequestMethod.GET)
    public APIResponse getUserGroupResources(@PathVariable Long id) {
        UserGroup userGroup = userGroupRepository.findInCurrentTenant(id);
        if (userGroup == null)
            return APIResponse.notFound("No user groups were found with the ID: " + id);

        if (!authService.doesCurrentUserHavePermission(Permission.USERS_MODIFY_ALL)
                && !authService.doesCurrentUserHavePermission(Permission.GROUPS_MODIFY_ALL))
            return APIResponse.noPermission();

        return APIResponse.ok(modelMapper.map(userGroup.getResources(), new TypeToken<List<ResourceDTO>>() {
        }.getType()));
    }

    @RequestMapping(value = "/userGroups/{id}", method = RequestMethod.PATCH)
    public APIResponse patchUserGroup(@PathVariable Long id, @RequestBody UserGroupDTO userGroupDTO) {
        if (!authService.doesCurrentUserHavePermission(Permission.GROUPS_MODIFY_ALL))
            return APIResponse.noPermission();

        UserGroup userGroup = userGroupRepository.findInCurrentTenant(id);
        if (userGroup == null)
            return APIResponse.notFound("No group was found by the specified ID.");

        if (userGroupDTO.name != null) {
            userGroupValidator.validateName(userGroupDTO.name, userGroup);
            userGroup.setName(userGroupDTO.name);
        }

        userGroup = userGroupRepository.save(userGroup);
        return APIResponse.ok(modelMapper.map(userGroup, UserGroupDTO.class));
    }

    @RequestMapping(value = "/userGroups/{id}/move", method = RequestMethod.PATCH)
    public APIResponse moveUserGroup(@PathVariable Long id, @PathParam("newParentId") Long newParentId) {
        if (!authService.doesCurrentUserHavePermission(Permission.GROUPS_MODIFY_ALL))
            return APIResponse.noPermission();

        // Make sure that the selected User Group exists.
        UserGroup userGroup = userGroupRepository.findInCurrentTenant(id);
        if (userGroup == null)
            return APIResponse.notFound("No user groups were found with the ID: " + id);

        // Make sure that the new parent User Group exists.
        UserGroup newParentUserGroup = userGroupRepository.findInCurrentTenant(newParentId);
        if (newParentUserGroup == null)
            return APIResponse.notFound("The new parent group was not found.");

        // Make sure that the selected and parent groups are not the same groups.
        if (id.equals(newParentId))
            return APIResponse.forbidden("The current group and the new parent group must be different.");

        // Check if they are already where they should be.
        if (userGroup.getParent().equals(newParentUserGroup))
            return APIResponse.ok(modelMapper.map(userGroup, UserGroupDTO.class));

        // Make sure we are not placing the selected User Group below itself on the same branch.
        List<UserGroup> hierarchyDown = userGroupService.getHierarchyDown(userGroup);
        if (hierarchyDown.contains(newParentUserGroup))
            return APIResponse.forbidden("The new parent group cannot be below the current user group on the same branch.");

        userGroup.getParent().getChildren().remove(userGroup);
        userGroup.setParent(newParentUserGroup);
        userGroup = userGroupRepository.save(userGroup);

        //FIXME: Fix all users who now have more than one assigned group on the same branch.

        return APIResponse.ok(modelMapper.map(userGroup, UserGroupDTO.class));
    }

    @RequestMapping(value = "/userGroups/{id}", method = RequestMethod.DELETE)
    public APIResponse deleteUserGroup(@PathVariable Long id) {
        if (!authService.doesCurrentUserHavePermission(Permission.GROUPS_MODIFY_ALL))
            return APIResponse.noPermission();

        UserGroup userGroup = userGroupRepository.findInCurrentTenant(id);
        if (userGroup == null)
            return APIResponse.notFound("No user groups were found with the ID: " + id);

        if (userGroup.isRoot())
            return APIResponse.forbidden("The Root Group cannot be deleted.");

        // Move children groups upwards.
        userGroup.getParent().getChildren().addAll(userGroup.getChildren());
        for (UserGroup child : userGroup.getChildren()) {
            child.setParent(userGroup.getParent());
            userGroupRepository.save(child);
        }

        userGroup.getParent().getChildren().remove(userGroup);
        userGroup.getChildren().clear();

        userGroupRepository.delete(userGroup);

        return APIResponse.noContentResponse();
    }


}
