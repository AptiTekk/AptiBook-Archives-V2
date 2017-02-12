/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.crypto.PasswordStorage;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.UserDTO;
import com.aptitekk.aptibook.core.services.EmailService;
import com.aptitekk.aptibook.core.util.PasswordGenerator;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@APIController
public class RegistrationController extends APIControllerAbstract {

    private UserRepository userRepository;
    private EmailService emailService;

    @Autowired
    RegistrationController(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<?> register(@RequestBody UserDTO.WithNewPassword userDTO) {

        User newUser = new User();

        if (userDTO.emailAddress != null)
            if (!EmailValidator.getInstance().isValid(userDTO.emailAddress))
                return badRequest("The Email Address is invalid.");
            else
                newUser.setEmailAddress(userDTO.emailAddress);

        User otherUser = userRepository.findByEmailAddress(userDTO.emailAddress);
        if (otherUser != null)
            return badRequest("The Email Address is already in use.");

        if (userDTO.firstName != null)
            if (!userDTO.firstName.matches("[^<>;=]*"))
                return badRequest("The First Name cannot contain these characters: < > ; =");
            else if (userDTO.firstName.length() > 30)
                return badRequest("The First Name must be 30 characters or less.");
            else
                newUser.firstName = userDTO.firstName;

        if (userDTO.lastName != null)
            if (!userDTO.lastName.matches("[^<>;=]*"))
                return badRequest("The Last Name cannot contain these characters: < > ; =");
            else if (userDTO.lastName.length() > 30)
                return badRequest("The Last Name must be 30 characters or less.");
            else
                newUser.lastName = userDTO.lastName;

        if (userDTO.phoneNumber != null)
            if (!userDTO.phoneNumber.matches("[^<>;=]*"))
                return badRequest("The Phone Number cannot contain these characters: < > ; =");
            else if (userDTO.phoneNumber.length() > 30)
                return badRequest("The Phone Number must be 30 characters or less.");
            else
                newUser.phoneNumber = userDTO.phoneNumber;

        if (userDTO.location != null)
            if (!userDTO.location.matches("[^<>;=]*"))
                return badRequest("The Location cannot contain these characters: < > ; =");
            else if (userDTO.location.length() > 250)
                return badRequest("The Location must be 250 characters or less.");
            else
                newUser.location = userDTO.location;

        if (userDTO.newPassword != null)
            if (userDTO.newPassword.length() > 30)
                return badRequest("The Password must be 30 characters or less.");
            else
                try {
                    newUser.hashedPassword = PasswordStorage.createHash(userDTO.newPassword);
                } catch (PasswordStorage.CannotPerformOperationException e) {
                    logService.logException(getClass(), e, "Could not hash password.");
                    return serverError("Could not save new password.");
                }

        // Create the verification code.
        String code = PasswordGenerator.generateRandomPassword(16);
        newUser.verificationCode = code;

        // Save the user to the database.
        newUser = userRepository.save(newUser);

        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("code", code);

        // Send off a notification.
        this.emailService.sendEmailNotification(
                newUser.getEmailAddress(),
                "Verify Your Email",
                "<p>Hello! Someone (hopefully you) has registered an account with AptiBook using this email address. " +
                        "To cut down on spam, all we ask is that you click the link below to verify your account.</p>" +

                        "<p>If you did not intend to register with AptiBook, simply ignore this email and have a nice day!</p>" +

                        "<a href='" + webURIBuilderService.buildAPIURI(tenantManagementService.getTenant(), "register/verify", queryParams) + "'>Verify Account</a>");

        return created(modelMapper.map(newUser, UserDTO.class), "/users/" + newUser.getId());
    }

    @RequestMapping(value = "/register/verify", method = RequestMethod.GET)
    public void register(@RequestParam(value = "code", required = false) String code, HttpServletResponse httpServletResponse) {
        // If the code is null, redirect to root.
        if (code == null) {
            redirectToSignIn(httpServletResponse, false);
            return;
        }

        // Find the user with the specified code.
        User user = userRepository.findByVerificationCode(code);

        // If the user is null (not found), redirect to root.
        if (user == null) {
            redirectToSignIn(httpServletResponse, false);
            return;
        }

        // Mark the user as verified and save the user.
        user.verified = true;
        user.verificationCode = null;
        userRepository.save(user);

        // Redirect to Tenant sign-in page.
        redirectToSignIn(httpServletResponse, true);
    }

    /**
     * Redirects the request to the sign-in page of the tenant.
     *
     * @param httpServletResponse The response to apply the redirect to.
     * @param verified            If the verification succeeded or not.
     */
    private void redirectToSignIn(HttpServletResponse httpServletResponse, boolean verified) {
        try {
            httpServletResponse.sendRedirect("/" + this.tenantManagementService.getTenant().slug + "/sign-in?verified=" + verified);
        } catch (IOException e) {
            logService.logException(getClass(), e, "Could not redirect to sign-in");
        }
    }

}

