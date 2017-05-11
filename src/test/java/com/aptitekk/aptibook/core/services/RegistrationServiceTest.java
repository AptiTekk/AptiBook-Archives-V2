/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services;

import com.aptitekk.aptibook.AbstractWebClientTest;
import com.aptitekk.aptibook.core.domain.entities.User;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.io.IOException;
import java.util.UUID;

import static org.junit.Assert.*;

public class RegistrationServiceTest extends AbstractWebClientTest {

    @Autowired
    private RegistrationService registrationService;

    private MockHttpServletRequest httpServletRequest;
    private MockHttpServletResponse httpServletResponse;

    @Override
    @Before
    public void setUp() throws Exception {
        this.httpServletRequest = new MockHttpServletRequest();
        this.httpServletResponse = new MockHttpServletResponse();
    }

    /**
     * Tests the ability to save and then request a token.
     */
    @Test
    public void testSavingToken() throws IOException {
        User registrationUser = new User();
        registrationUser.setEmailAddress("test@test.com");

        UUID token = this.registrationService.beginRegistration(registrationUser, this.httpServletRequest, this.httpServletResponse);

        assertNotNull("The generated token was null", token);

        User retrievedUser = this.registrationService.getUserFromToken(token, this.httpServletRequest);

        assertNotNull("The User from the token was null", retrievedUser);
        assertEquals("The User from the token did not match what was given.", registrationUser, retrievedUser);
    }

    /**
     * Tests the ability to invalidate a token.
     */
    @Test
    public void testInvalidatingToken() throws IOException {
        User registrationUser = new User();
        registrationUser.setEmailAddress("test@test.com");

        UUID token = this.registrationService.beginRegistration(registrationUser, this.httpServletRequest, this.httpServletResponse);

        this.registrationService.invalidateToken(this.httpServletRequest);

        User retrievedUser = this.registrationService.getUserFromToken(token, this.httpServletRequest);

        assertNull("The User from the token was not null; it should have been invalidated", retrievedUser);
    }

}