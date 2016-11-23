/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.entity;

import com.aptitekk.aptibook.core.domain.entities.Reservation;
import com.aptitekk.aptibook.core.domain.entities.Resource;
import com.aptitekk.aptibook.core.domain.entities.ResourceCategory;
import com.aptitekk.aptibook.core.services.annotations.EntityService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@EntityService
public class ReservationService {

    /**
     * Finds and returns a list of resources that are available for reservation at the given times from the given ResourceCategory.
     *
     * @param resourceCategory The ResourceCategory that a reservation is desired to be made from
     * @param startTime        The reservation start time
     * @param endTime          The reservation end time
     * @return A list of available resources during the selected times.
     */
    public List<Resource> findAvailableResources(ResourceCategory resourceCategory, LocalDateTime startTime, LocalDateTime endTime) {
        //This list contains all the resources for the given ResourceCategory.
        List<Resource> resourcesOfType = resourceCategory.getResources();
        //This list is what will be returned, it will contain all of the resources that are available for reservation.
        List<Resource> availableResources = new ArrayList<>();

        for (Resource resource : resourcesOfType) {
            //Check for intersections of previous reservations.
            if (isResourceAvailableForReservation(resource, startTime, endTime)) {
                availableResources.add(resource);
            }
        }
        return availableResources;
    }

    /**
     * Checks if the specified resource is available for reservation during the specified times.
     *
     * @param resource  The resource to check
     * @param startTime The reservation start time
     * @param endTime   The reservation end time
     * @return true if available, false if not.
     */
    public boolean isResourceAvailableForReservation(Resource resource, LocalDateTime startTime, LocalDateTime endTime) {
        //Iterate over all reservations of the resource and check for intersections
        for (Reservation reservation : resource.getReservations()) {
            //Ignore rejected reservations.
            if (reservation.getStatus() == Reservation.Status.REJECTED)
                continue;
            //If user canceled reservation, allow resource to be reserved.
            if (reservation.getStatus() == Reservation.Status.CANCELLED)
                continue;

            //If the reservation's end time is before our start time, we're okay.
            if (reservation.getEnd().isBefore(startTime))
                continue;

            //If the reservation's start time is after our end time, we're okay.
            if (reservation.getStart().isAfter(endTime))
                continue;

            //All checks failed, there was a conflict.
            return false;
        }
        return true;
    }

}
