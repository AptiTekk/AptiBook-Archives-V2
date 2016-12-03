/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.rest.dtos;

import com.aptitekk.aptibook.core.domain.entities.serializers.LocalDateTimeSerializer;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.time.LocalDateTime;

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

    /*public List<ReservationDecision> decisions;

    public List<ReservationFieldEntry> fieldEntries;*/

    @JsonIgnoreProperties({"resource"})
    public static class WithoutResource extends ReservationDTO {

    }

}
