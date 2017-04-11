/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.*;
import com.aptitekk.aptibook.core.domain.entities.enums.Permissions;
import com.aptitekk.aptibook.core.domain.repositories.*;
import com.aptitekk.aptibook.core.domain.rest.dtos.ReservationDTO;
import com.aptitekk.aptibook.core.domain.rest.dtos.ReservationDecisionDTO;
import com.aptitekk.aptibook.core.domain.rest.dtos.ReservationWithDecisionsDTO;
import com.aptitekk.aptibook.core.services.entity.ReservationService;
import com.aptitekk.aptibook.core.services.entity.UserGroupService;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.apache.commons.lang3.time.DateUtils;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.time.LocalDateTime;
import java.time.ZoneId;
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

    @Autowired
    public ReservationController(ReservationRepository reservationRepository,
                                 UserRepository userRepository,
                                 ResourceRepository resourceRepository,
                                 ReservationService reservationService,
                                 UserGroupRepository userGroupRepository,
                                 UserGroupService userGroupService,
                                 ReservationDecisionRepository reservationDecisionRepository) {
        this.reservationRepository = reservationRepository;
        this.resourceRepository = resourceRepository;
        this.userRepository = userRepository;
        this.reservationService = reservationService;
        this.userGroupRepository = userGroupRepository;
        this.userGroupService = userGroupService;
        this.reservationDecisionRepository = reservationDecisionRepository;
    }

    @RequestMapping(value = "/reservations", method = RequestMethod.GET)
    public ResponseEntity<?> getReservationsBetweenDates(@RequestParam("start") String start, @RequestParam("end") String end) {
        try {
            Date startDate = DateUtils.parseDate(start, ACCEPTED_TIME_FORMATS);
            Date endDate = DateUtils.parseDate(end, ACCEPTED_TIME_FORMATS);
            LocalDateTime startLocalDateTime = LocalDateTime.ofInstant(startDate.toInstant(), ZoneId.systemDefault());
            LocalDateTime endLocalDateTime = LocalDateTime.ofInstant(endDate.toInstant(), ZoneId.systemDefault());
            List<Reservation> reservations = reservationRepository.findReservationsWithFilters(startLocalDateTime, endLocalDateTime, null, null);

            return ok(modelMapper.map(reservations, new TypeToken<List<ReservationDTO>>() {
            }.getType()));
        } catch (ParseException e) {
            return badRequest("Could not parse start or end time.");
        }
    }

    @RequestMapping(value = "/reservations/user/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getUserReservationsBetweenDates(@PathVariable Long id, @RequestParam(value = "start", required = false) String start, @RequestParam(value = "end", required = false) String end) {
        if (id == null)
            return badRequest("Missing ID");

        User user = authService.getCurrentUser();
        if (user.isAdmin() || user.getId().equals(id)) {
            try {
                Date startDate = null;
                Date endDate = null;

                if (start != null)
                    startDate = DateUtils.parseDate(start, ACCEPTED_TIME_FORMATS);
                if (end != null)
                    endDate = DateUtils.parseDate(end, ACCEPTED_TIME_FORMATS);

                LocalDateTime startLocalDateTime = startDate != null ? LocalDateTime.ofInstant(startDate.toInstant(), ZoneId.systemDefault()) : null;
                LocalDateTime endLocalDateTime = endDate != null ? LocalDateTime.ofInstant(endDate.toInstant(), ZoneId.systemDefault()) : null;

                return ok(modelMapper.map(reservationRepository.findReservationsWithFilters(startLocalDateTime, endLocalDateTime, user, null), new TypeToken<List<ReservationDTO>>() {
                }.getType()));
            } catch (ParseException e) {
                return badRequest("Could not parse start or end time.");
            }
        }
        return noPermission();
    }

    @RequestMapping(value = "/reservations/pending", method = RequestMethod.GET)
    public ResponseEntity<?> getPendingReservations() {

        if (authService.getCurrentUser().userGroups.size() == 0)
            return noPermission();

        List<Reservation> reservationList = reservationService.buildReservationList(Reservation.Status.PENDING);

        return ok(modelMapper.map(reservationList, new TypeToken<List<ReservationWithDecisionsDTO>>() {
        }.getType()));
    }

    @RequestMapping(value = "/reservations/approved", method = RequestMethod.GET)
    public ResponseEntity<?> getApprovedReservations() {

        if (authService.getCurrentUser().userGroups.size() == 0)
            return noPermission();

        List<Reservation> reservationList = reservationService.buildReservationList(Reservation.Status.APPROVED);

        return ok(modelMapper.map(reservationList, new TypeToken<List<ReservationWithDecisionsDTO>>() {
        }.getType()));
    }

    @RequestMapping(value = "/reservations/rejected", method = RequestMethod.GET)
    public ResponseEntity<?> getRejectedReservations() {

        if (authService.getCurrentUser().userGroups.size() == 0)
            return noPermission();

        List<Reservation> reservationList = reservationService.buildReservationList(Reservation.Status.REJECTED);

        return ok(modelMapper.map(reservationList, new TypeToken<List<ReservationWithDecisionsDTO>>() {
        }.getType()));
    }

    @RequestMapping(value = "/reservations/{id}/decision", method = RequestMethod.PATCH)
    public ResponseEntity<?> approveReservation(@PathVariable Long id, @RequestBody Boolean approved) {
        if (authService.getCurrentUser().userGroups.size() == 0)
            return noPermission();

        if (approved == null)
            return badRequest("Please send only true (for approved) or false (for rejected).");

        Reservation reservation = reservationRepository.find(id);
        if (reservation == null)
            return notFound("Reservation not found.");

        User currentUser = authService.getCurrentUser();

        UserGroup decidingFor = null;
        for (UserGroup userGroup : this.userGroupService.getHierarchyUp(reservation.resource.owner)) {
            if (currentUser.userGroups.contains(userGroup)) {
                decidingFor = userGroup;
                break;
            }
        }

        if (decidingFor == null)
            return noPermission("You are not allowed to decide upon this Reservation.");

        // Remove the existing decisions.
        List<ReservationDecision> decisionsToRemove = reservationDecisionRepository.getUserGroupDecisionsByReservation(decidingFor, reservation);
        for (ReservationDecision decision : decisionsToRemove) {
            reservationDecisionRepository.delete(decision);
        }

        // Create a new decision.
        ReservationDecision reservationDecision = new ReservationDecision();
        reservationDecision.user = authService.getCurrentUser();
        reservationDecision.approved = approved;
        reservationDecision.reservation = reservation;
        reservationDecision.userGroup = decidingFor;

        // Save the new decision.
        reservationDecision = reservationDecisionRepository.save(reservationDecision);

        // If this group is at the top of the hierarchy,
        // then we have made a final decision on the reservation.
        if (decidingFor.isRoot() || decidingFor.getParent().isRoot()) {
            //TODO: Allow for changes after the final decision has already been made?
            reservation.status = approved ? Reservation.Status.APPROVED : Reservation.Status.REJECTED;
            reservationRepository.save(reservation);
        }

        return ok(modelMapper.map(reservationDecision, new TypeToken<ReservationDecisionDTO>() {
        }.getType()));
    }

    @RequestMapping(value = "/reservations/decisions/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getPendingReservationDecisions(@PathVariable Long id) {
        if (id == null)
            return badRequest("Missing ID");

        Reservation reservation = reservationRepository.find(id);
        List<ReservationDecision> decisionList = reservationService.generateReservationDecisions(reservation);

        return ok(modelMapper.map(decisionList, new TypeToken<List<ReservationDecisionDTO>>() {
        }.getType()));
    }

    @RequestMapping(value = "/reservations/user/{id}", method = RequestMethod.POST)
    public ResponseEntity<?> makeReservation(@PathVariable Long id, @RequestBody ReservationDTO reservationDTO) {
        if (authService.getCurrentUser().getId().equals(id) || authService.doesCurrentUserHavePermission(Permissions.Descriptor.USERS_MODIFY_ALL)) {
            Reservation reservation = new Reservation();
            reservation.tenant = tenantManagementService.getTenant();
            reservation.user = userRepository.findInCurrentTenant(id);

            if (reservationDTO.title != null)
                if (!reservationDTO.title.matches("[^<>;=]*"))
                    return badRequest("The Title cannot contain these characters: < > ; =");
                else if (reservationDTO.title.length() > 100)
                    return badRequest("The Title must be 100 characters or less.");
                else
                    reservation.title = reservationDTO.title;

            Long resourceId = reservationDTO.resource.id;
            Resource resource = resourceRepository.findInCurrentTenant(resourceId);

            if (resource == null)
                return badRequest("No Resource supplied");

            if (reservationDTO.start == null || reservationDTO.end == null)
                return badRequest("No Start or End times supplied.");

            if (reservationDTO.start.isAfter(reservationDTO.end))
                return badRequest("Start time is after End time.");

            boolean available = reservationService.isResourceAvailableForReservation(resource, reservationDTO.start, reservationDTO.end);
            if (!available)
                return badRequest("Resource is not available at specified times.");

            reservation.resource = resource;
            reservation.start = reservationDTO.start;
            reservation.end = reservationDTO.end;

            if (resource.needsApproval) {
                reservation.status = Reservation.Status.PENDING;
            } else {
                reservation.status = Reservation.Status.APPROVED;
            }

            reservation = reservationRepository.save(reservation);
            return ok(modelMapper.map(reservation, new TypeToken<ReservationDTO>() {
            }.getType()));
        }
        return noPermission();
    }

}
