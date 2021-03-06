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
public class ResourceDTO {

    public Long id;

    public String name;

    public Boolean needsApproval;

    public Boolean hasImage;

    public ResourceCategoryDTO resourceCategory;

    public List<ReservationDTO> reservations;

    public UserGroupDTO.WithoutParentOrChildren owner;

    //Tags

    @JsonIgnoreProperties({"reservations"})
    public static class WithoutReservations extends ResourceDTO {

    }

    @JsonIgnoreProperties({"resourceCategory"})
    public static class WithoutResourceCategory extends ResourceDTO {

    }

}
