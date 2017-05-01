/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.UserDTO;
import com.aptitekk.aptibook.core.security.PasswordUtils;
import com.aptitekk.aptibook.core.services.EmailService;
import com.aptitekk.aptibook.core.util.PasswordGenerator;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import com.aptitekk.aptibook.rest.controllers.api.validators.UserValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletResponse;

@APIController
public class RegistrationController extends APIControllerAbstract {

    private UserRepository userRepository;
    private final UserValidator userValidator;
    private EmailService emailService;

    @Autowired
    RegistrationController(UserRepository userRepository,
                           UserValidator userValidator,
                           EmailService emailService) {
        this.userRepository = userRepository;
        this.userValidator = userValidator;
        this.emailService = emailService;
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<?> register(@RequestBody UserDTO.WithNewPassword userDTO) {

        User newUser = new User();

        if (userDTO.emailAddress == null)
            return badRequest("The Email Address was not supplied.");

        userValidator.validateEmailAddress(userDTO.emailAddress, null);
        newUser.setEmailAddress(userDTO.emailAddress);

        if (userDTO.firstName != null) {
            userValidator.validateFirstName(userDTO.firstName);
            newUser.setFirstName(userDTO.firstName);
        }

        if (userDTO.lastName != null) {
            userValidator.validateLastName(userDTO.lastName);
            newUser.setLastName(userDTO.lastName);
        }

        if (userDTO.phoneNumber != null) {
            userValidator.validatePhoneNumber(userDTO.phoneNumber);
            newUser.setPhoneNumber(userDTO.phoneNumber);
        }

        if (userDTO.newPassword == null)
            return badRequest("The New Password was not supplied.");

        userValidator.validatePassword(userDTO.newPassword);
        newUser.setHashedPassword(PasswordUtils.encodePassword(userDTO.newPassword));

        // Create the verification code.
        String verificationCode = PasswordGenerator.generateRandomPassword(16);
        newUser.setVerificationCode(verificationCode);

        // Save the user to the database.
        newUser = userRepository.save(newUser);

        // Create query parameters for the url in the email.
        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("code", verificationCode);

        // Send off an email telling the user to verify their email.
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
        user.setVerified(true);
        user.setVerificationCode(null);
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
        //FIXME: Verification using wrong sign in domain.
        httpServletResponse.setStatus(HttpStatus.TEMPORARY_REDIRECT.value());
        httpServletResponse.setHeader("Location", "/" + this.tenantManagementService.getTenant().domain + "/sign-in?verified=" + verified);
    }

}

