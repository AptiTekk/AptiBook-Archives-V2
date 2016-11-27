/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.repositories.UserGroupRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.UserGroupDTO;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@APIController
public class UserGroupController extends APIControllerAbstract {

    private final UserGroupRepository userGroupRepository;

    @Autowired
    public UserGroupController(UserGroupRepository userGroupRepository) {
        this.userGroupRepository = userGroupRepository;
    }

    @RequestMapping(value = "/userGroups", method = RequestMethod.GET)
    public ResponseEntity<?> getUserGroups() {

        if (authService.isUserSignedIn()) {
            return ok(modelMapper.map(userGroupRepository.findRootGroup(), UserGroupDTO.WithoutParentOrUsers.class));
        }

        return noPermission();
    }

}
