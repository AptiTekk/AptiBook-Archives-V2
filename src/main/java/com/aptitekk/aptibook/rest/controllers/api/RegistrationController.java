/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.crypto.PasswordStorage;
import com.aptitekk.aptibook.core.domain.entities.Notification;
import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.ResourceCategoryDTO;
import com.aptitekk.aptibook.core.domain.rest.dtos.UserDTO;
import com.aptitekk.aptibook.core.services.EmailService;
import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import com.aptitekk.aptibook.core.util.PasswordGenerator;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import com.google.gson.reflect.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@APIController
public class RegistrationController extends APIControllerAbstract{

    private UserRepository userRepository;
    private EmailService emailService;
    private TenantManagementService tenantManagementService;
    @Autowired
    RegistrationController(UserRepository userRepository, TenantManagementService tenantManagementService, EmailService emailService) {
        this.userRepository = userRepository;
        this.tenantManagementService = tenantManagementService;
        this.emailService = emailService;

    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<?> register(HttpServletResponse httpServletResponse, @RequestBody UserDTO.WithNewPassword userDTO) {

        if(userRepository.findByEmailAddress(userDTO.emailAddress) != null){
            System.out.println("error has occurred");
            redirectToTenantWithError(httpServletResponse, tenantManagementService.getTenant().slug, "user_exists");
            return badRequest("User with this email address already exists");

        }
        if(userDTO.firstName == null || userDTO.lastName == null){
            redirectToTenantWithError(httpServletResponse, tenantManagementService.getTenant().slug, "null_fields");
            return badRequest("An error has occurred. Please try again later.");
        }
        User newUser = new User();
        newUser.verified = false;
        newUser.setEmailAddress(userDTO.emailAddress);
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
        newUser = userRepository.save(newUser);
        Notification notification = new Notification(newUser, "Registration Verification", "<p>Hi! Someone (hopefully you) has registered an account with AptiBook using this email address. " +
                "To cut down on spam, all we ask is that you click the link below to verify your account.</p>" +
                "<p>If you did not intend to register with AptiBook, simply ignore this email and have a nice day!</p>" +
                "<a href='" + "www.aptibook.aptitekk.com/verify?" + "code" + "=" + code
                + "'" + ">Verify Account</a>"); //add url with unique code here
        this.emailService.sendEmailNotification(notification);
        return created(modelMapper.map(newUser, UserDTO.class), "/register/");
    }

    private void redirectToTenantWithError(HttpServletResponse httpServletResponse, String tenantSlug, String error) {
        try {
            httpServletResponse.sendRedirect("/" + tenantSlug + (error != null ? "?registerError=" + error : ""));
        } catch (IOException e) {
            logService.logException(getClass(), e, "Could not redirect to tenant root");
            redirectToWebRoot(httpServletResponse);
        }
    }

    private void redirectToWebRoot(HttpServletResponse httpServletResponse) {
        try {
            httpServletResponse.sendRedirect("/");
        } catch (IOException e) {
            logService.logException(getClass(), e, "Could not redirect to web root");
        }
    }

}

