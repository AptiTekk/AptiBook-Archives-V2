/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.*;
import com.aptitekk.aptibook.core.domain.repositories.ReservationDecisionRepository;
import com.aptitekk.aptibook.core.domain.repositories.ReservationRepository;
import com.aptitekk.aptibook.core.domain.repositories.ResourceRepository;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.ReservationDTO;
import com.aptitekk.aptibook.core.domain.rest.dtos.ReservationDecisionDTO;
import com.aptitekk.aptibook.core.domain.rest.dtos.ReservationDetailsDTO;
import com.aptitekk.aptibook.core.domain.rest.dtos.ResourceCategoryDTO;
import com.aptitekk.aptibook.core.services.entity.ReservationService;
import com.aptitekk.aptibook.core.services.entity.UserGroupService;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import com.sun.org.apache.regexp.internal.RE;
import org.apache.commons.lang3.time.DateUtils;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@APIController
public class ReservationController extends APIControllerAbstract {

    private final ReservationRepository reservationRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final ReservationService reservationService;
    private final UserGroupService userGroupService;
    private final ReservationDecisionRepository reservationDecisionRepository;

    @Autowired
    public ReservationController(ReservationRepository reservationRepository, UserRepository userRepository, ResourceRepository resourceRepository, ReservationService reservationService, UserGroupService userGroupService, ReservationDecisionRepository reservationDecisionRepository) {
        this.reservationRepository = reservationRepository;
        this.resourceRepository = resourceRepository;
        this.userRepository = userRepository;
        this.reservationService = reservationService;
        this.userGroupService = userGroupService;
        this.reservationDecisionRepository = reservationDecisionRepository;
    }

    @RequestMapping(value = "/reservations", method = RequestMethod.GET)
    public ResponseEntity<?> getReservationsBetweenDates(@RequestParam("start") String start, @RequestParam("end") String end) {
        if (authService.isUserSignedIn()) {
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
        return unauthorized();
    }

    @RequestMapping(value = "/reservations/user/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getUserReservationsBetweenDates(@PathVariable Long id, @RequestParam(value = "start", required = false) String start, @RequestParam(value = "end", required = false) String end) {
        if (id == null)
            return badRequest("Missing ID");

        if (authService.isUserSignedIn()) {
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
        return unauthorized();
    }
/*
    @RequestMapping(value = "/reservations/pending/details/user/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getPendingReservationDetails(@PathVariable Long id) {
        if (id == null)
            return badRequest("Missing ID");
        if (authService.isUserSignedIn()) {
            User user = authService.getCurrentUser();
            if (user.isAdmin() || user.getId().equals(id)) {
                Map<ResourceCategory, List<ReservationDetails>> reservationDetailsMap;
                reservationDetailsMap = reservationService.buildReservationList(Reservation.Status.PENDING);
                List<ReservationDetails> reservationDetails = new ArrayList<>();
                for(Map.Entry<ResourceCategory, List<ReservationDetails>> entry : reservationDetailsMap.entrySet()){
                    reservationDetails.addAll(entry.getValue());
                }
                return ok(modelMapper.map(reservationDetails,new TypeToken<List<ReservationDetailsDTO>>() {
                }.getType()));
            }
            return noPermission();
        }
        return unauthorized();
    }*/


    @RequestMapping(value = "/reservations/pending/user/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getPendingReservations(@PathVariable Long id) {
        if (id == null)
            return badRequest("Missing ID");
        if (authService.isUserSignedIn()) {
            User user = authService.getCurrentUser();
            if (user.isAdmin() || user.getId().equals(id)) {
                List<Reservation> reservationList = new ArrayList<>();
                reservationList = reservationService.buildReservationList(Reservation.Status.PENDING);
                return ok(modelMapper.map(reservationList, new TypeToken<ReservationDTO[]>() {
                }.getType()));
            }
            return noPermission();
        }
        return unauthorized();
    }

    @RequestMapping(value = "/reservations/{id}/approve", method = RequestMethod.PATCH)
    public ResponseEntity<?> approveReservation(@PathVariable Long id) {
        if (id == null)
            return badRequest("Missing Id");
        if (authService.isUserSignedIn()) {
            Reservation reservation = reservationRepository.find(id);
            ReservationDecision reservationDecision = new ReservationDecision();
            reservationDecision.setUser(authService.getCurrentUser());
            reservationDecision.setApproved(true);
            reservationDecision.setReservation(reservation);
            reservationDecision.setTenant(tenantManagementService.getTenant());
            List<UserGroup> userGroupList = new ArrayList<>();
            userGroupList.addAll(this.userGroupService.getHierarchyUp(reservation.getResource().owner));
            for (UserGroup userGroup : authService.getCurrentUser().userGroups) {
                for (UserGroup userGroup1 : userGroupList) {
                    if (userGroup == userGroup1) {
                        reservationDecision.setUserGroup(userGroup);
                    }
                }
            }
            reservationDecision = reservationDecisionRepository.save(reservationDecision);
            return ok(modelMapper.map(reservationDecision, new TypeToken<ReservationDecisionDTO>() {
            }.getType()));
        }
        return unauthorized();
    }

    @RequestMapping(value = "/reservations/{id}/reject", method = RequestMethod.PATCH)
    public ResponseEntity<?> rejectReservation(@PathVariable Long id) {
        if (id == null)
            return badRequest("Missing Id");
        if (authService.isUserSignedIn()) {
            Reservation reservation = reservationRepository.find(id);
            ReservationDecision reservationDecision = new ReservationDecision();
            reservationDecision.setUser(authService.getCurrentUser());
            reservationDecision.setApproved(false);
            reservationDecision.setReservation(reservation);
            reservationDecision.setTenant(tenantManagementService.getTenant());
            List<UserGroup> userGroupList = new ArrayList<>();
            userGroupList.addAll(this.userGroupService.getHierarchyUp(reservation.getResource().owner));
            for (UserGroup userGroup : authService.getCurrentUser().userGroups) {
                for (UserGroup userGroup1 : userGroupList) {
                    if (userGroup == userGroup1) {
                        reservationDecision.setUserGroup(userGroup);
                    }
                }
            }
            reservationDecision = reservationDecisionRepository.save(reservationDecision);
            return ok(modelMapper.map(reservationDecision, new TypeToken<ReservationDecisionDTO>() {
            }.getType()));
        }
        return unauthorized();
    }

    @RequestMapping(value = "/reservations/decisions/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getPendingReservationDecisions(@PathVariable Long id) {
        if (id == null)
            return badRequest("Missing ID");
        if (authService.isUserSignedIn()) {
            Reservation reservation = reservationRepository.find(id);
            List<ReservationDecision> decisionList = new ArrayList<>();
            decisionList = reservationService.generateReservationDecisions(reservation);
            return ok(modelMapper.map(decisionList, new TypeToken<ReservationDecisionDTO[]>() {
            }.getType()));
        }
        return unauthorized();
    }

    @RequestMapping(value = "/reservations/user/{id}", method = RequestMethod.POST)
    public ResponseEntity<?> makeReservation(@PathVariable Long id, @RequestBody ReservationDTO reservationDTO) {
        if (authService.isUserSignedIn()) {
            if (authService.getCurrentUser().getId().equals(id) || authService.doesCurrentUserHavePermission(Permission.Descriptor.USERS_MODIFY_ALL)) {
                Reservation reservation = new Reservation();
                reservation.setTenant(tenantManagementService.getTenant());
                reservation.setUser(userRepository.findInCurrentTenant(id));

                if (reservationDTO.title != null)
                    if (!reservationDTO.title.matches("[^<>;=]*"))
                        return badRequest("The Title cannot contain these characters: < > ; =");
                    else if (reservationDTO.title.length() > 100)
                        return badRequest("The Title must be 100 characters or less.");
                    else
                        reservation.setTitle(reservationDTO.title);

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

                reservation.setResource(resource);
                reservation.setStart(reservationDTO.start);
                reservation.setEnd(reservationDTO.end);

                if (resource.needsApproval) {
                    reservation.setStatus(Reservation.Status.PENDING);
                } else {
                    reservation.setStatus(Reservation.Status.APPROVED);
                }

                reservation = reservationRepository.save(reservation);
                return ok(modelMapper.map(reservation, new TypeToken<ReservationDTO>() {
                }.getType()));
            }
            return noPermission();
        }
        return unauthorized();
    }

}
