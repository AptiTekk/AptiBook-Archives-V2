/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {animate, Component, forwardRef, Host, Inject, Input, state, style, transition, trigger} from "@angular/core";
import {AccordionComponent} from "../accordion.component";

@Component({
    selector: 'accordion-item',
    templateUrl: 'accordion-item.component.html',
    styleUrls: ['accordion-item.component.css'],
    animations: [
        trigger('activated', [
            state('true', style({opacity: 1})),
            state('false', style({opacity: 0, margin: 0, height: 0})),
            transition('1 => 0', animate('200ms')),
            transition('0 => 1', animate('200ms'))
        ])
    ]
})
export class AccordionItemComponent {

    @Input() protected title: string;

    constructor(@Host() @Inject(forwardRef(() => AccordionComponent)) private accordion: AccordionComponent) {
    }

    /**
     * Whether or not this accordion is expanded.
     */
    protected activated: boolean = false;

    isActivated(): boolean {
        return this.activated;
    }

    setActivated(activated: boolean) {
        this.activated = activated;
    }

    private toggle() {
        this.accordion.toggleItem(this);
    }

}