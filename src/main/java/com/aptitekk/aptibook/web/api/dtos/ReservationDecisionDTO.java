/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.dtos;


import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.voodoodyne.jackson.jsog.JSOGGenerator;

@JsonIdentityInfo(generator = JSOGGenerator.class)
public class ReservationDecisionDTO {

    public Long id;

    public UserDTO user;

    public UserGroupDTO userGroup;

    public ReservationDTO reservation;

    public boolean approved;

    public boolean rejected;

    public String comment;

    @JsonIgnoreProperties("reservation")
    public static class WithoutReservation extends ReservationDecisionDTO {

    }

}
