/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services;

import com.aptitekk.aptibook.core.domain.entities.User;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;

/**
 * Creates and validates Registration tokens that allow a particular session to register for an account.
 */
@Service
public class RegistrationService {

    /**
     * The key where RegistrationData instances are saved.
     */
    private static final String TOKEN_KEY_NAME = "registrationToken";

    /**
     * Gives this request the ability to register for an account, for example
     * after single sign on is successful. Then, redirects the user to the
     * registration page.
     *
     * @param user                A partially-filled User. Any fields filled in here will be
     *                            pre-filled on the registration page.
     * @param httpServletRequest  The current request.
     * @param httpServletResponse The current response.
     * @return The generated token. (Remember that this method performs a redirect.)
     */
    public UUID beginRegistration(User user, HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws IOException {
        // Generate a registration token
        UUID token = UUID.randomUUID();

        // Create a RegistrationData instance.
        RegistrationData registrationData = new RegistrationData(token, user);

        // Store the registrationData in the session
        httpServletRequest.getSession(true).setAttribute(TOKEN_KEY_NAME, registrationData);

        // Redirect to the sign up page with the token as a parameter.
        httpServletResponse.sendRedirect("/finish-registration?token=" + token.toString());

        return token;
    }

    /**
     * Determines if the token is valid for the current session,
     * and gets the User from the token if it is valid.
     *
     * @param token              The token given.
     * @param httpServletRequest The current request.
     * @return The previously saved partially-filled User object, if the token is valid; null otherwise.
     */
    public User getUserFromToken(UUID token, HttpServletRequest httpServletRequest) {
        // Get the current registrationData, if there is any.
        RegistrationData registrationData = (RegistrationData) httpServletRequest.getSession(true).getAttribute(TOKEN_KEY_NAME);

        // Check that the registrationData is not null and contains the same token. Return the user if all is ok.
        return registrationData != null && registrationData.token.equals(token) ? registrationData.user : null;
    }

    /**
     * Invalidates any token assigned to this request.
     *
     * @param httpServletRequest The current request.
     */
    public void invalidateToken(HttpServletRequest httpServletRequest) {
        httpServletRequest.getSession(true).removeAttribute(TOKEN_KEY_NAME);
    }

    /**
     * Stores information about a registration request.
     */
    private class RegistrationData {

        /**
         * The token, for validation.
         */
        private UUID token;

        /**
         * The partially-filled (not yet saved) User.
         */
        private User user;

        private RegistrationData(UUID token, User user) {
            this.token = token;
            this.user = user;
        }

    }

}
