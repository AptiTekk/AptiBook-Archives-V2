/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.repositories;

import com.aptitekk.aptibook.core.domain.entities.Reservation;
import com.aptitekk.aptibook.core.domain.entities.ReservationField;
import com.aptitekk.aptibook.core.domain.entities.ReservationFieldEntry;
import com.aptitekk.aptibook.core.domain.repositories.annotations.EntityRepository;

import javax.persistence.NoResultException;
import java.util.List;

@EntityRepository
public class ReservationFieldEntryRepository extends MultiTenantEntityRepositoryAbstract<ReservationFieldEntry> {

    public List<ReservationFieldEntry> findAllForReservation(Reservation reservation) {
        if (reservation == null)
            return null;

        return entityManager
                .createQuery("SELECT e FROM ReservationFieldEntry e WHERE e.reservation = :reservation", ReservationFieldEntry.class)
                .setParameter("reservation", reservation)
                .getResultList();
    }

    public String findEntryTextForReservationField(Reservation reservation, ReservationField reservationField) {
        if (reservation == null || reservationField == null)
            return null;

        try {
            return entityManager
                    .createQuery("SELECT e FROM ReservationFieldEntry e WHERE e.reservation = :reservation AND e.field = :field", ReservationFieldEntry.class)
                    .setParameter("reservation", reservation)
                    .setParameter("field", reservationField)
                    .getSingleResult().getContent();
        } catch (NoResultException e) {
            return null;
        }
    }

}
