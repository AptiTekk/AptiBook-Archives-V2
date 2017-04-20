/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, OnInit} from "@angular/core";
import {NavigationLink} from "../../../shared/navigation/navigation-link.model";

@Component({
    selector: 'at-user-account',
    templateUrl: 'account.component.html',
    styleUrls: ['account.component.css']
})
export class AccountComponent implements OnInit {

    /**
     * The Navigation Links used in the Info Panel.
     */
    infoNavigationLinks: NavigationLink[] = [
        {
            label: 'Reservations',
            path: ['', 'secure', 'account'],
            exact: true
        },
        {
            label: 'Notifications',
            path: ['', 'secure', 'account', 'notifications']
        }
    ];

    constructor() {
    }

    ngOnInit(): void {
    }
}