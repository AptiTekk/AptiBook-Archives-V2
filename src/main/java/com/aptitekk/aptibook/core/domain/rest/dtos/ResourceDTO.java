/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.rest.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

public class ResourceDTO {

    public Long id;

    public String name;

    public boolean needsApproval;

    public ResourceCategoryDTO.WithoutResources resourceCategory;

    public List<ReservationDTO.WithoutResource> reservations;

    public UserGroupDTO.WithOnlyName owner;

    //Tags

    @JsonIgnoreProperties({"reservations"})
    public static class WithoutReservations extends ResourceDTO {

    }

    @JsonIgnoreProperties({"resourceCategory"})
    public static class WithoutResourceCategory extends ResourceDTO {

    }

}
