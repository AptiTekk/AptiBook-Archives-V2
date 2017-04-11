/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@APIController
public class SignOutController extends APIControllerAbstract {

    @RequestMapping(value = "/sign-out", method = RequestMethod.GET)
    public ResponseEntity<?> signOut() {
        this.authService.signOut();
        return noContent();
    }

}
