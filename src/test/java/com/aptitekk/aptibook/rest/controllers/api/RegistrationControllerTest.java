/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.AbstractWebClientTest;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.TenantRepository;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.junit.Assert.*;

public class RegistrationControllerTest extends AbstractWebClientTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Test
    public void testRegisterAndVerify() throws Exception {
        this.mockMvc
                .perform(MockMvcRequestBuilders
                        .post("/api/demo/register")
                        .content("{\"emailAddress\": \"testregisteruser@aptitekk.com\", \"newPassword\": \"1234\"}")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().is(HttpStatus.CREATED.value()));

        User user = userRepository.findByEmailAddress("testregisteruser@aptitekk.com", tenantRepository.findTenantBySlug("demo"));
        assertNotNull("The registered user was not created.", user);
        assertFalse("The user was already verified.", user.verified);
        assertNotNull("The user does not have a verification code.", user.verificationCode);

        this.mockMvc.perform(MockMvcRequestBuilders.get("/api/demo/register/verify?code=" + user.verificationCode))
                .andExpect(MockMvcResultMatchers.status().is(HttpStatus.TEMPORARY_REDIRECT.value()));

        assertTrue("The user is not verified.", user.verified);
        assertNull("The user still has a verification code.", user.verificationCode);
    }
}