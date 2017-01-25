/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.root;

import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.websocket.server.PathParam;

@RestController
public class VerifyUserController {

    private final UserRepository userRepository;

    @Autowired
    public VerifyUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @RequestMapping("/verify")
    public void verifyUserEmail(@PathParam("code") String code) {


        if(code != null){
            User user = userRepository.findByVerificationCode(code);
            user.verified = true;
            userRepository.save(user);
            //redirect to tenant slug

        }

        System.out.println(code);


    }

}
