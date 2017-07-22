/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.controllers;

import com.aptitekk.aptibook.domain.entities.NotificationType;
import com.aptitekk.aptibook.domain.entities.Permission;
import com.aptitekk.aptibook.domain.entities.User;
import com.aptitekk.aptibook.domain.entities.UserGroup;
import com.aptitekk.aptibook.domain.repositories.UserRepository;
import com.aptitekk.aptibook.service.EmailService;
import com.aptitekk.aptibook.util.PasswordUtils;
import com.aptitekk.aptibook.web.api.APIResponse;
import com.aptitekk.aptibook.web.api.annotations.APIController;
import com.aptitekk.aptibook.web.api.dtos.UserDTO;
import com.aptitekk.aptibook.web.api.validators.UserValidator;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;
import java.util.Map;

@APIController
public class UserController extends APIControllerAbstract {

    private final UserRepository userRepository;
    private final UserValidator userValidator;
    private final EmailService emailService;

    @Autowired
    public UserController(
            UserRepository userRepository,
            UserValidator userValidator,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.userValidator = userValidator;
        this.emailService = emailService;
    }

    @RequestMapping(value = "/users", method = RequestMethod.GET)
    public APIResponse getUsers() {
        if (!authService.doesCurrentUserHavePermission(Permission.USERS_MODIFY_ALL))
            return APIResponse.noPermission();

        List<User> users = userRepository.findAll();

        return APIResponse.okResponse(modelMapper.map(users, new TypeToken<List<UserDTO>>() {
        }.getType()));
    }

    @RequestMapping(value = "/users", method = RequestMethod.POST)
    public APIResponse addNewUser(@RequestBody UserDTO userDTO) {
        if (!authService.doesCurrentUserHavePermission(Permission.USERS_MODIFY_ALL))
            return APIResponse.noPermission();

        User newUser = new User();

        if (userDTO.emailAddress == null)
            return APIResponse.badRequestMissingField("emailAddress");

        userValidator.validateEmailAddress(userDTO.emailAddress, null);
        newUser.setEmailAddress(userDTO.emailAddress);

        if (userDTO.firstName != null) {
            userValidator.validateFirstName(userDTO.firstName);
            newUser.setFirstName(userDTO.firstName);
        }

        if (userDTO.lastName != null) {
            userValidator.validateLastName(userDTO.lastName);
            newUser.setLastName(userDTO.lastName);
        }

        if (userDTO.phoneNumber != null) {
            userValidator.validatePhoneNumber(userDTO.phoneNumber);
            newUser.setPhoneNumber(userDTO.phoneNumber);
        }

        if (userDTO.userGroups != null) {
            newUser.setUserGroups(userValidator.validateUserGroups(userDTO.userGroups, null));
        }

        String newPassword = PasswordUtils.generateRandomPassword(10);
        newUser.setHashedPassword(PasswordUtils.encodePassword(newPassword));

        newUser.setVerified(true);
        newUser = userRepository.save(newUser);

        emailService.sendEmailNotification(newUser.getEmailAddress(),
                "Welcome to AptiBook!",
                "Hello! An account has been created for you on AptiBook."
                        + "<p>You can sign in to AptiBook using the URL and credentials below. Once you sign in, you can change your password by clicking <b>My Account</b> on the navigation bar.<br>"
                        + "https://" + newUser.getTenant().getDomain() + ".aptibook.net</p>"
                        + "<center>"
                        + "Email Address: <b>" + newUser.getEmailAddress() + "</b> <br>"
                        + "Password: <b>" + newPassword + "</b>"
                        + "</center>"
                        + "<p>Please let us know of any way we can be of assistance, and be sure to check out our knowledge base at https://support.aptitekk.com/. Enjoy!</p>");

        return APIResponse.created(modelMapper.map(newUser, UserDTO.class), "/users/" + newUser.getId());
    }

    @RequestMapping(value = "/users/current", method = RequestMethod.GET)
    public APIResponse getCurrentUser() {
        return APIResponse.okResponse(modelMapper.map(authService.getCurrentUser(), UserDTO.class));
    }

    @RequestMapping(value = "/users/{id}", method = RequestMethod.GET)
    public APIResponse getUser(@PathVariable long id) {
        User user = userRepository.findInCurrentTenant(id);
        if (user == null)
            return APIResponse.notFound("No users were found with the ID: " + id);

        if (!user.equals(authService.getCurrentUser()))
            if (!authService.doesCurrentUserHavePermission(Permission.USERS_MODIFY_ALL))
                return APIResponse.noPermission();

        return APIResponse.okResponse(modelMapper.map(user, UserDTO.class));
    }


    @RequestMapping(value = "/users/current/notifications/settings", method = RequestMethod.GET)
    public APIResponse getNotificationSettings() {
        Map<NotificationType, User.NotificationToggles> notificationSettings = authService.getCurrentUser().getNotificationSettings();

        for (NotificationType notificationType : NotificationType.values()) {
            notificationSettings.putIfAbsent(notificationType, new User.NotificationToggles(notificationType.getDefaultValue()));
        }

        return APIResponse.okResponse(modelMapper.map(notificationSettings, new TypeToken<Map<NotificationType, User.NotificationToggles>>() {
        }.getType()));
    }


    @RequestMapping(value = "/users/current/notifications/settings/{notificationType}", method = RequestMethod.PATCH)
    public APIResponse patchNotificationSetting(@RequestBody User.NotificationToggles notificationToggles,
                                                @PathVariable("notificationType") NotificationType notificationType) {
        User user = authService.getCurrentUser();
        //Find passed in notification setting in user's notification settings and set value of user's setting to passed in value.
        if (user.getNotificationSettings().containsKey(notificationType))
            user.getNotificationSettings().get(notificationType).setEmailEnabled(notificationToggles.isEmailEnabled());
        else
            user.getNotificationSettings().put(notificationType, new User.NotificationToggles(notificationToggles.isEmailEnabled()));

        userRepository.save(user);
        return APIResponse.okResponse(modelMapper.map(user.getNotificationSettings().get(notificationType), User.NotificationToggles.class));
    }

    @RequestMapping(value = "/users/{id}", method = RequestMethod.PATCH)
    public APIResponse patchUser(@PathVariable Long id, @RequestBody UserDTO.WithNewPassword userDTO) {
        User currentUser = userRepository.findInCurrentTenant(id);
        if (currentUser == null)
            return APIResponse.notFound("No users were found with the ID: " + id);

        if (!currentUser.equals(authService.getCurrentUser()))
            if (!authService.doesCurrentUserHavePermission(Permission.USERS_MODIFY_ALL))
                return APIResponse.noPermission();

        if (userDTO.emailAddress != null) {
            userValidator.validateEmailAddress(userDTO.emailAddress, currentUser);
            currentUser.setEmailAddress(userDTO.emailAddress);
        }

        if (userDTO.firstName != null) {
            userValidator.validateFirstName(userDTO.firstName);
            currentUser.setFirstName(userDTO.firstName);
        }

        if (userDTO.lastName != null) {
            userValidator.validateLastName(userDTO.lastName);
            currentUser.setLastName(userDTO.lastName);
        }

        if (userDTO.phoneNumber != null) {
            userValidator.validatePhoneNumber(userDTO.phoneNumber);
            currentUser.setPhoneNumber(userDTO.phoneNumber);
        }

        //TODO: A patch method specifically for the current user, which also allows password changing (and ignores user groups). This method shouldn't allow password changing.
        if (userDTO.newPassword != null) {
            userValidator.validatePassword(userDTO.newPassword);
            currentUser.setHashedPassword(PasswordUtils.encodePassword(userDTO.newPassword));
        }

        if (userDTO.userGroups != null) {
            if (!authService.doesCurrentUserHavePermission(Permission.USERS_MODIFY_ALL))
                return APIResponse.noPermission();

            List<UserGroup> userGroupList = userValidator.validateUserGroups(userDTO.userGroups, currentUser);

            for (UserGroup userGroup : currentUser.getUserGroups()) {
                userGroup.getUsers().remove(currentUser);
            }

            currentUser.setUserGroups(userGroupList);
        }

        userRepository.save(currentUser);

        return APIResponse.okResponse(modelMapper.map(currentUser, UserDTO.class));
    }

    @RequestMapping(value = "/users/{id}", method = RequestMethod.DELETE)
    public APIResponse deleteUser(@PathVariable long id) {
        User user = userRepository.findInCurrentTenant(id);
        if (user == null)
            return APIResponse.notFound("No users were found with the ID: " + id);

        if (user.isAdmin())
            return APIResponse.forbidden("The admin user cannot be deleted.");

        if (!authService.doesCurrentUserHavePermission(Permission.USERS_MODIFY_ALL))
            return APIResponse.noPermission();

        userRepository.delete(user);
        return APIResponse.noContentResponse();
    }

}
