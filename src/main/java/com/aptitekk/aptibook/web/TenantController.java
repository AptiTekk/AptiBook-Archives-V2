/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web;

import com.aptitekk.aptibook.core.domain.RestError;
import com.aptitekk.aptibook.core.domain.Tenant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/tenant")
public class TenantController {

    @Autowired
    private HttpServletRequest httpServletRequest;

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<Object> getTenant() {
        Object tenantAttribute = httpServletRequest.getAttribute("tenant");
        if (tenantAttribute != null) {
            String tenant = tenantAttribute.toString();
            return new ResponseEntity<>(new Tenant(tenant), HttpStatus.OK);
        } else
            return new ResponseEntity<>(new RestError("Tenant is Inactive"), HttpStatus.BAD_REQUEST);
    }

}
