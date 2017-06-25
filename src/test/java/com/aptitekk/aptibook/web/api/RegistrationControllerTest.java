/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api;

import com.aptitekk.aptibook.AbstractWebClientTest;
import com.aptitekk.aptibook.domain.entities.User;
import com.aptitekk.aptibook.domain.repositories.UserRepository;
import org.json.JSONObject;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.junit.Assert.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

public class RegistrationControllerTest extends AbstractWebClientTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testRegisterAndVerify() throws Exception {

        JSONObject newUserJson = getJsonObjectFromFile("controllers/registrationController/newUser.json");

        this.mockMvc
                .perform(MockMvcRequestBuilders
                        .post("/api/register")
                        .with(csrf())
                        .content(newUserJson.toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().is(HttpStatus.CREATED.value()));

        User user = userRepository.findByEmailAddress(newUserJson.getString("emailAddress"), getJUnitTenant());
        assertNotNull("The registered user was not created.", user);
        assertFalse("The user was already verified.", user.isVerified());
        assertNotNull("The user does not have a verification code.", user.getVerificationCode());

        this.mockMvc.perform(MockMvcRequestBuilders.get("/api/register/verify?code=" + user.getVerificationCode()))
                .andExpect(MockMvcResultMatchers.status().is(HttpStatus.TEMPORARY_REDIRECT.value()));

        assertTrue("The user is not verified.", user.isVerified());
        assertNull("The user still has a verification code.", user.getVerificationCode());
    }
}