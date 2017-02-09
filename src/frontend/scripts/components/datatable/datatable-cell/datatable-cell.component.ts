/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {
    AfterViewInit,
    Component, ContentChildren, forwardRef, Inject, OnChanges, OnInit, QueryList, SimpleChange, SimpleChanges,
    ViewContainerRef
} from "@angular/core";
import {DataTableColumnComponent} from "../datatable-column/datatable-column.component";

@Component({
    selector: 'datatable-cell',
    template: '<ng-content></ng-content>'
})
export class DataTableCell implements AfterViewInit {

    @ContentChildren(() => true) children: QueryList<any>;

    constructor(@Inject(forwardRef(() => DataTableColumnComponent)) private column: DataTableColumnComponent,
                public viewRef: ViewContainerRef) {
    }

    ngAfterViewInit(): void {
        this.children.changes.subscribe(
            changes => {
                if(this.column)
                    this.column.scheduleRedraw();
            }
        )
    }

}