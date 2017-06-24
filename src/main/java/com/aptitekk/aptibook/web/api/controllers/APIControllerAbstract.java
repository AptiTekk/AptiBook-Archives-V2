/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.controllers;

import com.aptitekk.aptibook.service.LogService;
import com.aptitekk.aptibook.service.auth.AuthService;
import com.aptitekk.aptibook.service.entity.PermissionsService;
import com.aptitekk.aptibook.service.tenant.TenantManagementService;
import com.aptitekk.aptibook.web.RestOperations;
import com.aptitekk.aptibook.web.util.WebURIBuilderService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

@SuppressWarnings("SpringAutowiredFieldsWarningInspection")
public abstract class APIControllerAbstract implements RestOperations {

    final static String[] ACCEPTED_TIME_FORMATS = {"yyyy-MM-dd'T'HH:mm:ss", "yyyy-MM-dd'T'HH:mm", "yyyy-MM-dd"};
    final static String VALID_CHARACTER_PATTERN = "[^<>;=]*";

    ModelMapper modelMapper = new ModelMapper();

    @Autowired
    AuthService authService;

    @Autowired
    LogService logService;

    @Autowired
    PermissionsService permissionsService;

    @SuppressWarnings("WeakerAccess")
    @Autowired
    TenantManagementService tenantManagementService;

    @Autowired
    WebURIBuilderService webURIBuilderService;

    APIControllerAbstract() {
        modelMapper.getConfiguration().setFieldMatchingEnabled(true);
    }

    @Override
    public WebURIBuilderService getWebURIBuilderService() {
        return this.webURIBuilderService;
    }

    @Override
    public TenantManagementService getTenantManagementService() {
        return this.tenantManagementService;
    }
}
