/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, ViewContainerRef} from "@angular/core";

@Component({
    selector: 'datatable-cell',
    template: '<ng-content></ng-content>'
})
export class DataTableCell {

    constructor(public viewRef: ViewContainerRef) {
    }

}