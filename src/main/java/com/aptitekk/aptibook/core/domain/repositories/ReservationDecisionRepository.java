/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.repositories;

import com.aptitekk.aptibook.core.domain.entities.Reservation;
import com.aptitekk.aptibook.core.domain.entities.ReservationDecision;
import com.aptitekk.aptibook.core.domain.entities.UserGroup;
import com.aptitekk.aptibook.core.domain.repositories.annotations.EntityRepository;

import java.util.List;

@EntityRepository
public class ReservationDecisionRepository extends MultiTenantEntityRepositoryAbstract<ReservationDecision> {

    /**
     * Returns the decisions for a User Group pertaining to a particular Reservation.
     * @param userGroup The User Group who made the decisions.
     * @param reservation The reservation the decisions were made for.
     * @return A list of all the decisions made for the reservation by the user group.
     */
    public List<ReservationDecision> getUserGroupDecisionsByReservation(UserGroup userGroup, Reservation reservation) {
        return entityManager.createQuery("SELECT d FROM ReservationDecision d WHERE d.userGroup = :userGroup AND d.reservation = :reservation", ReservationDecision.class)
                .setParameter("userGroup", userGroup)
                .setParameter("reservation", reservation)
                .getResultList();
    }
}
