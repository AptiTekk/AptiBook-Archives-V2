/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security;

import com.aptitekk.aptibook.web.api.APIResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Defines the behavior when an {@link AuthenticationException} is thrown
 * (usually from one of the Authentication Providers)
 */
@Component
public class APIAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        String error = "unauthorized";
        if (authException instanceof BadCredentialsException)
            error = "bad_credentials";

        APIResponse apiResponse = APIResponse.unauthorized(error, authException.getMessage());
        response.setStatus(apiResponse.getStatusCodeValue());
        response.getWriter().append(new ObjectMapper().writeValueAsString(apiResponse.getBody()));
    }

}
