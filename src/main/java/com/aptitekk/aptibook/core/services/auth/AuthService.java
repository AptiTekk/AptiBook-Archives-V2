/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.auth;

import com.aptitekk.aptibook.core.domain.entities.Permission;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.services.entity.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PermissionService permissionService;

    @Autowired
    public AuthService(UserRepository userRepository,
                       PermissionService permissionService) {
        this.userRepository = userRepository;
        this.permissionService = permissionService;
    }

    /**
     * Retrieves the User from the Cookie saved on the user's browser (if one exists).
     *
     * @return The User from the Cookie, or null if it could not be read / found.
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof UsernamePasswordAuthenticationToken) {
            Long userId = (Long) authentication.getPrincipal();

            return userRepository.findInCurrentTenant(userId);
        }

        return null;
    }

    /**
     * Determines if the user is signed in or not.
     *
     * @return True if the user is signed in, false otherwise.
     */
    public boolean isUserSignedIn() {
        return getCurrentUser() != null;
    }

    /**
     * Determines if the current user has the given permission.
     *
     * @param descriptor The permission descriptor to check for.
     * @return True if they have permission, false if they do not or the current user is null.
     */
    public boolean doesCurrentUserHavePermission(Permission.Descriptor descriptor) {
        User currentUser = getCurrentUser();
        return currentUser != null && permissionService.userHasPermission(currentUser, descriptor);
    }

    /**
     * Determines if the current user has one or more permissions within a given permission group.
     *
     * @param group The permission group to look for permissions within.
     * @return True if they have one or more permissions, false if they do not or the current user is null.
     */
    public boolean doesCurrentUserHavePermissionOfGroup(Permission.Group group) {
        User currentUser = getCurrentUser();
        return currentUser != null && permissionService.userHasPermissionOfGroup(currentUser, group);
    }

}
