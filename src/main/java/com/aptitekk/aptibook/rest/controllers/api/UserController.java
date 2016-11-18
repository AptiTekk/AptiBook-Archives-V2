/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.crypto.PasswordStorage;
import com.aptitekk.aptibook.core.domain.entities.Permission;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.apache.commons.validator.routines.EmailValidator;
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

            return ok(users);
        }

        return noPermission();
    }

    @RequestMapping(value = "/users/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getUser(@PathVariable long id) {
        User user = userRepository.findInCurrentTenant(id);

        if (user != null &&
                (user.equals(authService.getCurrentUser()) || authService.doesCurrentUserHavePermission(Permission.Descriptor.USERS_MODIFY_ALL))) {
            return ok(user);
        }

        return noPermission();
    }


    @RequestMapping(value = "/users/{id}", method = RequestMethod.PATCH)
    public ResponseEntity<?> deleteUser(@PathVariable long id, @RequestBody UserPatch userPatch) {
        if (userPatch != null) {
            User currentUser = userRepository.findInCurrentTenant(id);
            if (currentUser != null &&
                    (currentUser.equals(authService.getCurrentUser()) || authService.doesCurrentUserHavePermission(Permission.Descriptor.USERS_MODIFY_ALL))) {

                User otherUser = userRepository.findByEmailAddress(userPatch.getEmailAddress());
                if (otherUser != null && !otherUser.getId().equals(id))
                    return badRequest("The Email Address is already in use.");

                if (userPatch.getEmailAddress() != null)
                    if (!currentUser.isAdmin() && !EmailValidator.getInstance().isValid(userPatch.getEmailAddress()))
                        return badRequest("The Email Address is invalid.");
                    else
                        currentUser.setEmailAddress(userPatch.getEmailAddress());

                if (userPatch.getFirstName() != null)
                    if (!userPatch.getFirstName().matches("[^<>;=]*"))
                        return badRequest("The First Name cannot contain these characters: < > ; =");
                    else if (userPatch.getFirstName().length() > 30)
                        return badRequest("The First Name must be 30 characters or less.");
                    else
                        currentUser.setFirstName(userPatch.getFirstName());

                if (userPatch.getLastName() != null)
                    if (!userPatch.getLastName().matches("[^<>;=]*"))
                        return badRequest("The Last Name cannot contain these characters: < > ; =");
                    else if (userPatch.getLastName().length() > 30)
                        return badRequest("The Last Name must be 30 characters or less.");
                    else
                        currentUser.setLastName(userPatch.getLastName());

                if (userPatch.getPhoneNumber() != null)
                    if (!userPatch.getPhoneNumber().matches("[^<>;=]*"))
                        return badRequest("The Phone Number cannot contain these characters: < > ; =");
                    else if (userPatch.getFirstName().length() > 30)
                        return badRequest("The Phone Number must be 30 characters or less.");
                    else
                        currentUser.setPhoneNumber(userPatch.getPhoneNumber());

                if (userPatch.getLocation() != null)
                    if (!userPatch.getLocation().matches("[^<>;=]*"))
                        return badRequest("The Location cannot contain these characters: < > ; =");
                    else if (userPatch.getFirstName().length() > 250)
                        return badRequest("The Location must be 250 characters or less.");
                    else
                        currentUser.setLocation(userPatch.getLocation());

                if (userPatch.getNewPassword() != null)
                    if (userPatch.getNewPassword().length() > 30)
                        return badRequest("The Password must be 30 characters or less.");
                    else
                        try {
                            currentUser.setHashedPassword(PasswordStorage.createHash(userPatch.getNewPassword()));
                        } catch (PasswordStorage.CannotPerformOperationException e) {
                            logService.logException(getClass(), e, "Could not hash password from PATCH.");
                            return serverError("Could not save new password.");
                        }

                userRepository.save(currentUser);

                return ok(currentUser);
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

    @JsonIgnoreProperties({"userGroups"})
    private static class UserPatch extends User {

        private String newPassword;

        String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }

}
