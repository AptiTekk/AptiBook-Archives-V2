/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, Input, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {User} from "../../models/user.model";
import {AuthService} from "../../core/services/auth.service";
import {NotificationService} from "../../core/services/notification.service";
import {Notification} from "../../models/notification.model";

@Component({
    selector: 'at-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})

export class HeaderComponent implements OnInit {

    @Input() disableHeaderLink: boolean = false;

    constructor() {
    }

    ngOnInit(): void {
    }

}