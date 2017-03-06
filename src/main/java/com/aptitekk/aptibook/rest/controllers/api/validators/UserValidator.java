/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api.validators;

import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.entities.UserGroup;
import com.aptitekk.aptibook.core.domain.repositories.UserGroupRepository;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.UserGroupDTO;
import com.aptitekk.aptibook.core.services.entity.UserGroupService;
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
            throw new RestValidationException(badRequest("The Email Address is already in use."));
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

            if (existingUser != null && existingUser.isAdmin()) {
                if (emailAddress.equals("admin"))
                    return; // Nothing else to check.
                else
                    throw new RestValidationException(badRequest("The admin user cannot change their Email Address."));
            }

            if (!EmailValidator.getInstance().isValid(emailAddress))
                throw new RestValidationException(badRequest("The Email Address is invalid."));

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
                throw new RestValidationException(badRequest("The First Name cannot contain these characters: < > ; ="));
            else if (firstName.length() > 30)
                throw new RestValidationException(badRequest("The First Name must be 30 characters or less."));
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
                throw new RestValidationException(badRequest("The Last Name cannot contain these characters: < > ; ="));
            else if (lastName.length() > 30)
                throw new RestValidationException(badRequest("The Last Name must be 30 characters or less."));
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
                throw new RestValidationException(badRequest("The Phone Number cannot contain these characters: < > ; ="));
            else if (phoneNumber.length() > 30)
                throw new RestValidationException(badRequest("The Phone Number must be 30 characters or less."));
    }

    /**
     * Checks if a location is valid for a user.
     *
     * @param location The location.
     * @throws RestValidationException If the location is invalid.
     */
    public void validateLocation(String location) throws RestValidationException {
        if (location != null)
            if (!location.matches("[^<>;=]*"))
                throw new RestValidationException(badRequest("The Location cannot contain these characters: < > ; ="));
            else if (location.length() > 250)
                throw new RestValidationException(badRequest("The Location must be 250 characters or less."));
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
                throw new RestValidationException(badRequest("The Password must be 30 characters or less."));
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
                throw new RestValidationException(badRequest("The admin user must be assigned to the root group."));
            else if (userGroupDTOs.size() > 1)
                throw new RestValidationException(badRequest("The admin user may only be assigned to the root group."));
            else {
                UserGroup userGroup = userGroupRepository.findInCurrentTenant(userGroupDTOs.get(0).id);
                if (userGroup == null)
                    throw new RestValidationException(badRequest("The User Group was not found."));
                else if (!userGroup.isRoot())
                    throw new RestValidationException(badRequest("The admin user may only be assigned to the root group."));

                userGroupList.add(userGroup);
            }
        } else {
            // For all other users, check the user group structure.
            for (UserGroupDTO userGroupDTO : userGroupDTOs) {
                if (userGroupDTO.id == null)
                    throw new RestValidationException(badRequest("A User Group is missing an ID."));

                UserGroup userGroup = userGroupRepository.findInCurrentTenant(userGroupDTO.id);

                // Make sure the group exists.
                if (userGroup == null)
                    throw new RestValidationException(badRequest("A User Group was not found."));

                // Make sure the group is not root, as normal users cannot be assigned to root.
                if (userGroup.isRoot())
                    throw new RestValidationException(badRequest("You may not assign a non-admin user to the root group."));

                // Make sure there are not other groups being assigned on this same branch.
                // Check below this group...
                List<UserGroup> hierarchyDown = userGroupService.getHierarchyDown(userGroup);
                for (UserGroup otherGroup : userGroupList) {
                    if (hierarchyDown.contains(otherGroup))
                        throw new RestValidationException(badRequest("You may not assign a user to two or more groups of the same branch."));
                }
                // And above this group...
                List<UserGroup> hierarchyUp = userGroupService.getHierarchyUp(userGroup);
                for (UserGroup otherGroup : userGroupList) {
                    if (hierarchyUp.contains(otherGroup))
                        throw new RestValidationException(badRequest("You may not assign a user to two or more groups of the same branch."));
                }

                userGroupList.add(userGroup);
            }
        }

        return userGroupList;
    }

}
