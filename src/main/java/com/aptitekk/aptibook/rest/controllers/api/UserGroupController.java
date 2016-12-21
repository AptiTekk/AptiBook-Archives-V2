/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.entities.UserGroup;
import com.aptitekk.aptibook.core.domain.repositories.UserGroupRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.ReservationDTO;
import com.aptitekk.aptibook.core.domain.rest.dtos.UserGroupDTO;
import com.aptitekk.aptibook.core.services.entity.UserGroupService;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.ArrayList;
import java.util.List;

@APIController
public class UserGroupController extends APIControllerAbstract {

    private final UserGroupRepository userGroupRepository;
    private final UserGroupService userGroupService;

    @Autowired
    public UserGroupController(UserGroupRepository userGroupRepository, UserGroupService userGroupService) {
        this.userGroupRepository = userGroupRepository;
        this.userGroupService = userGroupService;
    }

    @RequestMapping(value = "/userGroups", method = RequestMethod.GET)
    public ResponseEntity<?> getUserGroups() {

        if (authService.isUserSignedIn()) {
            return ok(modelMapper.map(userGroupRepository.findRootGroup(), UserGroupDTO.WithoutParentOrUsers.class));
        }

        return noPermission();
    }


    @RequestMapping(value = "/userGroups/hierarchyDown/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getUserGroupHierarchyDown(@PathVariable Long id) {
        if (id == null)
            return badRequest("Missing ID");

        if (authService.isUserSignedIn()) {
            User user = authService.getCurrentUser();
            List<UserGroup> userGroupList = new ArrayList<>();
            if (user.isAdmin() || user.getId().equals(id)) {
                for (UserGroup userGroup : user.userGroups) {
                    userGroupList.addAll(userGroupService.getHierarchyDown(userGroup));
                }
                return ok(modelMapper.map(userGroupList, new TypeToken<List<UserGroupDTO>>() {
                }.getType()));

            }
        }
        return noPermission();
    }
}
