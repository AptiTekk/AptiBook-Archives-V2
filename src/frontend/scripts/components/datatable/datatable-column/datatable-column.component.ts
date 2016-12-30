/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, Input, ContentChildren, QueryList, AfterViewInit, forwardRef, Inject} from "@angular/core";
import {DataTableCell} from "../datatable-cell/datatable-cell.component";
import {DataTableComponent} from "../datatable.component";

@Component({
    selector: 'datatable-column',
    template: ''
})
export class DataTableColumn implements AfterViewInit {

    @Input() title: string;
    @Input() orderable: boolean = true;
    @Input() width: string;

    @ContentChildren(DataTableCell) cells: QueryList<DataTableCell>;

    constructor(@Inject(forwardRef(() => DataTableComponent)) private datatable: DataTableComponent) {
    }

    ngAfterViewInit(): void {
        this.cells.changes.subscribe(cells => this.datatable.scheduleRedraw());
    }
}