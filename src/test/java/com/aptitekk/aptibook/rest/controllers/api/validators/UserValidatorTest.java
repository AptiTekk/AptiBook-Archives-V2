/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api.validators;

import com.aptitekk.AbstractWebClientTest;
import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.TenantRepository;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.mockito.BDDMockito.given;

public class UserValidatorTest extends AbstractWebClientTest {

    @Autowired
    private UserValidator userValidator;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @MockBean
    private TenantManagementService tenantManagementService;

    @Override
    @Before
    public void setUp() throws Exception {
        super.setUp();

        Tenant demoTenant = tenantRepository.findTenantBySlug("demo");
        given(this.tenantManagementService.getTenant()).willReturn(demoTenant);
    }

    /**
     * This test makes sure that an exception is thrown if we try to check if the "admin" email address is in use for a new user.
     */
    @Test(expected = RestValidator.RestValidationException.class)
    public void testCheckIfAdminEmailAddressIsInUse() {
        userValidator.checkIfEmailAddressIsInUse("admin", null);
    }

    /**
     * This test makes sure that an exception is NOT thrown if we try to check if the "admin" email address is in use, excluding the admin user.
     */
    @Test
    public void testCheckIfAdminEmailAddressIsInUseExcludingAdminUser() {
        User adminUser = userRepository.findByEmailAddress("admin");
        userValidator.checkIfEmailAddressIsInUse("admin", adminUser.getId());
    }

}