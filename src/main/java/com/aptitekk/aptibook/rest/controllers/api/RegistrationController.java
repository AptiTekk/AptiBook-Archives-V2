/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.crypto.PasswordStorage;
import com.aptitekk.aptibook.core.domain.entities.Notification;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.ResourceCategoryDTO;
import com.aptitekk.aptibook.core.domain.rest.dtos.UserDTO;
import com.aptitekk.aptibook.core.services.EmailService;
import com.aptitekk.aptibook.core.util.PasswordGenerator;
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
    private EmailService emailService;

    @Autowired
    RegistrationController(UserRepository userRepository, TenantController tenantController, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<?> register(@RequestBody UserDTO.WithNewPassword userDTO) {
        System.out.println("Called register");
        User newUser = new User();
        newUser.verified = userDTO.verified;
        newUser.emailAddress = userDTO.emailAddress;
        newUser.firstName = userDTO.firstName;
        newUser.lastName = userDTO.lastName;
        try {
            newUser.hashedPassword = PasswordStorage.createHash(userDTO.newPassword);
        }catch (PasswordStorage.CannotPerformOperationException e){
            logService.logException(getClass(), e, "Could not save user's password");
        }

        //make unique code
        String code = PasswordGenerator.generateRandomPassword(16);
        newUser.verificationCode = code;
        User finalUser = userRepository.save(newUser);
        Notification notification = new Notification(finalUser, "Registration", "localhost:8080/verify?code=" + code); //add url with unique code here
        this.emailService.sendEmailNotification(notification);
        return created(modelMapper.map(finalUser, UserDTO.class), "/register/");
    }

}

