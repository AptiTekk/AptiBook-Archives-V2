/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api.validators;

import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.entities.UserGroup;
import com.aptitekk.aptibook.core.domain.repositories.UserGroupRepository;
import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Nullable;
import javax.validation.constraints.Null;

@Service
public class UserGroupValidator extends RestValidator {

    private final UserGroupRepository userGroupRepository;

    @Autowired
    public UserGroupValidator(UserGroupRepository userGroupRepository) {
        this.userGroupRepository = userGroupRepository;
    }

    /**
     * Ensures that the User Group is not already in use,
     * excluding any Groups with the specified ID from uniqueness validation (if applicable).
     *
     * @param name                The name to search for.
     * @param excludedUserGroupId User Groups with this ID will not cause an exception if their name matches.
     * @throws RestValidationException If the name is already in use.
     */
    void checkIfNameIsInUse(String name, @Nullable Long excludedUserGroupId) throws RestValidationException {
        UserGroup otherUserGroup = userGroupRepository.findByName(name);
        if (otherUserGroup != null && !otherUserGroup.getId().equals(excludedUserGroupId))
            throw new RestValidationException(badRequest("A User Group with this name already exists."));
    }

    /**
     * Ensures that the User Group name meets specifications and is not already in use.
     *
     * @param name              The name to validate
     * @param existingUserGroup The User Group whose name is being changed, if applicable.
     * @throws RestValidationException If the name is not valid or is in use.
     */
    public void validateName(String name, @Nullable UserGroup existingUserGroup) throws RestValidationException {
        if (name != null) {

            if (existingUserGroup != null && existingUserGroup.isRoot()) {
                if (name.equals("root"))
                    return; // Nothing else to check.
                else
                    throw new RestValidationException(badRequest("The root group's name cannot be changed."));
            }

            if (!name.matches("[^<>;=]*"))
                throw new RestValidationException(badRequest("The Name cannot contain these characters: < > ; ="));
            else if (name.length() > 30)
                throw new RestValidationException(badRequest("The Name must be 30 characters or less."));

            checkIfNameIsInUse(name, existingUserGroup != null ? existingUserGroup.getId() : null);
        }
    }

}
