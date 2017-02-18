/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.UserDTO;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.postgresql.util.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@APIController
public class AuthController extends APIControllerAbstract {

    private final UserRepository userRepository;

    @Autowired
    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @RequestMapping(value = "auth/sign-in", method = RequestMethod.GET)
    public ResponseEntity<?> basicAuthentication(HttpServletRequest request, HttpServletResponse response) {
        String authorizationHeader = request.getHeader("Authorization");

        //Make sure header exists
        if (authorizationHeader == null || authorizationHeader.isEmpty()) {

            // If the header doesn't exist or is empty,
            // then check if we already know who the user is, and send that data back.
            User currentUser = authService.getCurrentUser();
            if (currentUser != null) {
                return ok(modelMapper.map(currentUser, UserDTO.class));
            }

            return badRequest("Authorization header was empty.");
        }

        //Split on whitespace (Example header: "Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==")
        String[] splitAuthorizationHeader = authorizationHeader.split("\\s");

        //Check for two pieces ( ["Basic", "QWxhZGRpbjpvcGVuIHNlc2FtZQ=="] )
        if (splitAuthorizationHeader.length != 2) {
            return badRequest("Malformed Authorization header.");
        }

        switch (splitAuthorizationHeader[0]) {
            // Basic auth type.
            case "Basic":
                //Decode
                String decodedAuth = new String(Base64.decode(splitAuthorizationHeader[1]));

                //Split on colon (Example of decoded: "Aladdin:open sesame")
                String[] authSplit = decodedAuth.split(":");

                if (authSplit.length != 2) {
                    return badRequest("Decoded data could not be parsed.");
                }

                User user = userRepository.findUserWithCredentials(authSplit[0], authSplit[1]);

                // User does not exist; bad email/password.
                if (user == null)
                    return unauthorized("The Email Address or Password supplied was incorrect.");

                // User is not verified.
                if (!user.verified)
                    return unauthorized("Your Email Address is not verified! Check your email for a link.");

                // All is well, set the current user.
                authService.setCurrentUser(user, response);
                return ok(modelMapper.map(user, UserDTO.class));

            // All other auth types.
            default:
                return badRequest("Authorization scheme '" + splitAuthorizationHeader[0] + "' not implemented.");
        }
    }

    @RequestMapping(value = "auth/sign-out", method = RequestMethod.GET)
    public ResponseEntity<?> signOut(HttpServletResponse response) {
        authService.signOutCurrentUser(response);
        return noContent();
    }

}
