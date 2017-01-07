/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, ViewContainerRef, Output, EventEmitter} from "@angular/core";

@Component({
    selector: 'datatable-cell',
    template: '<ng-content></ng-content>'
})
export class DataTableCell {

    @Output() selected: EventEmitter<void> = new EventEmitter<void>();
    @Output() deselected: EventEmitter<void> = new EventEmitter<void>();

    constructor(public viewRef: ViewContainerRef) {
    }

}