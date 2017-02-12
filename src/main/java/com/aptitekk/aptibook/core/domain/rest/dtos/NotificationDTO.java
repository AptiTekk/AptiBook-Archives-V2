/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.rest.dtos;

import com.aptitekk.aptibook.core.domain.entities.serializers.LocalDateTimeSerializer;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.voodoodyne.jackson.jsog.JSOGGenerator;

import java.time.LocalDateTime;

@JsonIdentityInfo(generator = JSOGGenerator.class)
public class NotificationDTO {

    public Long id;

    public UserDTO.WithoutUserGroups user;

    public String subject;

    public String body;

    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeSerializer.Deserializer.class)
    public LocalDateTime creation;

    public boolean read;

    @JsonIgnoreProperties({"user"})
    public static class WithoutUser extends NotificationDTO {

    }

}
