/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services;

import com.aptitekk.aptibook.core.domain.entities.Tenant;
import org.jasypt.exceptions.EncryptionOperationNotPossibleException;
import org.jasypt.util.text.BasicTextEncryptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Service
public class CookieService {

    private static final String ENCRYPTION_KEY = "xof@SqzU5z5X&m3qaJMSj$3WNo@JmYPmog*L%dZooLI3ldVnoc";

    private final SpringProfileService springProfileService;
    private final LogService logService;

    @Autowired
    public CookieService(SpringProfileService springProfileService, LogService logService) {
        this.springProfileService = springProfileService;
        this.logService = logService;
    }

    /**
     * Securely encrypts data for Cookies.
     *
     * @param data The cookie data to encrypt.
     * @return The encrypted cookie data.
     */
    private String encryptCookieData(String data) {
        if (data == null)
            return null;

        BasicTextEncryptor basicTextEncryptor = new BasicTextEncryptor();
        basicTextEncryptor.setPassword(ENCRYPTION_KEY);
        try {
            return basicTextEncryptor.encrypt(data);
        } catch (EncryptionOperationNotPossibleException e) {
            if (e.getMessage() != null)
                logService.logException(getClass(), e, "Could not encrypt auth cookie");
            else
                logService.logError(getClass(), "Could not encrypt auth cookie.");
            return null;
        }
    }

    /**
     * Decrypts cookie data.
     *
     * @param encryptedData The encrypted cookie data.
     * @return The decrypted cookie data as a string.
     */
    private String decryptCookieData(String encryptedData) {
        if (encryptedData == null)
            return null;

        BasicTextEncryptor basicTextEncryptor = new BasicTextEncryptor();
        basicTextEncryptor.setPassword(ENCRYPTION_KEY);
        try {
            return basicTextEncryptor.decrypt(encryptedData);
        } catch (EncryptionOperationNotPossibleException e) {
            if (e.getMessage() != null)
                logService.logException(getClass(), e, "Could not decrypt auth cookie");
            else
                logService.logError(getClass(), "Could not decrypt auth cookie.");
            return null;
        }
    }

    public void storeEncryptedCookie(String key, String value, int maxAgeSeconds, Tenant tenant, HttpServletResponse response) {
        if (key == null || value == null || tenant == null)
            return;

        Cookie cookie = new Cookie(key, encryptCookieData(value));

        if (springProfileService.isProfileActive(SpringProfileService.Profile.PRODUCTION)) {
            cookie.setSecure(true);
        }

        cookie.setMaxAge(maxAgeSeconds);
        cookie.setPath("/" + tenant.getSlug());
        response.addCookie(cookie);
    }

    public String getDataFromEncryptedCookie(String key, HttpServletRequest request) {
        if (request == null)
            return null;

        if (request.getCookies() == null)
            return null;

        for (Cookie cookie : request.getCookies()) {
            if (cookie.getName().equals(key)) {
                return decryptCookieData(cookie.getValue());
            }
        }

        return null;
    }

    public void deleteCookie(String key, Tenant tenant, HttpServletResponse response) {
        if (key == null)
            return;

        Cookie cookie = new Cookie(key, null);

        cookie.setMaxAge(0);
        cookie.setPath("/" + tenant.getSlug());
        response.addCookie(cookie);
    }

}
