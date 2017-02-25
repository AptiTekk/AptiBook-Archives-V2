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
import com.aptitekk.aptibook.core.services.EmailService;
import com.aptitekk.aptibook.core.services.entity.NotificationService;
import com.aptitekk.aptibook.core.services.entity.UserGroupService;
import com.aptitekk.aptibook.core.util.PasswordGenerator;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import com.aptitekk.aptibook.rest.controllers.api.validators.UserValidator;
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
public class UserController extends APIControllerAbstract {

    private final UserRepository userRepository;
    private final UserValidator userValidator;
    private final UserGroupRepository userGroupRepository;
    private final UserGroupService userGroupService;
    private final EmailService emailService;
    private final NotificationService notificationService;

    @Autowired
    public UserController(
            UserRepository userRepository,
            UserValidator userValidator,
            UserGroupRepository userGroupRepository,
            UserGroupService userGroupService,
            EmailService emailService,
            NotificationService notificationService) {
        this.userRepository = userRepository;
        this.userValidator = userValidator;
        this.userGroupRepository = userGroupRepository;
        this.userGroupService = userGroupService;
        this.emailService = emailService;
        this.notificationService = notificationService;
    }

    @RequestMapping(value = "/users", method = RequestMethod.GET)
    public ResponseEntity<?> getUsers() {
        if (!authService.isUserSignedIn())
            return unauthorized();

        if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.USERS_MODIFY_ALL))
            return noPermission();

        List<User> users = userRepository.findAll();

        return ok(modelMapper.map(users, new TypeToken<List<UserDTO>>() {
        }.getType()));
    }

    @RequestMapping(value = "/users", method = RequestMethod.POST)
    public ResponseEntity<?> addNewUser(@RequestBody UserDTO userDTO) {
        if (!authService.isUserSignedIn())
            return unauthorized();

        if (userDTO == null)
            return badRequest("The User data was not supplied.");

        if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.USERS_MODIFY_ALL))
            return noPermission();

        User newUser = new User();

        if (userDTO.emailAddress == null)
            return badRequest("The Email Address was not supplied.");

        userValidator.validateEmailAddress(userDTO.emailAddress, null);
        newUser.setEmailAddress(userDTO.emailAddress);

        if (userDTO.firstName != null) {
            userValidator.validateFirstName(userDTO.firstName);
            newUser.firstName = userDTO.firstName;
        }

        if (userDTO.lastName != null) {
            userValidator.validateLastName(userDTO.lastName);
            newUser.lastName = userDTO.lastName;
        }

        if (userDTO.phoneNumber != null) {
            userValidator.validatePhoneNumber(userDTO.phoneNumber);
            newUser.phoneNumber = userDTO.phoneNumber;
        }

        if (userDTO.location != null) {
            userValidator.validateLocation(userDTO.location);
            newUser.location = userDTO.location;
        }

        if (userDTO.userGroups != null) {
            newUser.userGroups = userValidator.validateUserGroups(userDTO.userGroups, null);
        }

        String newPassword = PasswordGenerator.generateRandomPassword(10);
        try {
            newUser.hashedPassword = PasswordStorage.createHash(newPassword);
        } catch (PasswordStorage.CannotPerformOperationException e) {
            logService.logException(getClass(), e, "Could not generate new User's password.");
            return serverError("The User's password could not be generated.");
        }

        newUser.verified = true;
        newUser.userState = User.State.APPROVED;
        newUser = userRepository.save(newUser);

        emailService.sendEmailNotification(newUser.getEmailAddress(),
                "Welcome to AptiBook!",
                "Hello! An account has been created for you on AptiBook."
                        + "<p>You can sign in to AptiBook using the URL and credentials below. Once you sign in, you can change your password by clicking <b>My Account</b> on the navigation bar.<br>"
                        + webURIBuilderService.buildURI("/" + newUser.tenant.slug, null) + "</p>"
                        + "<center>"
                        + "Email Address: <b>" + newUser.getEmailAddress() + "</b> <br>"
                        + "Password: <b>" + newPassword + "</b>"
                        + "</center>"
                        + "<p>Please let us know of any way we can be of assistance, and be sure to check out our knowledge base at https://support.aptitekk.com/. Enjoy!</p>");

        return created(modelMapper.map(newUser, UserDTO.class), "/users/" + newUser.getId());
    }

    @RequestMapping(value = "/users/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getUser(@PathVariable long id) {
        if (!authService.isUserSignedIn())
            return unauthorized();

        User user = userRepository.findInCurrentTenant(id);
        if (user == null)
            return notFound("No users were found with the ID: " + id);

        if (!user.equals(authService.getCurrentUser()))
            if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.USERS_MODIFY_ALL))
                return noPermission();

        return ok(modelMapper.map(user, UserDTO.class));
    }

    @RequestMapping(value = "/users/{id}", method = RequestMethod.PATCH)
    public ResponseEntity<?> patchUser(@PathVariable Long id, @RequestBody UserDTO.WithNewPassword userDTO, @PathParam("passwordOnly") boolean passwordOnly) {
        if (!authService.isUserSignedIn())
            return unauthorized();

        if (userDTO == null)
            return badRequest("The User data was not supplied.");

        User currentUser = userRepository.findInCurrentTenant(id);
        if (currentUser == null)
            return notFound("No users were found with the ID: " + id);

        if (!currentUser.equals(authService.getCurrentUser()))
            if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.USERS_MODIFY_ALL))
                return noPermission();

        // If Password Only is true, then we do not need to worry about updating this data.
        if (!passwordOnly) {
            if (userDTO.emailAddress != null) {
                userValidator.validateEmailAddress(userDTO.emailAddress, currentUser);
                currentUser.setEmailAddress(userDTO.emailAddress);
            }

            if (userDTO.firstName != null) {
                userValidator.validateFirstName(userDTO.firstName);
                currentUser.firstName = userDTO.firstName;
            }

            if (userDTO.lastName != null) {
                userValidator.validateLastName(userDTO.lastName);
                currentUser.lastName = userDTO.lastName;
            }

            if (userDTO.phoneNumber != null) {
                userValidator.validatePhoneNumber(userDTO.phoneNumber);
                currentUser.phoneNumber = userDTO.phoneNumber;
            }

            if (userDTO.location != null) {
                userValidator.validateLocation(userDTO.location);
                currentUser.location = userDTO.location;
            }
        }

        if (userDTO.newPassword != null) {
            userValidator.validatePassword(userDTO.newPassword);

            try {
                currentUser.hashedPassword = PasswordStorage.createHash(userDTO.newPassword);
            } catch (PasswordStorage.CannotPerformOperationException e) {
                logService.logException(getClass(), e, "Could not hash password from PATCH.");
                return serverError("Could not save new password.");
            }
        }

        if (userDTO.userGroups != null) {
            if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.USERS_MODIFY_ALL))
                return noPermission("You may not modify User Groups.");

            List<UserGroup> userGroupList = userValidator.validateUserGroups(userDTO.userGroups, currentUser);

            for (UserGroup userGroup : currentUser.userGroups) {
                userGroup.users.remove(currentUser);
            }

            currentUser.userGroups = userGroupList;
        }

        userRepository.save(currentUser);

        return ok(modelMapper.map(currentUser, UserDTO.class));
    }

    @RequestMapping(value = "/users/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteUser(@PathVariable long id) {
        if (!authService.isUserSignedIn())
            return unauthorized();

        User user = userRepository.findInCurrentTenant(id);
        if (user == null)
            return notFound("No users were found with the ID: " + id);

        if (user.isAdmin())
            return badRequest("The admin user cannot be deleted.");

        if (!authService.doesCurrentUserHavePermission(Permission.Descriptor.USERS_MODIFY_ALL))
            return noPermission();

        userRepository.delete(user);
        return noContent();
    }

}
