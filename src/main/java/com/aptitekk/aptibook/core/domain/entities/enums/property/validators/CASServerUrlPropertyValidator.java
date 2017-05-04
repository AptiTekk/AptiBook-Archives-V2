/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities.enums.property.validators;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

/**
 * Verifies a CAS Server URL by attempting to "validate" a ticket (and expecting a validation failure).
 */
public class CASServerUrlPropertyValidator extends PropertyValidator {

    public CASServerUrlPropertyValidator() {
        super("Could not connect to the CAS Server. Please check the URL.");
    }

    @Override
    public boolean isValid(String inputValue) {
        try {
            ResponseEntity<String> responseEntity = new RestTemplate().getForEntity(inputValue + "/serviceValidate?format=JSON", String.class);

            // Check for OK status
            if (responseEntity.getStatusCode() != HttpStatus.OK)
                return false;

            try {
                // Convert response body to JSON
                JSONObject body = new JSONObject(responseEntity.getBody());

                // Check for serviceResponse key.
                JSONObject serviceResponse = body.getJSONObject("serviceResponse");

                // Check for authenticationFailure key.
                serviceResponse.getJSONObject("authenticationFailure");

                return true;
            } catch (JSONException e) {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }
}
