/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
public class TenantController extends APIControllerAbstract {

    @RequestMapping(value = "/tenant", method = RequestMethod.GET)
    public ResponseEntity<?> getTenant(HttpServletRequest request) {
        Object tenantAttribute = request.getAttribute("tenant");
        if (tenantAttribute != null) {
            return ok(tenantAttribute);
        }
        return badRequest("Tenant is Inactive");
    }

}
