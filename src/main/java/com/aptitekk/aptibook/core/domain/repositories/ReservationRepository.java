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

import javax.annotation.Nullable;
import javax.persistence.TypedQuery;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@EntityRepository
public class ReservationRepository extends MultiTenantEntityRepositoryAbstract<Reservation> {

    /**
     * Retrieves reservations from the database as defined by the filters.
     * If a start time is specified, no reservations ending before that time will be returned.
     * If an end time is specified, no reservations starting after that time will be returned.
     * If a user is specified, only reservations belonging to that user will be returned.
     * If a resourceCategory is specified, only reservations belonging to that category will be returned.
     *
     * @param start            The start date.
     * @param end              The end date. Should be after the start date.
     * @param user             The user to filter by. Null if no user filtering should be performed.
     * @param resourceCategory The category to filter by. Null if no category filtering should be performed.
     * @return A list of reservations between the specified dates, or null if any date is null or the end date is not after the start date.
     */
    public List<Reservation> findReservationsWithFilters(@Nullable LocalDateTime start, @Nullable LocalDateTime end, @Nullable User user, @Nullable ResourceCategory resourceCategory) {

        StringBuilder queryBuilder = new StringBuilder("SELECT r FROM Reservation r JOIN r.resource re WHERE ");
        HashMap<String, Object> parameterMap = new HashMap<>();

        if (start != null && end == null) {
            queryBuilder.append("r.end >= :start AND ");
            parameterMap.put("start", start);
        } else if (start == null && end != null) {
            queryBuilder.append("r.start <= :end AND ");
            parameterMap.put("end", end);
        } else {
            queryBuilder.append("(r.end >= :start AND r.start <= :end) AND ");
            parameterMap.put("start", start);
            parameterMap.put("end", end);
        }

        if (user != null) {
            queryBuilder.append("r.user = :user AND ");
            parameterMap.put("user", user);
        }

        if (resourceCategory != null) {
            queryBuilder.append("re.resourceCategory = :resourceCategory AND ");
            parameterMap.put("resourceCategory", resourceCategory);
        }

        TypedQuery<Reservation> query = entityManager
                .createQuery(queryBuilder.append("r.tenant = :tenant").toString(), Reservation.class)
                .setParameter("tenant", getTenant());

        for (Map.Entry<String, Object> parameter : parameterMap.entrySet()) {
            query.setParameter(parameter.getKey(), parameter.getValue());
        }

        try {
            return query.getResultList();
        } catch (Exception e) {
            logService.logException(getClass(), e, "Could not get Reservations with Filters");
            return new ArrayList<>();
        }
    }

}
