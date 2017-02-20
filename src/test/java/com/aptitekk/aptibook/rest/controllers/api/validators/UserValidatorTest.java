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
import com.aptitekk.aptibook.core.domain.repositories.UserGroupRepository;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.UserGroupDTO;
import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.BDDMockito.given;

public class UserValidatorTest extends AbstractWebClientTest {

    @Autowired
    private UserValidator userValidator;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserGroupRepository userGroupRepository;

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

    /**
     * Tests to make sure an exception is thrown when the first name is too long.
     */
    @Test(expected = RestValidator.RestValidationException.class)
    public void testFirstNameIsTooLong() {
        // 31 characters
        userValidator.validateFirstName("abcdefghijklmnopqrstuvwxyzabcde");
    }

    /**
     * Tests to make sure an exception is NOT thrown when the first name is an okay length.
     */
    @Test
    public void testFirstNameIsNotTooLong() {
        // 30 characters
        userValidator.validateFirstName("abcdefghijklmnopqrstuvwxyzabcd");
    }

    /**
     * Tests to make sure an exception is thrown when a first name with bad characters is used.
     */
    @Test(expected = RestValidator.RestValidationException.class)
    public void testInvalidCharactersInFirstName() {
        userValidator.validateFirstName("<b>Bad First Name</b> = test;");
    }

    /**
     * Tests to make sure an exception is thrown when the last name is too long.
     */
    @Test(expected = RestValidator.RestValidationException.class)
    public void testLastNameIsTooLong() {
        // 31 characters
        userValidator.validateLastName("abcdefghijklmnopqrstuvwxyzabcde");
    }

    /**
     * Tests to make sure an exception is NOT thrown when the last name is an okay length.
     */
    @Test
    public void testLastNameIsNotTooLong() {
        // 30 characters
        userValidator.validateLastName("abcdefghijklmnopqrstuvwxyzabcd");
    }

    /**
     * Tests to make sure an exception is thrown when a last name with bad characters is used.
     */
    @Test(expected = RestValidator.RestValidationException.class)
    public void testInvalidCharactersInLastName() {
        userValidator.validateLastName("<b>Bad Last Name</b> = test;");
    }

    /**
     * Tests to make sure an exception is thrown when the phone number is too long.
     */
    @Test(expected = RestValidator.RestValidationException.class)
    public void testPhoneNumberIsTooLong() {
        // 31 characters
        userValidator.validatePhoneNumber("0123456789012345678901234567890");
    }

    /**
     * Tests to make sure an exception is NOT thrown when the phone number is an okay length.
     */
    @Test
    public void testPhoneNumberIsNotTooLong() {
        // 30 characters
        userValidator.validatePhoneNumber("012345678901234567890123456789");
    }

    /**
     * Tests to make sure an exception is thrown when a phone number with bad characters is used.
     */
    @Test(expected = RestValidator.RestValidationException.class)
    public void testInvalidCharactersInPhoneNumber() {
        userValidator.validatePhoneNumber("<b>Bad Phone Number</b> = test;");
    }

    /**
     * Tests to make sure an exception is thrown when the location is too long.
     */
    @Test(expected = RestValidator.RestValidationException.class)
    public void testLocationIsTooLong() {
        // 251 characters
        userValidator.validateLocation("RhkjKHc44x42mmHoGJgscoy4Y9Acr4WEWntWqHOvLbnR0QFjqunVu7pVoBPFvxTQIzMlPVIq9DpmVRsUgnkb64Rb9wGGxPR15IQOgHIUuYmhVOUXuOskhLXWQ0CXnQJb64UWVUPzPymCvOiJFPxzsbeq6QMqqLMKcrPr16k1jbfABC12mISwXOqCVyjbIRqDKJLe2unU2MRUB7BIYVCXfS5J1tUVge33q8qV8Tmaoxheu8mvg8xECmW7yiZ");
    }

    /**
     * Tests to make sure an exception is NOT thrown when the location is an okay length.
     */
    @Test
    public void testLocationIsNotTooLong() {
        // 250 characters
        userValidator.validateLocation("RhkjKHc44x42mmHoGJgscoy4Y9Acr4WEWntWqHOvLbnR0QFjqunVu7pVoBPFvxTQIzMlPVIq9DpmVRsUgnkb64Rb9wGGxPR15IQOgHIUuYmhVOUXuOskhLXWQ0CXnQJb64UWVUPzPymCvOiJFPxzsbeq6QMqqLMKcrPr16k1jbfABC12mISwXOqCVyjbIRqDKJLe2unU2MRUB7BIYVCXfS5J1tUVge33q8qV8Tmaoxheu8mvg8xECmW7yi");
    }

    /**
     * Tests to make sure an exception is thrown when a location with bad characters is used.
     */
    @Test(expected = RestValidator.RestValidationException.class)
    public void testInvalidCharactersInLocation() {
        userValidator.validateLocation("<b>Bad Location</b> = test;");
    }

    /**
     * Tests to make sure an exception is thrown when the password is too long.
     */
    @Test(expected = RestValidator.RestValidationException.class)
    public void testPasswordIsTooLong() {
        // 31 characters
        userValidator.validatePassword("Ora4jvzyli1UztYuGsnR9KD0hYS3zqS");
    }

    /**
     * Tests to make sure an exception is NOT thrown when the password is an okay length.
     */
    @Test
    public void testPasswordIsNotTooLong() {
        // 30 characters
        userValidator.validatePassword("Ora4jvzyli1UztYuGsnR9KD0hYS3zq");
    }

    /**
     * Makes sure that a new user (non-admin) cannot be assigned to the root group.
     */
    @Test(expected = RestValidator.RestValidationException.class)
    public void testAssignNonAdminUserToRoot() {
        List<UserGroupDTO> userGroupDTOs = new ArrayList<>();

        UserGroupDTO rootGroup = new UserGroupDTO();
        rootGroup.id = userGroupRepository.findByName("root").id;
        userGroupDTOs.add(rootGroup);

        userValidator.validateUserGroups(userGroupDTOs, null);
    }

    /**
     * Makes sure that the admin user cannot be assigned to groups other than root.
     */
    @Test(expected = RestValidator.RestValidationException.class)
    public void testAssignAdminUserToNonRoot() {
        List<UserGroupDTO> userGroupDTOs = new ArrayList<>();

        UserGroupDTO administratorsGroup = new UserGroupDTO();
        administratorsGroup.id = userGroupRepository.findByName("Administrators").id;
        userGroupDTOs.add(administratorsGroup);

        userValidator.validateUserGroups(userGroupDTOs, userRepository.findByEmailAddress("admin"));
    }

    /**
     * Makes sure that the admin user cannot be assigned to no groups at all.
     */
    @Test(expected = RestValidator.RestValidationException.class)
    public void testAssignAdminUserToNothing() {
        List<UserGroupDTO> userGroupDTOs = new ArrayList<>();
        userValidator.validateUserGroups(userGroupDTOs, userRepository.findByEmailAddress("admin"));
    }

    /**
     * Tests to ensure that users cannot be assigned to multiple groups of the same branch.
     */
    @Test(expected = RestValidator.RestValidationException.class)
    public void testAssignUserToMultipleGroupsOfSameBranch() {
        List<UserGroupDTO> userGroupDTOs = new ArrayList<>();

        UserGroupDTO administratorsGroup = new UserGroupDTO();
        administratorsGroup.id = userGroupRepository.findByName("Administrators").id;
        userGroupDTOs.add(administratorsGroup);

        UserGroupDTO librariansGroup = new UserGroupDTO();
        librariansGroup.id = userGroupRepository.findByName("Librarians").id;
        userGroupDTOs.add(librariansGroup);

        userValidator.validateUserGroups(userGroupDTOs, null);
    }

    /**
     * Tests to ensure that users can be assigned to one group of the branch without issues.
     */
    @Test
    public void testAssignUserToOneGroupOnBranch() {
        List<UserGroupDTO> userGroupDTOs = new ArrayList<>();

        UserGroupDTO administratorsGroup = new UserGroupDTO();
        administratorsGroup.id = userGroupRepository.findByName("Administrators").id;
        userGroupDTOs.add(administratorsGroup);

        userValidator.validateUserGroups(userGroupDTOs, null);
    }

}