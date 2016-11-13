/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.auth;

import com.aptitekk.aptibook.core.domain.entities.Permission;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.services.LogService;
import com.aptitekk.aptibook.core.services.SpringProfileService;
import com.aptitekk.aptibook.core.services.entity.PermissionService;
import org.jasypt.exceptions.EncryptionOperationNotPossibleException;
import org.jasypt.util.text.BasicTextEncryptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.UUID;

@Service
public class AuthService {

    private static final String COOKIE_NAME = "APTIBOOK_AUTH";
    private static final String ENCRYPTION_KEY = "xof@SqzU5z5X&m3qaJMSj$3WNo@JmYPmog*L%dZooLI3ldVnoc";

    private final HttpServletRequest httpServletRequest;
    private final SpringProfileService springProfileService;
    private final UserRepository userRepository;
    private final PermissionService permissionService;
    private final LogService logService;

    @Autowired
    public AuthService(HttpServletRequest httpServletRequest, SpringProfileService springProfileService, UserRepository userRepository, PermissionService permissionService, LogService logService) {
        this.httpServletRequest = httpServletRequest;
        this.springProfileService = springProfileService;
        this.userRepository = userRepository;
        this.permissionService = permissionService;
        this.logService = logService;
    }

    /**
     * Securely encrypts data for Cookies using a salt and password.
     *
     * @param cookieData The cookie data to encrypt.
     * @return The encrypted cookie data.
     */
    private String encryptCookieData(Object cookieData) {
        BasicTextEncryptor basicTextEncryptor = new BasicTextEncryptor();
        basicTextEncryptor.setPassword(ENCRYPTION_KEY);
        try {
            return basicTextEncryptor.encrypt(cookieData.toString() + "|" + UUID.randomUUID().toString());
        } catch (EncryptionOperationNotPossibleException e) {
            if (e.getMessage() != null)
                logService.logException(getClass(), e, "Could not encrypt auth cookie");
            else
                logService.logError(getClass(), "Could not encrypt auth cookie.");
            return null;
        }
    }

    /**
     * Decrypts cookie data and removes the salt.
     *
     * @param encrypted The encrypted cookie data.
     * @return The decrypted cookie data as a string.
     */
    private String decryptCookieData(String encrypted) {
        BasicTextEncryptor basicTextEncryptor = new BasicTextEncryptor();
        basicTextEncryptor.setPassword(ENCRYPTION_KEY);
        try {
            return basicTextEncryptor.decrypt(encrypted).split("\\|")[0];
        } catch (EncryptionOperationNotPossibleException e) {
            if (e.getMessage() != null)
                logService.logException(getClass(), e, "Could not decrypt auth cookie");
            else
                logService.logError(getClass(), "Could not decrypt auth cookie.");
            return null;
        }
    }

    /**
     * Stores the User ID within an encrypted Cookie saved in the user's browser.
     *
     * @param user                The User to store.
     * @param httpServletResponse The servlet response to save the Cookie in.
     */
    public void setCurrentUser(User user, HttpServletResponse httpServletResponse) {
        if (user == null || httpServletResponse == null)
            return;

        String encryptedData = encryptCookieData(user.getId());
        if (encryptedData == null)
            return;

        Cookie cookie = new Cookie(COOKIE_NAME, encryptedData);

        if (springProfileService.isProfileActive(SpringProfileService.Profile.PRODUCTION)) {
            cookie.setSecure(true);
        }

        cookie.setMaxAge(604800);
        cookie.setPath("/" + userRepository.getTenant().getSlug() + "/api");

        httpServletResponse.addCookie(cookie);
    }

    /**
     * Retrieves the User from the Cookie saved on the user's browser (if one exists).
     *
     * @return The User from the Cookie, or null if it could not be read / found.
     */
    public User getCurrentUser() {
        if (httpServletRequest == null)
            return null;

        if (httpServletRequest.getCookies() == null)
            return null;

        for (Cookie cookie : httpServletRequest.getCookies()) {
            if (cookie.getName().equals(COOKIE_NAME)) {
                String decryptedData = decryptCookieData(cookie.getValue());
                if (decryptedData == null)
                    return null;

                try {
                    Long userId = Long.parseLong(decryptedData);
                    return userRepository.findInCurrentTenant(userId);
                } catch (NumberFormatException e) {
                    return null;
                }
            }
        }

        return null;
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
