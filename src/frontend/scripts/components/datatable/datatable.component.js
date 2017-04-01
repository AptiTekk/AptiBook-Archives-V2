"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
var core_1 = require("@angular/core");
var datatable_column_component_1 = require("./datatable-column/datatable-column.component");
var DataTableComponent = DataTableComponent_1 = (function () {
    function DataTableComponent() {
        this.rowSelected = new core_1.EventEmitter();
        this.rowDeselected = new core_1.EventEmitter();
        this.selectedRow = -1;
        this.responsive = true;
    }
    DataTableComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // Initialize the table.
        this.initDataTable();
        // Set up Event Listeners
        this.datatable.on('select', function (e, dt, type, indexes) {
            _this.selectedRow = -1;
            if (type === 'row') {
                _this.selectedRow = indexes[0];
                _this.rowSelected.emit(_this.selectedRow);
            }
        });
        this.datatable.on('deselect', function (e, dt, type, indexes) {
            _this.selectedRow = -1;
            if (type === 'row') {
                _this.rowDeselected.emit(indexes[0]);
            }
        });
        // Schedule a re-draw of the table any time the content changes.
        this.columns.changes.subscribe(function () { return _this.scheduleRedraw(true); });
        window.onresize = function () { return _this.datatable.columns.adjust(); };
    };
    DataTableComponent.prototype.ngAfterViewChecked = function () {
        // Re-draw the table if scheduled.
        if (this.redrawOptions) {
            // We must destroy the datatable to redraw any columns.
            if (this.redrawOptions.invalidateColumns) {
                this.datatable.destroy();
                this.initDataTable();
            }
            else {
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
    };
    /**
     * Initializes the DataTable
     */
    DataTableComponent.prototype.initDataTable = function () {
        this.datatable = $(this.dataTableContainer.nativeElement).DataTable({
            order: [],
            scrollY: this.bodyHeight,
            scrollCollapse: true,
            columns: this.getColumnsData(),
            data: this.getRowsData(),
            select: this.selectableRows ? 'single' : false,
            responsive: this.responsive
        });
    };
    Object.defineProperty(DataTableComponent.prototype, "numRowsRequired", {
        /**
         * Returns the number of rows needed for this table.
         */
        get: function () {
            var numRows = 0;
            this.columns.forEach(function (column) {
                if (column.cells.length > numRows)
                    numRows = column.cells.length;
            });
            return numRows;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the html content of the cell of the column for the current row, or an empty string if no cell exists.
     * @param column The column which contains the cells.
     * @param row The row of the cell.
     */
    DataTableComponent.getCellContentFromColumnByRow = function (column, row) {
        if (column && column.cells.length > row)
            return column.cells.toArray()[row].viewRef.element.nativeElement.innerHTML;
        return '';
    };
    /**
     * Generates and returns column data for the table, consisting of an array of column definitions.
     * @returns {{title: string, orderable: boolean, width: string}[]}
     */
    DataTableComponent.prototype.getColumnsData = function () {
        return this.columns.map(function (column) {
            return {
                title: column.title,
                orderable: column.orderable,
                width: column.width
            };
        });
    };
    /**
     * Generates and returns row data for the table, consisting of an array of arrays of strings.
     * The contents follow this structure: [ [ "Row 1 Col 1", "Row 1 Col 2" ], [ "Row 2 Col 1", "Row 2 Col 2" ] ]
     * @returns {string[][]}
     */
    DataTableComponent.prototype.getRowsData = function () {
        var dataArray = [];
        var _loop_1 = function (i) {
            var rowData = [];
            this_1.columns.forEach(function (column) { return rowData.push(DataTableComponent_1.getCellContentFromColumnByRow(column, i)); });
            dataArray.push(rowData);
        };
        var this_1 = this;
        for (var i = 0; i < this.numRowsRequired; i++) {
            _loop_1(i);
        }
        return dataArray;
    };
    /**
     * Selects a row in the table by its index number.
     * @param rowIndex The index number of the row to select.
     */
    DataTableComponent.prototype.selectRow = function (rowIndex) {
        if (this.datatable) {
            this.datatable.row(rowIndex).select();
            this.selectedRow = rowIndex;
        }
    };
    /**
     * Deselects all rows.
     */
    DataTableComponent.prototype.deselectRows = function () {
        if (this.datatable) {
            this.selectedRow = -1;
            this.datatable.rows().deselect();
        }
    };
    /**
     * Schedules a re-draw to be performed.
     */
    DataTableComponent.prototype.scheduleRedraw = function (invalidateColumns) {
        if (invalidateColumns === void 0) { invalidateColumns = false; }
        this.redrawOptions = { invalidateColumns: invalidateColumns };
    };
    return DataTableComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], DataTableComponent.prototype, "selectableRows", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], DataTableComponent.prototype, "rowSelected", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], DataTableComponent.prototype, "rowDeselected", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], DataTableComponent.prototype, "responsive", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DataTableComponent.prototype, "bodyHeight", void 0);
__decorate([
    core_1.ViewChild('dataTableContainer'),
    __metadata("design:type", core_1.ElementRef)
], DataTableComponent.prototype, "dataTableContainer", void 0);
__decorate([
    core_1.ContentChildren(datatable_column_component_1.DataTableColumnComponent),
    __metadata("design:type", core_1.QueryList)
], DataTableComponent.prototype, "columns", void 0);
DataTableComponent = DataTableComponent_1 = __decorate([
    core_1.Component({
        selector: 'datatable',
        templateUrl: 'datatable.component.html',
        styleUrls: ['datatable.component.css']
    })
], DataTableComponent);
exports.DataTableComponent = DataTableComponent;
var DataTableComponent_1;
//# sourceMappingURL=datatable.component.js.map