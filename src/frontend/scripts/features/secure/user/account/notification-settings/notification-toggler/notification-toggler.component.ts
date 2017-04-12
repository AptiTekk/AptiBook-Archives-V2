/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NotificationToggles} from "../../../../../../models/notification-toggles.model";

@Component({
    selector: 'at-notification-toggler',
    templateUrl: 'notification-toggler.component.html',
    styleUrls: ['notification-toggler.component.css']
})
export class NotificationTogglerComponent implements OnInit {

    /**
     * A label to show in front of the toggles.
     */
    @Input() label: string;

    /**
     * The toggles for this component instance.
     */
    @Input() notificationToggles: NotificationToggles;

    /**
     * Emitted when the user toggles any notification method.
     * Emits the modified NotificationToggles object.
     */
    @Output() toggle = new EventEmitter<NotificationToggles>();

    constructor() { }

    ngOnInit() { }

    /**
     * Called when the user toggles their email notifications.
     */
    onToggleEmail() {
        this.notificationToggles.emailEnabled = !this.notificationToggles.emailEnabled;
        this.toggle.emit(this.notificationToggles);
    }

}