/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security.cas;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class CASTicketFilter extends OncePerRequestFilter {

    private final String CALLBACK_PATH = "/api/cas/callback";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Check for CAS Service Callback Request
        if (request.getRequestURI().startsWith(CALLBACK_PATH)) {
            System.out.println("CAS Callback Received");
            return;
        }

        filterChain.doFilter(request, response);
    }

}
