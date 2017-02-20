/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api.validators;

import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Nullable;

@Service
public class UserValidator extends RestValidator {

    private final UserRepository userRepository;

    @Autowired
    public UserValidator(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Checks if an email address is already in use by another user.
     *
     * @param emailAddress   The email address to check.
     * @param excludedUserId An ID which is exempt from checking; if a user with this email address and ID is found, the email address is still considered valid.
     * @throws RestValidationException If the email address is in use.
     */
    public void checkIfEmailAddressIsInUse(String emailAddress, @Nullable Long excludedUserId) throws RestValidationException {
        User otherUser = userRepository.findByEmailAddress(emailAddress);
        if (otherUser != null && !otherUser.getId().equals(excludedUserId))
            throw new RestValidationException(badRequest("The Email Address is already in use."));
    }

    /**
     * Checks if an email address is valid (meets specifications and is not already in use) for an existing user.
     *
     * @param emailAddress The email address to validate.
     * @param existingUser The existing user (whose email address is being changed).
     * @throws RestValidationException If the email address is invalid.
     */
    public void validateEmailAddressForExistingUser(String emailAddress, User existingUser) throws RestValidationException {
        if (emailAddress == null || emailAddress.isEmpty())
            throw new RestValidationException(badRequest("The Email Address was not supplied."));

        if (!existingUser.isAdmin() && !EmailValidator.getInstance().isValid(emailAddress))
            throw new RestValidationException(badRequest("The Email Address is invalid."));

        checkIfEmailAddressIsInUse(emailAddress, existingUser.getId());
    }

    /**
     * Checks if an email address is valid (meets specifications and is not already in use) for a new user.
     *
     * @param emailAddress The email address to validate.
     * @throws RestValidationException If the email address is invalid.
     */
    public void validateEmailAddressForNewUser(String emailAddress) throws RestValidationException {
        if (emailAddress == null || emailAddress.isEmpty())
            throw new RestValidationException(badRequest("The Email Address was not supplied."));

        if (!EmailValidator.getInstance().isValid(emailAddress))
            throw new RestValidationException(badRequest("The Email Address is invalid."));

        checkIfEmailAddressIsInUse(emailAddress, null);
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

}
