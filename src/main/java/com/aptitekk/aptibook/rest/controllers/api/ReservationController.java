/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.ReservationRepository;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@APIController
public class ReservationController extends APIControllerAbstract {

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final ReservationRepository reservationRepository;

    @Autowired
    public ReservationController(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @RequestMapping(value = "/reservations", method = RequestMethod.GET)
    public ResponseEntity<?> getReservationsBetweenDates(@RequestParam("start") String start, @RequestParam("end") String end) {
        if (authService.isUserSignedIn()) {
            try {
                LocalDate startTime = LocalDate.parse(start, DATE_TIME_FORMATTER);
                LocalDate endTime = LocalDate.parse(end, DATE_TIME_FORMATTER);

                return ok(reservationRepository.findReservationsWithFilters(startTime.atStartOfDay(), endTime.atStartOfDay(), null, null));
            } catch (DateTimeParseException e) {
                return badRequest("Could not parse start or end time. Proper format: yyyy-MM-dd.");
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
                    LocalDate startTime = null;
                    LocalDate endTime = null;

                    if (start != null)
                        startTime = LocalDate.parse(start, DATE_TIME_FORMATTER);
                    if (end != null)
                        endTime = LocalDate.parse(end, DATE_TIME_FORMATTER);

                    return ok(reservationRepository.findReservationsWithFilters(startTime != null ? startTime.atStartOfDay() : null, endTime != null ? endTime.atStartOfDay() : null, user, null));
                } catch (DateTimeParseException e) {
                    return badRequest("Could not parse start or end time. Proper format: yyyy-MM-dd.");
                }
            }
            return noPermission();
        }
        return unauthorized();
    }

}
