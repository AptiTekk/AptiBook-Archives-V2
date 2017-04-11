/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api.validators;

import com.aptitekk.aptibook.AbstractWebClientTest;
import com.aptitekk.aptibook.core.domain.entities.UserGroup;
import com.aptitekk.aptibook.core.domain.repositories.UserGroupRepository;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class UserGroupValidatorTest extends AbstractWebClientTest {

    @Autowired
    private UserGroupValidator userGroupValidator;

    @Autowired
    private UserGroupRepository userGroupRepository;

    @Test(expected = RestValidator.RestValidationException.class)
    public void testCheckIfRootNameIsInUse() {
        userGroupValidator.checkIfNameIsInUse("root", null);
    }

    @Test
    public void testCheckIfRootNameIsInUseExcludingRoot() {
        UserGroup rootGroup = userGroupRepository.findRootGroup();
        userGroupValidator.checkIfNameIsInUse("root", rootGroup.getId());
    }

    @Test
    public void testRootNameIsValidForRoot() {
        UserGroup rootGroup = userGroupRepository.findRootGroup();
        userGroupValidator.validateName("root", rootGroup);
    }

    @Test(expected = RestValidator.RestValidationException.class)
    public void testRootNameIsInvalidForNonRoot() {
        userGroupValidator.validateName("root", null);
    }



}