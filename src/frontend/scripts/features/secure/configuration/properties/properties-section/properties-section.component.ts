/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, Input} from "@angular/core";
@Component({
    selector: 'property-section',
    template: `<ng-content *ngIf="visible"></ng-content>`
})
export class PropertiesSectionComponent {

    @Input() private sectionPath: string;
    protected visible: boolean = false;

    /**
     * @returns The path after the /properties/ part of the url.
     */
    public getSectionPath() {
        return this.sectionPath;
    }

    public isVisible(): boolean {
        return this.visible;
    }

    /**
     * Displays or hides the property section.
     * @param visible If the property section should be visible (defaults to true).
     */
    public setVisible(visible: boolean = true): void {
        this.visible = visible;
    }

}