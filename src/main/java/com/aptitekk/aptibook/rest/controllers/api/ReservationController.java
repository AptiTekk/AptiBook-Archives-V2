/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.Permission;
import com.aptitekk.aptibook.core.domain.entities.Reservation;
import com.aptitekk.aptibook.core.domain.entities.Resource;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.ReservationDecisionRepository;
import com.aptitekk.aptibook.core.domain.repositories.ReservationRepository;
import com.aptitekk.aptibook.core.domain.repositories.ResourceRepository;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.ReservationDTO;
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

    // @RequestMapping(value = "/reservations/pending", method = RequestMethod.GET)
    //  public ResponseEntity<?> getPendingReservations() {

/*    private void init() {
        reservations = new ArrayList<>();
        for (UserGroup userGroup : authenticationController.getAuthenticatedUser().getUserGroups()) {
            reservations.addAll(userGroupService.getHierarchyDownReservations(userGroup));
        }

        scheduleModel = new ReservationScheduleModel() {
            @Override
            public List<Reservation> getReservationsBetweenDates(ZonedDateTime start, ZonedDateTime end) {
                ArrayList<Reservation> prunedReservations = new ArrayList<>(reservations);
                Iterator<Reservation> iterator = prunedReservations.iterator();
                while (iterator.hasNext()) {
                    Reservation next = iterator.next();
                    if (next.getStatus() == Reservation.Status.REJECTED)
                        iterator.remove();
                    else if (next.getEndTime().isBefore(start) || next.getStartTime().isAfter(end))
                        iterator.remove();
                }

                return prunedReservations;
            }
        };

        helpController.setCurrentTopic(HelpController.Topic.RESERVATION_MANAGEMENT_CALENDAR);
    }*/

/*
    @RequestMapping(value = "/reservations/resourceOwner/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getResourceOwnerReservations(@PathVariable Long id,@RequestParam(value = "start", required = false) String start, @RequestParam(value = "end", required = false) String end){
        if(authService.isUserSignedIn()){
            User user = authService.getCurrentUser();
            if (user.isAdmin() || user.getId().equals(id)) {
                ArrayList<Reservation> reservations = new ArrayList<>();
                for(UserGroup userGroup : user.userGroups){
                   // reservations.addAll(us)
                    //TODO: Implement getHierarchyDownReservations
                }
            }
        }
    }*/


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
