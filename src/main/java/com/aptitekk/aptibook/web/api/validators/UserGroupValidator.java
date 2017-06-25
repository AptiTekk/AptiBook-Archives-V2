/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.validators;

import com.aptitekk.aptibook.domain.entities.UserGroup;
import com.aptitekk.aptibook.domain.repositories.UserGroupRepository;
import com.aptitekk.aptibook.web.api.APIResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Nullable;

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
            throw new RestValidationException(APIResponse.badRequestConflict("A User Group with this name already exists."));
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
                    throw new RestValidationException(APIResponse.forbidden("The root group's name cannot be changed."));
            }

            if (!name.matches("[^<>;=]*"))
                throw new RestValidationException(APIResponse.badRequestInvalidCharacters("name", "< > ; ="));
            else if (name.length() > 30)
                throw new RestValidationException(APIResponse.badRequestFieldTooLong("name", 30));

            checkIfNameIsInUse(name, existingUserGroup != null ? existingUserGroup.getId() : null);
        }
    }

}
