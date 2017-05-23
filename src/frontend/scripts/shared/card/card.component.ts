/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, ContentChildren, Input, QueryList} from "@angular/core";
import {CardFooterComponent} from "./card-footer/card-footer.component";
import {CardHeaderComponent} from "./card-header/card-header.component";

@Component({
    selector: 'at-card',
    templateUrl: 'card.component.html',
    styleUrls: ['card.component.css']
})
export class CardComponent {

    @ContentChildren(CardHeaderComponent) header: QueryList<CardHeaderComponent>;
    @ContentChildren(CardFooterComponent) footer: QueryList<CardFooterComponent>;

    @Input() title: string;

}