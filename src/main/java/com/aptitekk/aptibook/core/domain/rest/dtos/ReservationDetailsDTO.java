/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.rest.dtos;


import com.aptitekk.aptibook.core.domain.entities.ReservationDecision;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class ReservationDetailsDTO {
    public ReservationDTO reservation;
    public UserGroupDTO behalfUserGroup;
    public ReservationDecisionDTO currentDecision;
    public LinkedHashMap<UserGroupDTO, ReservationDecisionDTO> hierarchyDecisions;
    public List<UserGroupDTO> hierarchyGroups;

    public Map<UserGroupDTO, ReservationDecisionDTO> overridingDecisions;

    /**
     * This list contains the User Groups with decisions that will be overridden if the behalfUserGroup chooses to approve.
     */
    public List<UserGroupDTO> lowerApprovalOverrides;

    /**
     * This list contains the User Groups with decisions that will be overridden if the behalfUserGroup chooses to reject.
     */
    public List<UserGroupDTO> lowerRejectionOverrides;
}
