/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.aptitekk.aptibook.core.domain.entities;

import com.aptitekk.aptibook.core.domain.entities.enums.Permissions;
import com.aptitekk.aptibook.core.util.EqualsHelper;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity

public class Notification extends MultiTenantEntity implements Serializable {

    @Id
    @GeneratedValue
    public Long id;

    @ManyToOne
    public User user;

    public String subject;

    public String body;

    public LocalDateTime creation = LocalDateTime.now();

    public boolean notif_read = false;

    public Notification() {
        super();
    }

    public Notification(User user, String subject, String body) {
        this.user = user;
        this.subject = subject;
        this.body = body;
    }

    public boolean getRead() {
        return notif_read;
    }

    public void setRead(boolean notif_read) {
        this.notif_read = notif_read;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null) return false;

        if (!(o instanceof Notification)) return false;

        Notification other = (Notification) o;

        return EqualsHelper.areEquals(subject, other.subject)
                && EqualsHelper.areEquals(body, other.body)
                && EqualsHelper.areEquals(creation, other.creation)
                && EqualsHelper.areEquals(notif_read, other.notif_read);
    }

    @Override
    public int hashCode() {
        return EqualsHelper.calculateHashCode(subject, body, creation, notif_read);
    }

}
