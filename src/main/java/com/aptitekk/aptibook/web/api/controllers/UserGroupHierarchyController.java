/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.controllers;

import com.aptitekk.aptibook.domain.entities.UserGroup;
import com.aptitekk.aptibook.domain.repositories.UserGroupRepository;
import com.aptitekk.aptibook.service.entity.UserGroupService;
import com.aptitekk.aptibook.web.api.APIResponse;
import com.aptitekk.aptibook.web.api.annotations.APIController;
import com.aptitekk.aptibook.web.api.controllers.APIControllerAbstract;
import com.aptitekk.aptibook.web.api.dtos.UserGroupDTO;
import com.aptitekk.aptibook.web.api.validators.UserGroupValidator;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

@APIController
public class UserGroupHierarchyController extends APIControllerAbstract {

    private final UserGroupRepository userGroupRepository;
    private final UserGroupService userGroupService;

    @Autowired
    public UserGroupHierarchyController(UserGroupRepository userGroupRepository,
                               UserGroupService userGroupService) {
        this.userGroupRepository = userGroupRepository;
        this.userGroupService = userGroupService;
    }

    @RequestMapping(value = "/userGroups/{id}/hierarchy/up", method = RequestMethod.GET)
    public APIResponse getUserGroupsHierarchyUp(@PathVariable Long id) {
        UserGroup userGroup = userGroupRepository.findInCurrentTenant(id);
        if (userGroup == null)
            return APIResponse.notFound("No User Groups were found with the ID: " + id);

        return APIResponse.okResponse(modelMapper.map(userGroup, UserGroupDTO.HierarchyUp.class));
    }

    @RequestMapping(value = "/userGroups/{id}/hierarchy/down", method = RequestMethod.GET)
    public APIResponse getUserGroupsHierarchyDown(@PathVariable Long id) {
        UserGroup userGroup = userGroupRepository.findInCurrentTenant(id);
        if (userGroup == null)
            return APIResponse.notFound("No User Groups were found with the ID: " + id);

        return APIResponse.okResponse(modelMapper.map(userGroup, UserGroupDTO.HierarchyDown.class));
    }

}
