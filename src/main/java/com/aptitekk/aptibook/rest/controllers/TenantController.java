/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers;

import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.rest.RestError;
import com.aptitekk.aptibook.core.services.entities.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TenantController extends APIControllerAbstract {

    private TenantService tenantService;

    @Autowired
    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    @RequestMapping(value = "/tenant", method = RequestMethod.GET)
    public ResponseEntity<Object> getTenant() {
        Object tenantAttribute = httpServletRequest.getAttribute("tenant");
        if (tenantAttribute != null) {
            String tenantSlug = tenantAttribute.toString();
            Tenant tenant = tenantService.getTenantBySlug(tenantSlug);
            if (tenant != null)
                return new ResponseEntity<>(tenant, HttpStatus.OK);
        }
        return new ResponseEntity<>(new RestError("Tenant is Inactive"), HttpStatus.BAD_REQUEST);
    }

}
