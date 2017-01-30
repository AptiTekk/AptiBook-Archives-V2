/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    QueryList,
    ViewChild
} from "@angular/core";
import {DataTableColumnComponent} from "./datatable-column/datatable-column.component";
import DataTable = DataTables.DataTable;

@Component({
    selector: 'datatable',
    templateUrl: 'datatable.component.html',
    styleUrls: ['datatable.component.css']
})
export class DataTableComponent implements AfterViewInit, AfterViewChecked {

    @Input() selectableRows: boolean;
    @Output() rowSelected: EventEmitter<number> = new EventEmitter<number>();
    @Output() rowDeselected: EventEmitter<number> = new EventEmitter<number>();
    private selectedRow: number = -1;

    @Input() responsive: boolean = true;
    @Input() bodyHeight: string;

    @ViewChild('dataTableContainer') dataTableContainer: ElementRef;
    private datatable;
    private redrawOptions: { invalidateColumns: boolean };

    @ContentChildren(DataTableColumnComponent) columns: QueryList<DataTableColumnComponent>;

    ngAfterViewInit(): void {
        // Initialize the table.
        this.initDataTable();

        // Set up Event Listeners
        this.datatable.on('select', (e, dt: DataTable, type, indexes) => {
            this.selectedRow = -1;
            if (type === 'row') {
                this.selectedRow = indexes[0];
                this.rowSelected.emit(this.selectedRow);
            }
        });

        this.datatable.on('deselect', (e, dt: DataTable, type, indexes) => {
            this.selectedRow = -1;
            if (type === 'row') {
                this.rowDeselected.emit(indexes[0]);
            }
        });

        // Schedule a re-draw of the table any time the content changes.
        this.columns.changes.subscribe(() => this.scheduleRedraw(true));

        window.onresize = () => this.datatable.columns.adjust();
    }

    ngAfterViewChecked(): void {
        // Re-draw the table if scheduled.
        if (this.redrawOptions) {

            // We must destroy the datatable to redraw any columns.
            if (this.redrawOptions.invalidateColumns) {
                this.datatable.destroy();
                this.initDataTable();
            } else { // Only need to clear data for redrawing only rows
                this.datatable.clear();
                this.datatable.rows.add(this.getRowsData());
                this.datatable.draw();
            }

            this.redrawOptions = null;

            if (this.selectedRow >= 0) {
                this.datatable.row(this.selectedRow).select();
            }

            this.datatable.columns.adjust();
        }
    }

    /**
     * Initializes the DataTable
     */
    private initDataTable() {
        this.datatable = $(this.dataTableContainer.nativeElement).DataTable(
            <any>
                {
                    order: [],
                    scrollY: this.bodyHeight,
                    scrollCollapse: true,
                    columns: this.getColumnsData(),
                    data: this.getRowsData(),
                    select: this.selectableRows ? 'single' : false,
                    responsive: this.responsive
                }
        );
    }

    /**
     * Returns the number of rows needed for this table.
     */
    private get numRowsRequired(): number {
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
    private static getCellContentFromColumnByRow(column: DataTableColumnComponent, row: number): string {
        if (column && column.cells.length > row)
            return (<HTMLElement>column.cells.toArray()[row].viewRef.element.nativeElement).innerHTML;

        return '';
    }

    /**
     * Generates and returns column data for the table, consisting of an array of column definitions.
     * @returns {{title: string, orderable: boolean, width: string}[]}
     */
    private getColumnsData(): { title: string, orderable: boolean, width: string }[] {
        return this.columns.map((column: DataTableColumnComponent) => {
            return {
                title: column.title,
                orderable: column.orderable,
                width: column.width
            }
        });
    }

    /**
     * Generates and returns row data for the table, consisting of an array of arrays of strings.
     * The contents follow this structure: [ [ "Row 1 Col 1", "Row 1 Col 2" ], [ "Row 2 Col 1", "Row 2 Col 2" ] ]
     * @returns {string[][]}
     */
    private getRowsData(): string[][] {
        let dataArray: string[][] = [];

        for (let i = 0; i < this.numRowsRequired; i++) {
            let rowData = [];
            this.columns.forEach((column: DataTableColumnComponent) => rowData.push(DataTableComponent.getCellContentFromColumnByRow(column, i)));
            dataArray.push(rowData);
        }

        return dataArray;
    }

    /**
     * Selects a row in the table by its index number.
     * @param rowIndex The index number of the row to select.
     */
    public selectRow(rowIndex: number) {
        if (this.datatable) {
            this.datatable.row(rowIndex).select();
            this.selectedRow = rowIndex;
        }
    }

    /**
     * Deselects all rows.
     */
    deselectRows() {
        if (this.datatable) {
            this.selectedRow = -1;
            this.datatable.rows().deselect();
        }
    }

    /**
     * Schedules a re-draw to be performed.
     */
    public scheduleRedraw(invalidateColumns: boolean = false) {
        this.redrawOptions = {invalidateColumns};
    }

}