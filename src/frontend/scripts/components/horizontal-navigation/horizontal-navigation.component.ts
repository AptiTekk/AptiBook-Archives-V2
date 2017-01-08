/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, Input} from "@angular/core";

@Component({
    selector: 'horizontal-navigation',
    templateUrl: 'horizontal-navigation.component.html',
    styleUrls: ['horizontal-navigation.component.css']
})
export class HorizontalNavigationComponent {

    @Input() links: [{icon: string, label: string, path: string[]}];

}