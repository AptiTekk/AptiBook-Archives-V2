/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, ContentChildren, QueryList} from "@angular/core";
import {AccordionItemComponent} from "./accordion-item/accordion-item.component";

@Component({
    selector: 'accordion',
    templateUrl: 'accordion.component.html'
})
export class AccordionComponent {

    /**
     * A list of all the accordion items in this accordion.
     */
    @ContentChildren(AccordionItemComponent) private accordionItems: QueryList<AccordionItemComponent>;

    /**
     * The currently activated accordion item.
     */
    private activatedItem: AccordionItemComponent;

    toggleItem(accordionItem: AccordionItemComponent): void {
        if (!accordionItem)
            return;

        // Disable the activated item if it exists.
        if (this.activatedItem)
            this.activatedItem.setActivated(false);

        // If the item to toggle was not the activated item, then we should activate it.
        if (this.activatedItem !== accordionItem) {
            accordionItem.setActivated(true);
            // Re-assign the activated item to this item.
            this.activatedItem = accordionItem;
        } else {
            // Otherwise, we toggled the activated item, so there are no more toggled items.
            this.activatedItem = null;
        }

    }

}