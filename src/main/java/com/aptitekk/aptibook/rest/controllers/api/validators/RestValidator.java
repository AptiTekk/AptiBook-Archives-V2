/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api.validators;

import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import com.aptitekk.aptibook.rest.RestOperations;
import com.aptitekk.aptibook.web.util.WebURIBuilderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

@SuppressWarnings("SpringAutowiredFieldsWarningInspection")
public abstract class RestValidator implements RestOperations {

    @Autowired
    private WebURIBuilderService webURIBuilderService;

    @Autowired
    private TenantManagementService tenantManagementService;

    @Override
    public WebURIBuilderService getWebURIBuilderService() {
        return webURIBuilderService;
    }

    @Override
    public TenantManagementService getTenantManagementService() {
        return tenantManagementService;
    }

    public static class RestValidationException extends RuntimeException {

        private final ResponseEntity<?> responseEntity;

        public RestValidationException(ResponseEntity<?> responseEntity) {
            super(responseEntity.toString());
            this.responseEntity = responseEntity;
        }

        public ResponseEntity<?> getResponseEntity() {
            return responseEntity;
        }

    }
}
