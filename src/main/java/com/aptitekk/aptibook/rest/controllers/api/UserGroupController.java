/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.Permission;
import com.aptitekk.aptibook.core.domain.entities.UserGroup;
import com.aptitekk.aptibook.core.domain.repositories.UserGroupRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.UserDTO;
import com.aptitekk.aptibook.core.domain.rest.dtos.UserGroupDTO;
import com.aptitekk.aptibook.core.services.entity.UserGroupService;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import com.aptitekk.aptibook.rest.controllers.api.validators.UserGroupValidator;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    private UserGroupValidator userGroupValidator;

    @Autowired
    public UserGroupController(UserGroupRepository userGroupRepository,
                               UserGroupService userGroupService,
                               UserGroupValidator userGroupValidator) {
        this.userGroupRepository = userGroupRepository;
        this.userGroupService = userGroupService;
        this.userGroupValidator = userGroupValidator;
    }

    @RequestMapping(value = "/userGroups", method = RequestMethod.GET)
    public ResponseEntity<?> getUserGroups() {

        if (!authService.isUserSignedIn())
            return noPermission();

        return ok(modelMapper.map(userGroupRepository.findRootGroup(), UserGroupDTO.WithoutParent.class));
    }

    @RequestMapping(value = "/userGroups", method = RequestMethod.POST)
    public ResponseEntity<?> addNewUserGroup(@RequestBody UserGroupDTO userGroupDTO) {

        if (!authService.isUserSignedIn())
            return unauthorized();

        if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.GROUPS_MODIFY_ALL))
            return noPermission();

        UserGroup userGroup = new UserGroup();

        if (userGroupDTO.name == null)
            return badRequest("The group name was not supplied.");

        userGroupValidator.validateName(userGroupDTO.name, null);
        userGroup.setName(userGroupDTO.name);

        if (userGroupDTO.parent == null)
            return badRequest("The group parent was not supplied.");

        UserGroup parentGroup = userGroupRepository.findByName(userGroupDTO.parent.name);
        if (parentGroup == null)
            return badRequest("The group parent could not be found.");

        userGroup.setParent(parentGroup);

        userGroup = userGroupRepository.save(userGroup);
        return created(modelMapper.map(userGroup, UserGroupDTO.class), "/userGroups/" + userGroup.getId());
    }

    @RequestMapping(value = "/userGroups/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getUserGroup(@PathVariable Long id) {
        if (!authService.isUserSignedIn())
            return unauthorized();

        UserGroup userGroup = userGroupRepository.findInCurrentTenant(id);
        if (userGroup == null)
            return notFound("No user groups were found with the ID: "+id);

        return ok(modelMapper.map(userGroup, UserGroupDTO.WithoutParentOrChildren.class));
    }

    @RequestMapping(value = "/userGroups/{id}/users", method = RequestMethod.GET)
    public ResponseEntity<?> getUserGroupUsers(@PathVariable Long id) {
        if (!authService.isUserSignedIn())
            return unauthorized();

        UserGroup userGroup = userGroupRepository.findInCurrentTenant(id);
        if (userGroup == null)
            return notFound("No user groups were found with the ID: "+id);

        if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.USERS_MODIFY_ALL)
                && !authService.doesCurrentUserHavePermission(Permission.Descriptor.GROUPS_MODIFY_ALL))
            return noPermission();

        return ok(modelMapper.map(userGroup.getUsers(), new TypeToken<List<UserDTO>>() {
        }.getType()));
    }

    @RequestMapping(value = "/userGroups/{id}", method = RequestMethod.PATCH)
    public ResponseEntity<?> patchUserGroup(@PathVariable Long id, @RequestBody UserGroupDTO.WithoutParentOrChildren userGroupDTO) {
        if (!authService.isUserSignedIn())
            return unauthorized();

        if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.GROUPS_MODIFY_ALL))
            return noPermission();

        UserGroup userGroup = userGroupRepository.findInCurrentTenant(id);
        if (userGroup == null)
            return badRequest("No group was found by the specified ID.");

        if (userGroupDTO.name != null) {
            userGroupValidator.validateName(userGroupDTO.name, userGroup);
            userGroup.setName(userGroupDTO.name);
        }

        userGroup = userGroupRepository.save(userGroup);
        return ok(modelMapper.map(userGroup, UserGroupDTO.WithoutParentOrChildren.class));
    }

    @RequestMapping(value = "/userGroups/{id}/move", method = RequestMethod.PATCH)
    public ResponseEntity<?> moveUserGroup(@PathVariable Long id, @PathParam("newParentId") Long newParentId) {
        if (!authService.isUserSignedIn())
            return unauthorized();

        if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.GROUPS_MODIFY_ALL))
            return noPermission();

        // Make sure that the selected User Group exists.
        UserGroup userGroup = userGroupRepository.findInCurrentTenant(id);
        if (userGroup == null)
            return notFound("No user groups were found with the ID: " + id);

        // Make sure that the new parent User Group exists.
        UserGroup newParentUserGroup = userGroupRepository.findInCurrentTenant(newParentId);
        if (newParentUserGroup == null)
            return badRequest("The new parent group was not found.");

        // Make sure that the selected and parent groups are not the same groups.
        if (id.equals(newParentId))
            return badRequest("This group and the new parent group must be different.");

        // Check if they are already where they should be.
        if (userGroup.getParent().equals(newParentUserGroup))
            return ok(modelMapper.map(userGroup, UserGroupDTO.WithoutParentOrChildren.class));

        // Make sure we are not placing the selected User Group below itself on the same branch.
        List<UserGroup> hierarchyDown = userGroupService.getHierarchyDown(userGroup);
        if (hierarchyDown.contains(newParentUserGroup))
            return badRequest("The new parent group is below this user group on the same branch.");

        userGroup.getParent().getChildren().remove(userGroup);
        userGroup.setParent(newParentUserGroup);
        userGroup = userGroupRepository.save(userGroup);

        //FIXME: Fix all users who now have more than one assigned group on the same branch.

        return ok(modelMapper.map(userGroup, UserGroupDTO.WithoutParentOrChildren.class));
    }

    @RequestMapping(value = "/userGroups/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteUserGroup(@PathVariable Long id) {

        if (!authService.isUserSignedIn())
            return unauthorized();

        if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.GROUPS_MODIFY_ALL))
            return noPermission();

        UserGroup userGroup = userGroupRepository.findInCurrentTenant(id);
        if (userGroup == null)
            return notFound("No user groups were found with the ID: " + id);

        if (userGroup.isRoot())
            return badRequest("The Root Group cannot be deleted.");

        // Move children groups upwards.
        userGroup.getParent().getChildren().addAll(userGroup.getChildren());
        for (UserGroup child : userGroup.getChildren()) {
            child.setParent(userGroup.getParent());
            userGroupRepository.save(child);
        }

        userGroup.getParent().getChildren().remove(userGroup);
        userGroup.getChildren().clear();

        userGroupRepository.delete(userGroup);

        return noContent();
    }

    @RequestMapping(value = "/userGroups/hierarchyDown/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getUserGroupsHierarchyDown(@PathVariable Long id) {
        if (!authService.isUserSignedIn())
            return unauthorized();

        UserGroup userGroup = userGroupRepository.findInCurrentTenant(id);
        if (userGroup == null)
            return notFound("No user groups were found with the ID: " + id);

        return ok(modelMapper.map(userGroupService.getHierarchyDown(userGroup), new TypeToken<List<UserGroupDTO.WithoutParentOrChildren>>() {
        }.getType()));
    }

    @RequestMapping(value = "/userGroups/hierarchyUp/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getUserGroupsHierarchyUp(@PathVariable Long id) {
        if (!authService.isUserSignedIn())
            return unauthorized();

        UserGroup userGroup = userGroupRepository.findInCurrentTenant(id);
        if (userGroup == null)
            return notFound("No user groups were found with the ID: " + id);

        return ok(modelMapper.map(userGroupService.getHierarchyUp(userGroup), new TypeToken<List<UserGroupDTO.WithoutParentOrChildren>>() {
        }.getType()));
    }
}
