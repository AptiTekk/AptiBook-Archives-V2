/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.auth;

import com.aptitekk.aptibook.core.domain.entities.Permission;
import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.services.CookieService;
import com.aptitekk.aptibook.core.services.entity.PermissionService;
import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Service
public class AuthService {

    private static final String COOKIE_NAME = "APTIBOOK_AUTH";

    private final HttpServletRequest request;
    private final CookieService cookieService;
    private final TenantManagementService tenantManagementService;
    private final UserRepository userRepository;
    private final PermissionService permissionService;

    @Autowired
    public AuthService(HttpServletRequest request, CookieService cookieService, TenantManagementService tenantManagementService, UserRepository userRepository, PermissionService permissionService) {
        this.request = request;
        this.cookieService = cookieService;
        this.tenantManagementService = tenantManagementService;
        this.userRepository = userRepository;
        this.permissionService = permissionService;
    }

    /**
     * Stores the User ID within an encrypted Cookie, related to the current Tenant, saved in the user's browser.
     *
     * @param user     The User to store.
     * @param response The servlet response to save the Cookie in.
     */
    public void setCurrentUser(User user, HttpServletResponse response) {
        this.setUserOfTenant(user, tenantManagementService.getTenant(), response);
    }

    /**
     * Stores the User ID within an encrypted Cookie, related to the Tenant, saved in the user's browser.
     *
     * @param user     The User to store.
     * @param tenant   The Tenant to relate the Cookie to.
     * @param response The servlet response to save the Cookie in.
     */
    public void setUserOfTenant(User user, Tenant tenant, HttpServletResponse response) {
        if (user == null || tenant == null || response == null)
            return;

        cookieService.storeEncryptedCookie(COOKIE_NAME, user.getId() + "", 608400, tenant, response);
    }

    /**
     * Retrieves the User from the Cookie saved on the user's browser (if one exists).
     *
     * @return The User from the Cookie, or null if it could not be read / found.
     */
    public User getCurrentUser() {
        String data = cookieService.getDataFromEncryptedCookie(COOKIE_NAME, request);

        try {
            Long userId = Long.parseLong(data);
            return userRepository.findInCurrentTenant(userId);
        } catch (NumberFormatException e) {
            return null;
        }
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
     * Signs the current user out by deleting its Cookie.
     *
     * @param response The HttpServletResponse to store the deletion cookie in.
     */
    public void signOutCurrentUser(HttpServletResponse response) {
        this.signOutUserOfTenant(tenantManagementService.getTenant(), response);
    }

    /**
     * Signs the user out of the specified Tenant by deleting its Cookie.
     *
     * @param tenant   The tenant to remove the cookie from.
     * @param response The HttpServletResponse to store the deletion cookie in.
     */
    public void signOutUserOfTenant(Tenant tenant, HttpServletResponse response) {
        cookieService.deleteCookie(COOKIE_NAME, tenant, response);
    }

    /**
     * Determines if the current user has the given permission.
     *
     * @param descriptor The permission descriptor to check for.
     * @return True if they have permission, false if they do not or the current user is null.
     */
    public boolean doesCurrentUserHavePermission(Permission.Descriptor descriptor) {
        User currentUser = getCurrentUser();
        return currentUser != null &&
                (currentUser.isAdmin()
                        || permissionService.userHasPermission(currentUser, descriptor)
                        || permissionService.userHasPermission(currentUser, Permission.Descriptor.GENERAL_FULL_PERMISSIONS));
    }

    /**
     * Determines if the current user has one or more permissions within a given permission group.
     *
     * @param group The permission group to look for permissions within.
     * @return True if they have one or more permissions, false if they do not or the current user is null.
     */
    public boolean doesCurrentUserHavePermissionOfGroup(Permission.Group group) {
        User currentUser = getCurrentUser();
        return currentUser != null &&
                (currentUser.isAdmin()
                        || permissionService.userHasPermissionOfGroup(currentUser, group)
                        || permissionService.userHasPermission(currentUser, Permission.Descriptor.GENERAL_FULL_PERMISSIONS));
    }

}
