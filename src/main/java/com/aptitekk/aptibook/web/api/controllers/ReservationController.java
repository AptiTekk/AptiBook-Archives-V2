/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.controllers;

import com.aptitekk.aptibook.domain.entities.*;
import com.aptitekk.aptibook.domain.repositories.*;
import com.aptitekk.aptibook.service.entity.NotificationService;
import com.aptitekk.aptibook.service.entity.ReservationService;
import com.aptitekk.aptibook.service.entity.UserGroupService;
import com.aptitekk.aptibook.web.api.APIResponse;
import com.aptitekk.aptibook.web.api.annotations.APIController;
import com.aptitekk.aptibook.web.api.dtos.ReservationDTO;
import com.aptitekk.aptibook.web.api.dtos.ReservationDecisionDTO;
import com.aptitekk.aptibook.web.api.dtos.ReservationWithDecisionsDTO;
import org.apache.commons.lang3.time.DateUtils;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

@APIController
public class ReservationController extends APIControllerAbstract {

    private final ReservationRepository reservationRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final ReservationService reservationService;
    private final UserGroupRepository userGroupRepository;
    private final UserGroupService userGroupService;
    private final ReservationDecisionRepository reservationDecisionRepository;
    private final NotificationService notificationService;

    @Autowired
    public ReservationController(ReservationRepository reservationRepository,
                                 UserRepository userRepository,
                                 ResourceRepository resourceRepository,
                                 ReservationService reservationService,
                                 UserGroupRepository userGroupRepository,
                                 UserGroupService userGroupService,
                                 ReservationDecisionRepository reservationDecisionRepository,
                                 NotificationService notificationService) {
        this.reservationRepository = reservationRepository;
        this.resourceRepository = resourceRepository;
        this.userRepository = userRepository;
        this.reservationService = reservationService;
        this.userGroupRepository = userGroupRepository;
        this.userGroupService = userGroupService;
        this.reservationDecisionRepository = reservationDecisionRepository;
        this.notificationService = notificationService;
    }

    @RequestMapping(value = "/reservations", method = RequestMethod.GET)
    public APIResponse getReservationsBetweenDates(@RequestParam("start") String start, @RequestParam("end") String end) {
        try {
            Date startDate = DateUtils.parseDate(start, ACCEPTED_TIME_FORMATS);
            Date endDate = DateUtils.parseDate(end, ACCEPTED_TIME_FORMATS);
            LocalDateTime startLocalDateTime = LocalDateTime.ofInstant(startDate.toInstant(), ZoneId.systemDefault());
            LocalDateTime endLocalDateTime = LocalDateTime.ofInstant(endDate.toInstant(), ZoneId.systemDefault());
            List<Reservation> reservations = reservationRepository.findReservationsWithFilters(startLocalDateTime, endLocalDateTime, null, null);

            // Sort the reservations so that the earliest show up first in the list.
            reservations.sort(Comparator.comparing(Reservation::getStart));

            return APIResponse.okResponse(modelMapper.map(reservations, new TypeToken<List<ReservationDTO>>() {
            }.getType()));
        } catch (ParseException e) {
            return APIResponse.badRequestNotParsable("Could not parse start or end time.");
        }
    }

    @RequestMapping(value = "/reservations/user/{id}", method = RequestMethod.GET)
    public APIResponse getUserReservationsBetweenDates(@PathVariable Long id, @RequestParam(value = "start", required = false) String start, @RequestParam(value = "end", required = false) String end) {
        User user = authService.getCurrentUser();
        if (!user.isAdmin() && !user.getId().equals(id))
            return APIResponse.noPermission();

        try {
            Date startDate = null;
            Date endDate = null;

            if (start != null)
                startDate = DateUtils.parseDate(start, ACCEPTED_TIME_FORMATS);
            if (end != null)
                endDate = DateUtils.parseDate(end, ACCEPTED_TIME_FORMATS);

            LocalDateTime startLocalDateTime = startDate != null ? LocalDateTime.ofInstant(startDate.toInstant(), ZoneId.systemDefault()) : null;
            LocalDateTime endLocalDateTime = endDate != null ? LocalDateTime.ofInstant(endDate.toInstant(), ZoneId.systemDefault()) : null;
            List<Reservation> reservations = reservationRepository.findReservationsWithFilters(startLocalDateTime, endLocalDateTime, user, null);

            // Sort the reservations so that the earliest show up first in the list.
            reservations.sort(Comparator.comparing(Reservation::getStart));

            return APIResponse.okResponse(modelMapper.map(reservations, new TypeToken<List<ReservationDTO>>() {
            }.getType()));
        } catch (ParseException e) {
            return APIResponse.badRequestNotParsable("Could not parse start or end time.");
        }
    }

    @RequestMapping(value = "/reservations/pending", method = RequestMethod.GET)
    public APIResponse getPendingReservations() {

        if (authService.getCurrentUser().getUserGroups().size() == 0)
            return APIResponse.noPermission();

        List<Reservation> reservationList = reservationService.buildReservationList(Reservation.Status.PENDING);

        return APIResponse.okResponse(modelMapper.map(reservationList, new TypeToken<List<ReservationWithDecisionsDTO>>() {
        }.getType()));
    }

    @RequestMapping(value = "/reservations/approved", method = RequestMethod.GET)
    public APIResponse getApprovedReservations() {

        if (authService.getCurrentUser().getUserGroups().size() == 0)
            return APIResponse.noPermission();

        List<Reservation> reservationList = reservationService.buildReservationList(Reservation.Status.APPROVED);

        return APIResponse.okResponse(modelMapper.map(reservationList, new TypeToken<List<ReservationWithDecisionsDTO>>() {
        }.getType()));
    }

    @RequestMapping(value = "/reservations/rejected", method = RequestMethod.GET)
    public APIResponse getRejectedReservations() {

        if (authService.getCurrentUser().getUserGroups().size() == 0)
            return APIResponse.noPermission();

        List<Reservation> reservationList = reservationService.buildReservationList(Reservation.Status.REJECTED);

        return APIResponse.okResponse(modelMapper.map(reservationList, new TypeToken<List<ReservationWithDecisionsDTO>>() {
        }.getType()));
    }

    @RequestMapping(value = "/reservations/{id}/decision", method = RequestMethod.PATCH)
    public APIResponse approveReservation(@PathVariable Long id, @RequestBody Boolean approved) {
        if (authService.getCurrentUser().getUserGroups().size() == 0)
            return APIResponse.noPermission();

        if (approved == null)
            return APIResponse.badRequestNotParsable("Please send only true (for approved) or false (for rejected).");

        Reservation reservation = reservationRepository.find(id);
        if (reservation == null)
            return APIResponse.notFound("Reservation not found.");

        User currentUser = authService.getCurrentUser();

        UserGroup decidingFor = null;
        for (UserGroup userGroup : this.userGroupService.getHierarchyUp(reservation.getResource().getOwner())) {
            if (currentUser.getUserGroups().contains(userGroup)) {
                decidingFor = userGroup;
                break;
            }
        }

        if (decidingFor == null)
            return APIResponse.noPermission();

        // Remove the existing decisions.
        List<ReservationDecision> decisionsToRemove = reservationDecisionRepository.getUserGroupDecisionsByReservation(decidingFor, reservation);
        for (ReservationDecision decision : decisionsToRemove) {
            reservationDecisionRepository.delete(decision);
        }

        // Create a new decision.
        ReservationDecision reservationDecision = new ReservationDecision();
        reservationDecision.setUser(authService.getCurrentUser());
        reservationDecision.setApproved(approved);
        reservationDecision.setReservation(reservation);
        reservationDecision.setUserGroup(decidingFor);

        // Save the new decision.
        reservationDecision = reservationDecisionRepository.save(reservationDecision);


        // If this group is at the top of the hierarchy,
        // then we have made a final decision on the reservation.
        if (decidingFor.isRoot() || decidingFor.getParent().isRoot()) {
            //TODO: Allow for changes after the final decision has already been made?
            reservation.setStatus(approved ? Reservation.Status.APPROVED : Reservation.Status.REJECTED);
            reservationRepository.save(reservation);
            notificationService.sendReservationDecisionNotification(reservation);
        }

        return APIResponse.okResponse(modelMapper.map(reservationDecision, new TypeToken<ReservationDecisionDTO>() {
        }.getType()));
    }

    @RequestMapping(value = "/reservations/decisions/{id}", method = RequestMethod.GET)
    public APIResponse getPendingReservationDecisions(@PathVariable Long id) {
        Reservation reservation = reservationRepository.find(id);
        List<ReservationDecision> decisionList = reservationService.generateReservationDecisions(reservation);

        return APIResponse.okResponse(modelMapper.map(decisionList, new TypeToken<List<ReservationDecisionDTO>>() {
        }.getType()));
    }

    @RequestMapping(value = "/reservations/user/{id}", method = RequestMethod.POST)
    public APIResponse makeReservation(@PathVariable Long id, @RequestBody ReservationDTO reservationDTO) {
        if (!authService.getCurrentUser().getId().equals(id) && !authService.doesCurrentUserHavePermission(Permission.USERS_MODIFY_ALL))
            return APIResponse.noPermission();

        Reservation reservation = new Reservation();
        reservation.setTenant(tenantManagementService.getTenant());
        reservation.setUser(userRepository.findInCurrentTenant(id));

        if (reservationDTO.title != null)
            if (!reservationDTO.title.matches("[^<>;=]*"))
                return APIResponse.badRequestInvalidCharacters("title", INVALID_CHARACTERS);
            else if (reservationDTO.title.length() > 100)
                return APIResponse.badRequestFieldTooLong("title", 100);
            else
                reservation.setTitle(reservationDTO.title);

        Long resourceId = reservationDTO.resource.id;
        Resource resource = resourceRepository.findInCurrentTenant(resourceId);

        if (resource == null)
            return APIResponse.notFound("Resource not found.");

        if (reservationDTO.start == null)
            return APIResponse.badRequestMissingField("start");

        if (reservationDTO.end == null)
            return APIResponse.badRequestMissingField("end");

        if (reservationDTO.start.isAfter(reservationDTO.end))
            return APIResponse.badRequest("start_after_end", "The start time is after the end time.");

        boolean available = reservationService.isResourceAvailableForReservation(resource, reservationDTO.start, reservationDTO.end);
        if (!available)
            return APIResponse.forbidden("The resource is not available at the specified times.");

        reservation.setResource(resource);
        reservation.setStart(reservationDTO.start);
        reservation.setEnd(reservationDTO.end);

        if (resource.isNeedsApproval()) {
            reservation.setStatus(Reservation.Status.PENDING);
        } else {
            reservation.setStatus(Reservation.Status.APPROVED);
        }

        reservation = reservationRepository.save(reservation);
        notificationService.sendNewReservationNotifications(reservation);
        return APIResponse.okResponse(modelMapper.map(reservation, new TypeToken<ReservationDTO>() {
        }.getType()));
    }

}
