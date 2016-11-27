/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.entity;

import com.aptitekk.aptibook.core.domain.entities.Reservation;
import com.aptitekk.aptibook.core.domain.entities.Resource;
import com.aptitekk.aptibook.core.domain.repositories.ResourceRepository;
import com.aptitekk.aptibook.core.services.annotations.EntityService;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@EntityService
public class ReservationService {

    private final ResourceRepository resourceRepository;

    @Autowired
    public ReservationService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    /**
     * Finds and returns a list of resources that are available for reservation at the given times from the given ResourceCategory.
     *
     * @param startTime The reservation start time
     * @param endTime   The reservation end time
     * @return A list of available resources during the selected times.
     */
    public List<Resource> findAvailableResources(LocalDateTime startTime, LocalDateTime endTime) {
        //This list contains all the resources for the given ResourceCategory.
        List<Resource> resources = resourceRepository.findAll();
        //This list is what will be returned, it will contain all of the resources that are available for reservation.
        List<Resource> availableResources = new ArrayList<>();

        for (Resource resource : resources) {
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
        for (Reservation reservation : resource.reservations) {
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
