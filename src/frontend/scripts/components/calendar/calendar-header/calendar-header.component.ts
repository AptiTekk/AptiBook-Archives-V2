/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, Input} from '@angular/core';

@Component({
    selector: 'calendar-header',
    templateUrl: 'calendar-header.component.html',
    styleUrls: ['calendar-header.component.css']
})
export class CalendarHeaderComponent {

    @Input() label: string;

}