/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.service.entity;

import com.aptitekk.aptibook.domain.entities.Reservation;
import com.aptitekk.aptibook.domain.entities.ReservationDecision;
import com.aptitekk.aptibook.domain.entities.Resource;
import com.aptitekk.aptibook.domain.entities.UserGroup;
import com.aptitekk.aptibook.domain.repositories.ResourceRepository;
import com.aptitekk.aptibook.service.annotations.EntityService;
import com.aptitekk.aptibook.service.auth.AuthService;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

@EntityService
public class ReservationService {

    private final ResourceRepository resourceRepository;
    private final AuthService authService;
    private final UserGroupService userGroupService;

    @Autowired
    public ReservationService(ResourceRepository resourceRepository, AuthService authService, UserGroupService userGroupService) {
        this.resourceRepository = resourceRepository;
        this.authService = authService;
        this.userGroupService = userGroupService;
    }


    public ArrayList<Reservation> buildReservationList(Reservation.Status status) {
        ArrayList<Reservation> reservationList = new ArrayList<>();

        Queue<UserGroup> queue = new LinkedList<>();
        queue.addAll(authService.getCurrentUser().getUserGroups());

        //Traverse down the hierarchy and determine which reservations are approved.
        //Then, build details about each reservation and store it in the reservationDetailsMap.
        UserGroup currentGroup;
        while ((currentGroup = queue.poll()) != null) {
            queue.addAll(currentGroup.getChildren());

            for (Resource resource : currentGroup.getResources()) {
                for (Reservation reservation : resource.getReservations()) {
                    if (reservation.getStatus() == status) {
                        reservationList.add(reservation);
                    }
                }
            }
        }

        return reservationList;
    }



    public List<ReservationDecision> generateReservationDecisions(Reservation reservation) {
        //Traverse up the hierarchy and determine the decisions that have already been made.
        List<ReservationDecision> hierarchyDecisions = new ArrayList<>();
        List<UserGroup> hierarchyUp = userGroupService.getHierarchyUp(reservation.getResource().getOwner());

        //This for loop descends to properly order the groups for display on the page.
        for (int i = hierarchyUp.size() - 1; i >= 0; i--) {
            UserGroup userGroup = hierarchyUp.get(i);
            for (ReservationDecision decision : reservation.getDecisions()) {
                if (decision.getUserGroup().equals(userGroup)) {
                    hierarchyDecisions.add(decision);
                }
            }

        }
        return hierarchyDecisions;
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
