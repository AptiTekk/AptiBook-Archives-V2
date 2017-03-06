/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.AbstractWebClientTest;
import com.aptitekk.aptibook.core.domain.entities.Permission;
import com.aptitekk.aptibook.core.domain.entities.UserGroup;
import com.aptitekk.aptibook.core.domain.repositories.TenantRepository;
import com.aptitekk.aptibook.core.domain.repositories.UserGroupRepository;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.services.auth.AuthService;
import org.json.JSONObject;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertNotNull;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

public class UserGroupControllerTest extends AbstractWebClientTest {

    @MockBean
    private AuthService authService;

    @Autowired
    private UserGroupRepository userGroupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Test
    public void testAddNewUserGroup() throws Exception {

        given(this.authService.isUserSignedIn()).willReturn(true);
        given(this.authService.doesCurrentUserHavePermission(Permission.Descriptor.GROUPS_MODIFY_ALL)).willReturn(true);

        JSONObject newUserGroupJson = getJsonObjectFromFile("controllers/userGroupController/newUserGroup.json");

        this.mockMvc
                .perform(MockMvcRequestBuilders
                        .post("/api/junit/userGroups")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(newUserGroupJson.toString()))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(jsonPath("$.name", is(newUserGroupJson.getString("name"))));

        UserGroup userGroup = userGroupRepository.findByName(newUserGroupJson.getString("name"), getJUnitTenant());
        assertNotNull("User Group was not created.", userGroup);
    }

}