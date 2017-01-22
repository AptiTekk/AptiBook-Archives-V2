/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

public class RegistrationController {

    private UserRepository userRepository;
    private TenantController tenantController;


    @Autowired
    RegistrationController(UserRepository userRepository, TenantController tenantController) {
        this.tenantController = tenantController;
        this.userRepository = userRepository;
    }

    @RequestMapping(value = "register", method = RequestMethod.POST)
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        User newUser = new User();
        newUser.emailAddress = userDTO.emailAddress;
        newUser.firstName = userDTO.firstName;
        newUser.lastName = userDTO.lastName;
        //TODO: Figure out how passwords work, with DTO and sending from Front end. Hash Password.
        //newUser.hashedPassword = userDTO
        userRepository.save(newUser);
    }


}
