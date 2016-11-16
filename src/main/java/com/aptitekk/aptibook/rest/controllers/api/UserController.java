/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.Permission;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.entities.UserGroup;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

@APIController
public class UserController extends APIControllerAbstract {

    private final UserRepository userRepository;

    @Autowired
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @RequestMapping(value = "/users", method = RequestMethod.GET)
    public ResponseEntity<?> getUsers() {
        if (authService.doesCurrentUserHavePermission(Permission.Descriptor.USERS_MODIFY_ALL)) {
            List<User> users = userRepository.findAll();
            for (User user : users) {
                user.setNotifications(null);
                user.setPermissions(null);
                for (UserGroup userGroup : user.getUserGroups()) {
                    userGroup.setUsers(null);
                    userGroup.setPermissions(null);
                    userGroup.setResources(null);
                    userGroup.setParent(null);
                    userGroup.setChildren(null);
                    userGroup.setReservationDecisions(null);
                }
            }

            return ok(users);
        }

        return noPermission();
    }

    @RequestMapping(value = "/users/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getUser(@PathVariable long id) {
        User user = userRepository.findInCurrentTenant(id);

        if (user != null &&
                (user.equals(authService.getCurrentUser()) || authService.doesCurrentUserHavePermission(Permission.Descriptor.USERS_MODIFY_ALL))) {
            for (UserGroup userGroup : user.getUserGroups()) {
                userGroup.setParent(null);
                userGroup.setUsers(null);
                userGroup.setReservationDecisions(null);
                userGroup.setResources(null);
                userGroup.setChildren(null);
            }
            return ok(user);
        }

        return noPermission();
    }


    @RequestMapping(value = "/users/{id}", method = RequestMethod.PATCH)
    public ResponseEntity<?> deleteUser(@PathVariable long id, @RequestBody User user) {
        if (user != null) {
            User currentUser = userRepository.findInCurrentTenant(id);
            if (currentUser != null &&
                    (currentUser.equals(authService.getCurrentUser()) || authService.doesCurrentUserHavePermission(Permission.Descriptor.USERS_MODIFY_ALL))) {
                if (!currentUser.isAdmin()) {
                    if (user.isAdmin())
                        return badRequest("Cannot promote non-admin to admin.");
                    if (user.getEmailAddress().equals("admin"))
                        return badRequest("The Email Address 'admin' is reserved.");
                }

                User otherUser = userRepository.findByEmailAddress(user.getEmailAddress());
                if (otherUser != null && !otherUser.equals(user))
                    return badRequest("The Email Address is already in use.");

                //TODO: Check fields for valid content
            }

            return noPermission();
        }

        return badRequest("User was not supplied.");
    }

    @RequestMapping(value = "/users/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteUser(@PathVariable long id) {
        User user = userRepository.findInCurrentTenant(id);

        if (user != null && authService.doesCurrentUserHavePermission(Permission.Descriptor.USERS_MODIFY_ALL)) {
            userRepository.delete(user);
            return noContent();
        }

        return noPermission();
    }

}
