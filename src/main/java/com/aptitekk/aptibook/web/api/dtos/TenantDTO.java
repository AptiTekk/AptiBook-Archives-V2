/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.dtos;

import com.aptitekk.aptibook.domain.entities.property.Property;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.voodoodyne.jackson.jsog.JSOGGenerator;

public class TenantDTO {

    public Long id;

    public String domain;

    public String name;

    public Property.AuthenticationMethod authenticationMethod;

}
