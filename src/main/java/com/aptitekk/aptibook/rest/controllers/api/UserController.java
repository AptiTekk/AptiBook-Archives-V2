/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.crypto.PasswordStorage;
import com.aptitekk.aptibook.core.domain.entities.Permission;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.entities.UserGroup;
import com.aptitekk.aptibook.core.domain.repositories.UserGroupRepository;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.UserDTO;
import com.aptitekk.aptibook.core.domain.rest.dtos.UserGroupDTO;
import com.aptitekk.aptibook.core.services.entity.UserGroupService;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.apache.commons.validator.routines.EmailValidator;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.websocket.server.PathParam;
import java.util.ArrayList;
import java.util.List;

@APIController
public class UserController extends APIControllerAbstract {

    private final UserRepository userRepository;
    private final UserGroupRepository userGroupRepository;
    private final UserGroupService userGroupService;

    @Autowired
    public UserController(
            UserRepository userRepository,
            UserGroupRepository userGroupRepository,
            UserGroupService userGroupService) {
        this.userRepository = userRepository;
        this.userGroupRepository = userGroupRepository;
        this.userGroupService = userGroupService;
    }

    @RequestMapping(value = "/users", method = RequestMethod.GET)
    public ResponseEntity<?> getUsers() {
        if (authService.doesCurrentUserHavePermission(Permission.Descriptor.USERS_MODIFY_ALL)) {
            List<User> users = userRepository.findAll();

            return ok(modelMapper.map(users, new TypeToken<List<UserDTO>>() {
            }.getType()));
        }

        return noPermission();
    }

    @RequestMapping(value = "/users/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getUser(@PathVariable long id) {
        User user = userRepository.findInCurrentTenant(id);

        if (user != null &&
                (user.equals(authService.getCurrentUser()) || authService.doesCurrentUserHavePermission(Permission.Descriptor.USERS_MODIFY_ALL))) {
            return ok(modelMapper.map(user, UserDTO.class));
        }

        return noPermission();
    }


    @RequestMapping(value = "/users/{id}", method = RequestMethod.PATCH)
    public ResponseEntity<?> patchUser(@PathVariable Long id, @RequestBody UserDTO.WithNewPassword userDTO, @PathParam("passwordOnly") boolean passwordOnly) {
        if (userDTO != null) {
            User currentUser = userRepository.findInCurrentTenant(id);
            if (currentUser != null &&
                    (currentUser.equals(authService.getCurrentUser()) || authService.doesCurrentUserHavePermission(Permission.Descriptor.USERS_MODIFY_ALL))) {

                if (!passwordOnly) {
                    User otherUser = userRepository.findByEmailAddress(userDTO.emailAddress);
                    if (otherUser != null && !otherUser.getId().equals(id))
                        return badRequest("The Email Address is already in use.");

                    if (userDTO.emailAddress != null)
                        if (!currentUser.isAdmin() && !EmailValidator.getInstance().isValid(userDTO.emailAddress))
                            return badRequest("The Email Address is invalid.");
                        else
                            currentUser.setEmailAddress(userDTO.emailAddress);

                    if (userDTO.firstName != null)
                        if (!userDTO.firstName.matches("[^<>;=]*"))
                            return badRequest("The First Name cannot contain these characters: < > ; =");
                        else if (userDTO.firstName.length() > 30)
                            return badRequest("The First Name must be 30 characters or less.");
                        else
                            currentUser.firstName = userDTO.firstName;

                    if (userDTO.lastName != null)
                        if (!userDTO.lastName.matches("[^<>;=]*"))
                            return badRequest("The Last Name cannot contain these characters: < > ; =");
                        else if (userDTO.lastName.length() > 30)
                            return badRequest("The Last Name must be 30 characters or less.");
                        else
                            currentUser.lastName = userDTO.lastName;

                    if (userDTO.phoneNumber != null)
                        if (!userDTO.phoneNumber.matches("[^<>;=]*"))
                            return badRequest("The Phone Number cannot contain these characters: < > ; =");
                        else if (userDTO.phoneNumber.length() > 30)
                            return badRequest("The Phone Number must be 30 characters or less.");
                        else
                            currentUser.phoneNumber = userDTO.phoneNumber;

                    if (userDTO.location != null)
                        if (!userDTO.location.matches("[^<>;=]*"))
                            return badRequest("The Location cannot contain these characters: < > ; =");
                        else if (userDTO.location.length() > 250)
                            return badRequest("The Location must be 250 characters or less.");
                        else
                            currentUser.location = userDTO.location;
                }

                if (userDTO.newPassword != null)
                    if (userDTO.newPassword.length() > 30)
                        return badRequest("The Password must be 30 characters or less.");
                    else
                        try {
                            currentUser.hashedPassword = PasswordStorage.createHash(userDTO.newPassword);
                        } catch (PasswordStorage.CannotPerformOperationException e) {
                            logService.logException(getClass(), e, "Could not hash password from PATCH.");
                            return serverError("Could not save new password.");
                        }

                if (userDTO.userGroups != null) {
                    if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.USERS_MODIFY_ALL))
                        return noPermission("You may not modify User Groups.");

                    List<UserGroup> newUserGroupList = new ArrayList<>();
                    for (UserGroupDTO userGroupDTO : userDTO.userGroups) {
                        if (userGroupDTO.id == null)
                            return badRequest("A User Group is missing an ID.");

                        UserGroup userGroup = userGroupRepository.findInCurrentTenant(userGroupDTO.id);

                        // Make sure the group exists.
                        if (userGroup == null)
                            return badRequest("A User Group was not found.");

                        // Make sure the group is not root
                        if (userGroup.isRoot())
                            return badRequest("You may not assign a user to the root group.");

                        // Make sure there are not other groups being assigned on this same branch.
                        List<UserGroup> hierarchyDown = userGroupService.getHierarchyDown(userGroup);
                        for (UserGroup otherGroup : newUserGroupList) {
                            if (hierarchyDown.contains(otherGroup))
                                return badRequest("You may not assign a user to two or more groups of the same branch.");
                        }

                        newUserGroupList.add(userGroup);
                    }

                    for (UserGroup userGroup : currentUser.userGroups) {
                        userGroup.getUsers().remove(currentUser);
                    }

                    currentUser.userGroups = newUserGroupList;
                }

                userRepository.save(currentUser);

                return ok(modelMapper.map(currentUser, UserDTO.class));
            }

            return noPermission();
        }

        return badRequest("User was not supplied.");
    }

    @RequestMapping(value = "/users/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteUser(@PathVariable long id) {
        User user = userRepository.findInCurrentTenant(id);

        if (user != null) {
            if (user.isAdmin())
                return badRequest("Admin cannot be deleted.");
            if (authService.doesCurrentUserHavePermission(Permission.Descriptor.USERS_MODIFY_ALL)) {
                userRepository.delete(user);
                return noContent();
            }
        }

        return noPermission();
    }

}
