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
import com.aptitekk.aptibook.web.util.WebURIBuilderService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

@SuppressWarnings("SpringAutowiredFieldsWarningInspection")
public abstract class APIControllerAbstract {

    public final static String[] ACCEPTED_TIME_FORMATS = {"yyyy-MM-dd'T'HH:mm:ss", "yyyy-MM-dd'T'HH:mm", "yyyy-MM-dd"};
    public final static String VALID_CHARACTER_PATTERN = "[^<>;=]*";
    public final static String INVALID_CHARACTERS = "< > ; =";

    public ModelMapper modelMapper = new ModelMapper();

    @Autowired
    public AuthService authService;

    @Autowired
    public LogService logService;

    @Autowired
    public PermissionsService permissionsService;

    @SuppressWarnings("WeakerAccess")
    @Autowired
    public TenantManagementService tenantManagementService;

    @Autowired
    public WebURIBuilderService webURIBuilderService;

    public APIControllerAbstract() {
        modelMapper.getConfiguration().setFieldMatchingEnabled(true);
    }

}
