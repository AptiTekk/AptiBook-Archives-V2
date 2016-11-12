/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.entities;

import com.aptitekk.aptibook.core.domain.entities.Reservation;
import com.aptitekk.aptibook.core.domain.entities.ReservationField;
import com.aptitekk.aptibook.core.domain.entities.ReservationFieldEntry;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import javax.persistence.NoResultException;
import java.io.Serializable;
import java.util.List;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class ReservationFieldEntryService extends MultiTenantRepositoryAbstract<ReservationFieldEntry> implements Serializable {

    public List<ReservationFieldEntry> getAllForReservation(Reservation reservation) {
        if (reservation == null)
            return null;

        return entityManager
                .createQuery("SELECT e FROM ReservationFieldEntry e WHERE e.reservation = ?1", ReservationFieldEntry.class)
                .setParameter(1, reservation)
                .getResultList();
    }

    public String getEntryTextForReservationField(Reservation reservation, ReservationField reservationField) {
        if (reservation == null || reservationField == null)
            return null;

        try {
            return entityManager
                    .createQuery("SELECT e FROM ReservationFieldEntry e WHERE e.reservation = ?1 AND e.field = ?2", ReservationFieldEntry.class)
                    .setParameter(1, reservation)
                    .setParameter(2, reservationField)
                    .getSingleResult().getContent();
        } catch (NoResultException e) {
            return null;
        }
    }

}
