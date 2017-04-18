/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.auth;

import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.entities.enums.Permission;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.services.entity.PermissionsService;
import com.aptitekk.aptibook.web.security.UserIDAuthenticationToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PermissionsService permissionsService;

    @Autowired
    public AuthService(UserRepository userRepository,
                       PermissionsService permissionsService) {
        this.userRepository = userRepository;
        this.permissionsService = permissionsService;
    }

    /**
     * Retrieves the User from the current SecurityContext.
     *
     * @return The current User, or null if one could not be found.
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof UserIDAuthenticationToken) {
            Long userId = ((UserIDAuthenticationToken) authentication).getUserId();

            return userRepository.findInCurrentTenant(userId);
        }

        return null;
    }

    /**
     * Signs the current user out.
     */
    public void signOut() {
        SecurityContextHolder.clearContext();
    }

    /**
     * Determines if the current user has the given permission.
     *
     * @param descriptor The permission descriptor to check for.
     * @return True if they have permission, false if they do not or the current user is null.
     */
    public boolean doesCurrentUserHavePermission(Permission.Descriptor descriptor) {
        User currentUser = getCurrentUser();
        return currentUser != null && permissionsService.userHasPermission(currentUser, descriptor);
    }

    /**
     * Determines if the current user has one or more permissions within a given permission group.
     *
     * @param group The permission group to look for permissions within.
     * @return True if they have one or more permissions, false if they do not or the current user is null.
     */
    public boolean doesCurrentUserHavePermissionOfGroup(Permission.Group group) {
        User currentUser = getCurrentUser();
        return currentUser != null && permissionsService.userHasPermissionOfGroup(currentUser, group);
    }

}
