/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.repositories;

import com.aptitekk.aptibook.core.domain.entities.Reservation;
import com.aptitekk.aptibook.core.domain.entities.ResourceCategory;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.annotations.EntityRepository;

import javax.persistence.TypedQuery;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@EntityRepository
public class ReservationRepository extends MultiTenantEntityRepositoryAbstract<Reservation> {

    /**
     * Retrieves reservations from the database that occur within the specified dates.
     *
     * @param start The start date.
     * @param end   The end date. Should be after the start date.
     * @return A list of reservations between the specified dates, or null if any date is null or the end date is not after the start date.
     */
    public List<Reservation> findAllBetweenDates(ZonedDateTime start, ZonedDateTime end) {
        return findAllBetweenDates(start, end, null, (ResourceCategory[]) null);
    }

    /**
     * Retrieves reservations from the database that occur within the specified dates.
     * Only reservations within the specified categories will be returned.
     *
     * @param start              The start date.
     * @param end                The end date. Should be after the start date.
     * @param resourceCategories The categories to filter by. Null if no category filtering should be performed.
     * @return A list of reservations between the specified dates, or null if any date is null or the end date is not after the start date.
     */
    public List<Reservation> findAllBetweenDates(ZonedDateTime start, ZonedDateTime end, ResourceCategory... resourceCategories) {
        return findAllBetweenDates(start, end, null, resourceCategories);
    }

    /**
     * Retrieves reservations from the database that occur within the specified dates.
     * Only reservations within the specified categories will be returned.
     *
     * @param start              The start date.
     * @param end                The end date. Should be after the start date.
     * @param user               The user to filter by. Null if no user filtering should be performed.
     * @param resourceCategories The categories to filter by. Null if no category filtering should be performed.
     * @return A list of reservations between the specified dates, or null if any date is null or the end date is not after the start date.
     */
    public List<Reservation> findAllBetweenDates(ZonedDateTime start, ZonedDateTime end, User user, ResourceCategory... resourceCategories) {
        if (start == null || end == null || start.isAfter(end))
            return null;

        if (resourceCategories != null)
            if (resourceCategories.length == 0)
                return null;

        StringBuilder queryBuilder = new StringBuilder("SELECT r FROM Reservation r JOIN r.resource a WHERE ((r.start BETWEEN ?1 AND ?2) OR (r.start < ?1 AND r.end > ?1)) AND r.tenant = ?3 ");
        HashMap<Integer, Object> parameterMap = new HashMap<>();

        if (resourceCategories != null) {
            queryBuilder.append("AND a.resourceCategory IN ?4 ");
            parameterMap.put(4, Arrays.asList(resourceCategories));
        }

        if (user != null) {
            queryBuilder.append("AND r.user = ?5 ");
            parameterMap.put(5, user);
        }

        TypedQuery<Reservation> query = entityManager
                .createQuery(queryBuilder.toString(), Reservation.class)
                .setParameter(1, start)
                .setParameter(2, end)
                .setParameter(3, getTenant());

        for (Map.Entry<Integer, Object> parameter : parameterMap.entrySet()) {
            query.setParameter(parameter.getKey(), parameter.getValue());
        }

        return query.getResultList();
    }

}
