/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, OnInit} from "@angular/core";
import {UserGroup} from "../../../../../models/user-group.model";

@Component({
    selector: 'groups-section',
    templateUrl: 'groups-section.component.html',
    styleUrls: ['groups-section.component.css']
})
export class GroupsSectionComponent implements OnInit {

    protected selectedUserGroups: UserGroup[];

    ngOnInit(): void {
    }

    get selectedUserGroup(): UserGroup {
        if(this.selectedUserGroups)
            if(this.selectedUserGroups.length > 0)
                return this.selectedUserGroups[0];

        return null;
    }
}

