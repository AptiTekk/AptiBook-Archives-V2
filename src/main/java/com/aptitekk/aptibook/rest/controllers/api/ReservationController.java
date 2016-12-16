/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.Reservation;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.ReservationRepository;
import com.aptitekk.aptibook.core.domain.repositories.ResourceRepository;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.ReservationDTO;
import com.aptitekk.aptibook.core.services.tenant.TenantSessionService;
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

    private final TenantSessionService tenantSessionService;
    private final ReservationRepository reservationRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    @Autowired
    public ReservationController(ReservationRepository reservationRepository, TenantSessionService tenantSessionService, UserRepository userRepository, ResourceRepository resourceRepository) {
        this.reservationRepository = reservationRepository;
        this.resourceRepository = resourceRepository;
        this.userRepository = userRepository;
        this.tenantSessionService = tenantSessionService;
    }

    @RequestMapping(value = "/makeReservation", method = RequestMethod.POST)
    public ResponseEntity<?> makeReservation(@RequestBody ReservationDTO reservationDTO) {

        if (authService.isUserSignedIn()) {
            try {
                Reservation reservation = new Reservation();
                reservation.setTenant(tenantSessionService.getTenant());
                reservation.setUser(userRepository.find(reservationDTO.user.id));
                reservation.setTitle(reservationDTO.title);
                reservation.setResource(resourceRepository.find(reservationDTO.resource.id));
                reservation.setStart(reservationDTO.start);
                reservation.setEnd(reservationDTO.end);
                if (reservationDTO.resource.needsApproval) {
                    reservation.setStatus(Reservation.Status.PENDING);
                } else {
                    reservation.setStatus(Reservation.Status.APPROVED);
                }
                reservation = reservationRepository.save(reservation);
                return ok(modelMapper.map(reservation, new TypeToken<ReservationDTO>() {
                }.getType()));
            } catch (Exception e) {
                return badRequest();
            }
        }
        return unauthorized();
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

}
