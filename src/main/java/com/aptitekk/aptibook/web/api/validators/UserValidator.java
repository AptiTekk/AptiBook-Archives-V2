/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.validators;

import com.aptitekk.aptibook.domain.entities.User;
import com.aptitekk.aptibook.domain.entities.UserGroup;
import com.aptitekk.aptibook.domain.repositories.UserGroupRepository;
import com.aptitekk.aptibook.domain.repositories.UserRepository;
import com.aptitekk.aptibook.service.entity.UserGroupService;
import com.aptitekk.aptibook.web.api.APIResponse;
import com.aptitekk.aptibook.web.api.dtos.UserGroupDTO;
import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Nullable;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserValidator extends RestValidator {

    private final UserRepository userRepository;
    private final UserGroupRepository userGroupRepository;
    private final UserGroupService userGroupService;

    @Autowired
    public UserValidator(UserRepository userRepository,
                         UserGroupRepository userGroupRepository,
                         UserGroupService userGroupService) {
        this.userRepository = userRepository;
        this.userGroupRepository = userGroupRepository;
        this.userGroupService = userGroupService;
    }

    /**
     * Checks if an email address is already in use by another user.
     *
     * @param emailAddress   The email address to check.
     * @param excludedUserId An ID which is exempt from checking; if a user with this email address and ID is found, the email address is still considered valid.
     * @throws RestValidationException If the email address is in use.
     */
    void checkIfEmailAddressIsInUse(String emailAddress, @Nullable Long excludedUserId) throws RestValidationException {
        User otherUser = userRepository.findByEmailAddress(emailAddress);
        if (otherUser != null && !otherUser.getId().equals(excludedUserId))
            throw new RestValidationException(APIResponse.badRequestConflict("The Email Address is already in use."));
    }

    /**
     * Checks if an email address is valid (meets specifications and is not already in use).
     *
     * @param emailAddress The email address to validate.
     * @param existingUser The existing user (whose email address is being changed) if applicable.
     * @throws RestValidationException If the email address is invalid.
     */
    public void validateEmailAddress(String emailAddress, @Nullable User existingUser) throws RestValidationException {
        if (emailAddress != null) {

            if (existingUser != null && existingUser.isAdmin())
                throw new RestValidationException(APIResponse.forbidden("The admin user cannot change their Email Address."));

            if (!EmailValidator.getInstance().isValid(emailAddress))
                throw new RestValidationException(APIResponse.badRequestNotParsable("The Email Address is invalid."));

            checkIfEmailAddressIsInUse(emailAddress, existingUser != null ? existingUser.getId() : null);
        }
    }

    /**
     * Checks if a first name is valid for a user.
     *
     * @param firstName The first name.
     * @throws RestValidationException If the first name is invalid.
     */
    public void validateFirstName(String firstName) throws RestValidationException {
        if (firstName != null)
            if (!firstName.matches("[^<>;=]*"))
                throw new RestValidationException(APIResponse.badRequestInvalidCharacters("firstName", "< > ; ="));
            else if (firstName.length() > 30)
                throw new RestValidationException(APIResponse.badRequestFieldTooLong("firstName", 30));
    }

    /**
     * Checks if a last name is valid for a user.
     *
     * @param lastName The last name.
     * @throws RestValidationException If the last name is invalid.
     */
    public void validateLastName(String lastName) throws RestValidationException {
        if (lastName != null)
            if (!lastName.matches("[^<>;=]*"))
                throw new RestValidationException(APIResponse.badRequestInvalidCharacters("lastName", "< > ; ="));
            else if (lastName.length() > 30)
                throw new RestValidationException(APIResponse.badRequestFieldTooLong("lastName", 30));
    }

    /**
     * Checks if a phone number is valid for a user.
     *
     * @param phoneNumber The phone number.
     * @throws RestValidationException If the phone number is invalid.
     */
    public void validatePhoneNumber(String phoneNumber) throws RestValidationException {
        if (phoneNumber != null)
            if (!phoneNumber.matches("[^<>;=]*"))
                throw new RestValidationException(APIResponse.badRequestInvalidCharacters("phoneNumber", "< > ; ="));
            else if (phoneNumber.length() > 30)
                throw new RestValidationException(APIResponse.badRequestFieldTooLong("phoneNumber", 30));
    }

    /**
     * Checks if a password is valid for a user.
     *
     * @param password The password.
     * @throws RestValidationException If the password is invalid.
     */
    public void validatePassword(String password) throws RestValidationException {
        if (password != null)
            if (password.length() > 30)
                throw new RestValidationException(APIResponse.badRequestFieldTooLong("password", 30));
    }

    /**
     * Checks that the provided User Groups exist and are in a valid structure.
     *
     * @param userGroupDTOs The User Group DTOs from the client.
     * @param existingUser  The User whose groups are being changed, if applicable.
     * @return A List of User Groups that can be assigned to the user.
     */
    public List<UserGroup> validateUserGroups(List<? extends UserGroupDTO> userGroupDTOs, @Nullable User existingUser) throws RestValidationException {
        List<UserGroup> userGroupList = new ArrayList<>();

        // Determines if the current user (if one exists) is an admin.
        boolean isAdmin = false;
        if (existingUser != null)
            if (existingUser.isAdmin())
                isAdmin = true;

        // The admin has special rules:
        // 1. May only be assigned to the Root Group.
        // 2. Must be assigned to the Root Group.
        if (isAdmin) {
            if (userGroupDTOs.isEmpty())
                throw new RestValidationException(APIResponse.forbidden("The admin user must be assigned to the root group."));
            else if (userGroupDTOs.size() > 1)
                throw new RestValidationException(APIResponse.forbidden("The admin user may only be assigned to the root group."));
            else {
                UserGroup userGroup = userGroupRepository.findInCurrentTenant(userGroupDTOs.get(0).id);
                if (userGroup == null)
                    throw new RestValidationException(APIResponse.notFound("The User Group was not found."));
                else if (!userGroup.isRoot())
                    throw new RestValidationException(APIResponse.forbidden("The admin user may only be assigned to the root group."));

                userGroupList.add(userGroup);
            }
        } else {
            // For all other users, check the user group structure.
            for (UserGroupDTO userGroupDTO : userGroupDTOs) {
                if (userGroupDTO.id == null)
                    throw new RestValidationException(APIResponse.badRequestMissingField("id"));

                UserGroup userGroup = userGroupRepository.findInCurrentTenant(userGroupDTO.id);

                // Make sure the group exists.
                if (userGroup == null)
                    throw new RestValidationException(APIResponse.notFound("The User Group with the id " + userGroupDTO.id + " was not found."));

                // Make sure the group is not root, as normal users cannot be assigned to root.
                if (userGroup.isRoot())
                    throw new RestValidationException(APIResponse.forbidden("You may not assign a non-admin user to the root group."));

                // Make sure there are not other groups being assigned on this same branch.
                // Check below this group...
                List<UserGroup> hierarchyDown = userGroupService.getHierarchyDown(userGroup);
                for (UserGroup otherGroup : userGroupList) {
                    if (hierarchyDown.contains(otherGroup))
                        throw new RestValidationException(APIResponse.forbidden("You may not assign a user to two or more groups of the same branch."));
                }
                // And above this group...
                List<UserGroup> hierarchyUp = userGroupService.getHierarchyUp(userGroup);
                for (UserGroup otherGroup : userGroupList) {
                    if (hierarchyUp.contains(otherGroup))
                        throw new RestValidationException(APIResponse.forbidden("You may not assign a user to two or more groups of the same branch."));
                }

                userGroupList.add(userGroup);
            }
        }

        return userGroupList;
    }

}
