/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.crypto.PasswordStorage;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.ResourceCategoryDTO;
import com.aptitekk.aptibook.core.domain.rest.dtos.UserDTO;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import com.google.gson.reflect.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@APIController
public class RegistrationController extends APIControllerAbstract{

    private UserRepository userRepository;


    @Autowired
    RegistrationController(UserRepository userRepository, TenantController tenantController) {
        this.userRepository = userRepository;
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<?> register(@RequestBody UserDTO.WithNewPassword userDTO) {
        System.out.println("Called register");
        User newUser = new User();
        newUser.emailAddress = userDTO.emailAddress;
        newUser.firstName = userDTO.firstName;
        newUser.lastName = userDTO.lastName;
        try {
            newUser.hashedPassword = PasswordStorage.createHash(userDTO.newPassword);
        }catch (PasswordStorage.CannotPerformOperationException e){
            logService.logException(getClass(), e, "Could not save user's password");
        }
        //TODO: Figure out how passwords work, with DTO and sending from Front end. Hash Password.
        //newUser.hashedPassword = userDTO
        User finalUser = userRepository.save(newUser);
        return created(modelMapper.map(finalUser, UserDTO.class), "/register/");
    }

}

