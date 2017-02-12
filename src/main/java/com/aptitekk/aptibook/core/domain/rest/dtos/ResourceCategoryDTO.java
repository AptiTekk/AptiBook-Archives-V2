/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.rest.dtos;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.voodoodyne.jackson.jsog.JSOGGenerator;

import java.util.List;

@JsonIdentityInfo(generator = JSOGGenerator.class)
public class ResourceCategoryDTO {

    public Long id;

    public String name;

    public List<ResourceDTO.WithoutReservations> resources;

    //Reservation Fields

    //Tags

    @JsonIgnoreProperties({"resources"})
    public static class WithoutResources extends ResourceCategoryDTO {

    }

}
