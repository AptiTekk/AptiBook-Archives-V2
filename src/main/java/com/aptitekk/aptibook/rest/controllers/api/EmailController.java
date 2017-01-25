/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;


import com.aptitekk.aptibook.core.services.EmailService;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@APIController
public class EmailController {
    private EmailService emailService;

    @Autowired
    EmailController(EmailService emailService){
        this.emailService = emailService;
    }



}
