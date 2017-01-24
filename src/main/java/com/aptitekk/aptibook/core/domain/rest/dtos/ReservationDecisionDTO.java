/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.rest.dtos;


public class ReservationDecisionDTO {

    public Long id;

    public UserDTO user;

    public UserGroupDTO.WithoutParentOrChildren userGroup;

    public ReservationDTO reservation;

    public boolean approved;

    public String comment;

}
