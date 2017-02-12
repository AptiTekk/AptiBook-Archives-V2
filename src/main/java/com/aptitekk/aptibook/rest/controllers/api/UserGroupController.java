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

    @Autowired
    public UserGroupController(UserGroupRepository userGroupRepository, UserGroupService userGroupService) {
        this.userGroupRepository = userGroupRepository;
        this.userGroupService = userGroupService;
    }

    @RequestMapping(value = "/userGroups", method = RequestMethod.GET)
    public ResponseEntity<?> getUserGroups() {

        if (authService.isUserSignedIn()) {
            return ok(modelMapper.map(userGroupRepository.findRootGroup(), UserGroupDTO.WithoutParent.class));
        }

        return noPermission();
    }

    @RequestMapping(value = "/userGroups", method = RequestMethod.POST)
    public ResponseEntity<?> addNewUserGroup(@RequestBody UserGroupDTO userGroupDTO) {

        if (!authService.isUserSignedIn())
            return unauthorized();

        if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.GROUPS_MODIFY_ALL))
            return noPermission();

        if (userGroupDTO.name == null)
            return badRequest("The User Group has no name.");

        if (userGroupDTO.parent == null)
            return badRequest("The User Group has no parent.");

        UserGroup parentGroup = userGroupRepository.findByName(userGroupDTO.parent.name);
        if (parentGroup == null)
            return badRequest("The Parent User Group could not be found.");

        UserGroup userGroup = new UserGroup();
        userGroup.name = userGroupDTO.name;
        userGroup.parent = parentGroup;

        userGroup = userGroupRepository.save(userGroup);
        return created(modelMapper.map(userGroup, UserGroupDTO.class), "/userGroups/" + userGroup.id);
    }

    @RequestMapping(value = "/userGroups/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getUserGroup(@PathVariable Long id) {

        if (!authService.isUserSignedIn())
            return unauthorized();

        UserGroup userGroup = userGroupRepository.findInCurrentTenant(id);
        if (userGroup == null)
            return badRequest("User Group could not be found.");

        return ok(modelMapper.map(userGroup, UserGroupDTO.WithoutParentOrChildren.class));
    }

    @RequestMapping(value = "/userGroups/{id}/users", method = RequestMethod.GET)
    public ResponseEntity<?> getUserGroupUsers(@PathVariable Long id) {

        if (!authService.isUserSignedIn())
            return unauthorized();

        UserGroup userGroup = userGroupRepository.findInCurrentTenant(id);
        if (userGroup == null)
            return badRequest("User Group could not be found.");

        if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.USERS_MODIFY_ALL)
                && !authService.doesCurrentUserHavePermission(Permission.Descriptor.GROUPS_MODIFY_ALL))
            return noPermission();

        return ok(modelMapper.map(userGroup.users, new TypeToken<List<UserDTO>>() {
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
            return badRequest("User Group not found.");

        if (userGroupDTO == null)
            return badRequest("User Group was not supplied.");

        if (userGroupDTO.name != null)
            if (userGroupDTO.name.length() > 30)
                return badRequest("The Name must be 30 characters or less.");
            else if (!userGroupDTO.name.matches("[^<>;=]*"))
                return badRequest("The Name cannot contain these characters: < > ; =");
            else
                userGroup.name = userGroupDTO.name;

        userGroup = userGroupRepository.save(userGroup);
        return ok(modelMapper.map(userGroup, UserGroupDTO.WithoutParentOrChildren.class));
    }

    @RequestMapping(value = "/userGroups/{id}/move", method = RequestMethod.PATCH)
    public ResponseEntity<?> moveUserGroup(@PathVariable Long id, @PathParam("newParentId") Long newParentId) {
        if (!authService.isUserSignedIn())
            return unauthorized();

        if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.GROUPS_MODIFY_ALL))
            return noPermission();

        UserGroup userGroup = userGroupRepository.findInCurrentTenant(id);
        if (userGroup == null)
            return badRequest("User Group not found.");

        UserGroup newParentUserGroup = userGroupRepository.findInCurrentTenant(newParentId);
        if (newParentUserGroup == null)
            return badRequest("New Parent User Group not found.");

        if (id.equals(newParentId))
            return badRequest("This User Group and the New Parent User Group cannot be the same.");

        if (userGroup.parent.equals(newParentUserGroup))
            return ok(modelMapper.map(userGroup, UserGroupDTO.WithoutParentOrChildren.class));

        List<UserGroup> hierarchyDown = userGroupService.getHierarchyDown(userGroup);
        if (hierarchyDown.contains(newParentUserGroup))
            return badRequest("The New Parent User Group cannot be below this User Group on the same branch.");

        userGroup.parent.children.remove(userGroup);
        userGroup.parent = newParentUserGroup;
        userGroup = userGroupRepository.save(userGroup);
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
            return badRequest("User Group could not be found.");

        if (userGroup.isRoot())
            return badRequest("The Root Group cannot be deleted.");

        // Move children groups upwards.
        userGroup.parent.children.addAll(userGroup.children);
        for (UserGroup child : userGroup.children) {
            child.parent = userGroup.parent;
            userGroupRepository.save(child);
        }

        userGroup.parent.children.remove(userGroup);
        userGroup.children.clear();

        userGroupRepository.delete(userGroup);

        return noContent();
    }

    @RequestMapping(value = "/userGroups/hierarchyDown/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getUserGroupsHierarchyDown(@PathVariable Long id) {
        if (id == null)
            return badRequest("Missing ID");

        if (!authService.isUserSignedIn())
            return unauthorized();

        UserGroup userGroup = userGroupRepository.findInCurrentTenant(id);
        if (userGroup == null)
            return badRequest("UserGroup not found.");

        return ok(modelMapper.map(userGroupService.getHierarchyDown(userGroup), new TypeToken<List<UserGroupDTO.WithoutParentOrChildren>>() {
        }.getType()));
    }

    @RequestMapping(value = "/userGroups/hierarchyUp/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getUserGroupsHierarchyUp(@PathVariable Long id) {
        if (id == null)
            return badRequest("Missing ID");

        if (!authService.isUserSignedIn())
            return unauthorized();

        UserGroup userGroup = userGroupRepository.findInCurrentTenant(id);
        if (userGroup == null)
            return badRequest("UserGroup not found.");

        return ok(modelMapper.map(userGroupService.getHierarchyUp(userGroup), new TypeToken<List<UserGroupDTO.WithoutParentOrChildren>>() {
        }.getType()));
    }
}
