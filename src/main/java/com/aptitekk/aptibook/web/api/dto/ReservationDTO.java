/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.dto;

import com.aptitekk.aptibook.domain.entities.serializers.LocalDateTimeSerializer;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.voodoodyne.jackson.jsog.JSOGGenerator;

import java.time.LocalDateTime;

@JsonIdentityInfo(generator = JSOGGenerator.class)
public class ReservationDTO {

    public Long id;

    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeSerializer.Deserializer.class)
    public LocalDateTime dateCreated;

    public String title;

    public String status;

    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeSerializer.Deserializer.class)
    public LocalDateTime start;

    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeSerializer.Deserializer.class)
    public LocalDateTime end;

    public ResourceDTO.WithoutReservations resource;

    public UserDTO.WithoutUserGroups user;

    public boolean approved;

    public boolean rejected;

    public boolean pending;

    @JsonIgnoreProperties({"resource"})
    public static class WithoutResource extends ReservationDTO {

    }

}
