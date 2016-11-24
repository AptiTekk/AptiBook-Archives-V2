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
import com.aptitekk.aptibook.core.domain.rest.dtos.UserDTO;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
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
    public ResponseEntity<?> patchUser(@PathVariable long id, @RequestBody UserDTO.WithNewPassword userDTO) {
        if (userDTO != null) {
            User currentUser = userRepository.findInCurrentTenant(id);
            if (currentUser != null &&
                    (currentUser.equals(authService.getCurrentUser()) || authService.doesCurrentUserHavePermission(Permission.Descriptor.USERS_MODIFY_ALL))) {

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
                        currentUser.setFirstName(userDTO.firstName);

                if (userDTO.lastName != null)
                    if (!userDTO.lastName.matches("[^<>;=]*"))
                        return badRequest("The Last Name cannot contain these characters: < > ; =");
                    else if (userDTO.lastName.length() > 30)
                        return badRequest("The Last Name must be 30 characters or less.");
                    else
                        currentUser.setLastName(userDTO.lastName);

                if (userDTO.phoneNumber != null)
                    if (!userDTO.phoneNumber.matches("[^<>;=]*"))
                        return badRequest("The Phone Number cannot contain these characters: < > ; =");
                    else if (userDTO.phoneNumber.length() > 30)
                        return badRequest("The Phone Number must be 30 characters or less.");
                    else
                        currentUser.setPhoneNumber(userDTO.phoneNumber);

                if (userDTO.location != null)
                    if (!userDTO.location.matches("[^<>;=]*"))
                        return badRequest("The Location cannot contain these characters: < > ; =");
                    else if (userDTO.location.length() > 250)
                        return badRequest("The Location must be 250 characters or less.");
                    else
                        currentUser.setLocation(userDTO.location);

                if (userDTO.newPassword != null)
                    if (userDTO.newPassword.length() > 30)
                        return badRequest("The Password must be 30 characters or less.");
                    else
                        try {
                            currentUser.setHashedPassword(PasswordStorage.createHash(userDTO.newPassword));
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

}
