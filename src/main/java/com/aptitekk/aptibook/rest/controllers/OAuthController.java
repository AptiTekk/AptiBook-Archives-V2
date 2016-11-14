/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers;

import com.aptitekk.aptibook.core.services.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
public class OAuthController {

    private final LogService logService;

    @Autowired
    public OAuthController(LogService logService) {
        this.logService = logService;
    }

    @RequestMapping("oauth")
    public void onOAuthCallback(HttpServletResponse httpServletResponse,
                                @RequestParam(value = "state", required = false) String state,
                                @RequestParam(value = "code", required = false) String code) {
        if (state != null && !state.isEmpty() && code != null && !code.isEmpty()) {
            String[] stateSplit = state.split("=");
            if (stateSplit.length == 2) {
                String tenantSlug = stateSplit[1];
                //TODO: Something with the code
                try {
                    httpServletResponse.sendRedirect("/" + tenantSlug + "/");
                } catch (IOException e) {
                    logService.logException(getClass(), e, "Could not redirect to tenant root");
                }
            }
        }

        try {
            httpServletResponse.sendRedirect("/");
        } catch (IOException e) {
            logService.logException(getClass(), e, "Could not redirect to web root");
        }
    }

}
