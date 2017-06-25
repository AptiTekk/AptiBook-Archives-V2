/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.validators;

import com.aptitekk.aptibook.service.tenant.TenantManagementService;
import com.aptitekk.aptibook.web.api.APIResponse;
import com.aptitekk.aptibook.web.util.WebURIBuilderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

@SuppressWarnings("SpringAutowiredFieldsWarningInspection")
public abstract class RestValidator {

    @Autowired
    private WebURIBuilderService webURIBuilderService;

    @Autowired
    private TenantManagementService tenantManagementService;

    public static class RestValidationException extends RuntimeException {

        private final APIResponse apiResponse;

        public RestValidationException(APIResponse apiResponse) {
            super(apiResponse.toString());
            this.apiResponse = apiResponse;
        }

        public APIResponse getApiResponse() {
            return apiResponse;
        }

    }
}
