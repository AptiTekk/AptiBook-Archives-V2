/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.domain.entities.property.validators;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.xml.parsers.DocumentBuilderFactory;

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
            Document casDocument = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(inputValue + "/serviceValidate");
            casDocument.normalize();

            Element documentElement = casDocument.getDocumentElement();
            return documentElement.getTagName().equals("cas:serviceResponse");
        } catch (Exception e) {
            return false;
        }
    }
}
