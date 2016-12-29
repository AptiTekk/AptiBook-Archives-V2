/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {
    Component,
    ViewChild,
    ElementRef,
    ContentChildren,
    QueryList,
    AfterViewInit,
    AfterViewChecked,
    Input
} from "@angular/core";
import {DataTableColumn} from "./datatable-column/datatable-column.component";

@Component({
    selector: 'datatable',
    templateUrl: 'datatable.component.html',
    styleUrls: ['datatable.component.css']
})
export class DataTableComponent implements AfterViewInit, AfterViewChecked {

    @Input() selectableRows: boolean;

    @ViewChild('dataTableContainer') dataTableContainer: ElementRef;
    private datatable;
    private redraw: boolean;

    @ContentChildren(DataTableColumn) columns: QueryList<DataTableColumn>;

    /**
     * Returns the number of rows needed for this table.
     */
    get numRows(): number {
        let numRows: number = 0;

        this.columns.forEach(column => {
            if (column.cells.length > numRows)
                numRows = column.cells.length;
        });

        return numRows;
    }

    /**
     * Returns the html content of the cell of the column for the current row, or an empty string if no cell exists.
     * @param column The column which contains the cells.
     * @param row The row of the cell.
     */
    private static getCellContentFromColumnByRow(column: DataTableColumn, row: number): string {
        if (column && column.cells.length > row)
            return (<HTMLElement>column.cells.toArray()[row].viewRef.element.nativeElement).innerHTML;

        return '';
    }

    ngAfterViewInit(): void {
        // Initialize the table.
        this.initDataTable();

        // Schedule a re-draw of the table any time the content changes.
        this.columns.changes.subscribe(columns => this.scheduleRedraw());
    }

    /**
     * Initializes the DataTable
     */
    private initDataTable() {
        this.datatable = $(this.dataTableContainer.nativeElement).DataTable(
            <any>
                {
                    columns: this.columns.map(column => {
                        return {title: column.title}
                    }),
                    data: (() => {
                        let dataArray = [];

                        for (let i = 0; i < this.numRows; i++) {
                            let rowData = [];
                            this.columns.forEach(column => rowData.push(DataTableComponent.getCellContentFromColumnByRow(column, i)));
                            dataArray.push(rowData);
                        }

                        return dataArray;
                    })(),
                    select: this.selectableRows ? 'single' : false
                }
        );
    }

    ngAfterViewChecked(): void {
        // Re-draw the table if scheduled.
        if (this.redraw) {
            this.redraw = false;
            this.datatable.destroy();
            this.initDataTable();
        }
    }

    /**
     * Schedules a re-draw to be performed.
     */
    public scheduleRedraw() {
        this.redraw = true;
    }
}