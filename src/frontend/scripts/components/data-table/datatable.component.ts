/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {
    Component, ViewChild, ElementRef, ContentChildren, QueryList, AfterViewInit,
    ViewContainerRef
} from "@angular/core";
import {DataTableColumn} from "./datatable-column/datatable-column.component";
import {DataTableCell} from "./datatable-cell/datatable-cell.component";

declare const $;

@Component({
    selector: 'datatable',
    templateUrl: 'datatable.component.html',
    styleUrls: ['datatable.component.css']
})
export class DataTableComponent implements AfterViewInit {

    @ViewChild('dataTableContainer') dataTableContainer: ElementRef;

    @ContentChildren(DataTableColumn) columns: QueryList<DataTableColumn>;

    /**
     * Returns an array of incrementing numbers with a length equal to the number of rows to be rendered.
     * Example: [0, 1, 2, 3] = 4 rows.
     */
    get rows(): number[] {
        let numRows: number = 0;

        this.columns.forEach(column => {
            if (column.cells.length > numRows)
                numRows = column.cells.length;
        });

        return Array.apply(null, {length: numRows}).map(Number.call, Number);
    }

    protected getCellContentFromColumnByRow(column: DataTableColumn, row: number): string {
        if (column && column.cells.length > row)
            return (<HTMLElement>column.cells.toArray()[row].viewRef.element.nativeElement).innerHTML;

        return null;
    }

    ngAfterViewInit(): void {
        $(this.dataTableContainer.nativeElement).DataTable();
    }
}