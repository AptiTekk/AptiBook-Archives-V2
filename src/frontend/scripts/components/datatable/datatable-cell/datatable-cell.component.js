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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
var core_1 = require("@angular/core");
var datatable_column_component_1 = require("../datatable-column/datatable-column.component");
var DataTableCell = (function () {
    function DataTableCell(column, viewRef) {
        this.column = column;
        this.viewRef = viewRef;
    }
    DataTableCell.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.children.changes.subscribe(function (changes) {
            if (_this.column)
                _this.column.scheduleRedraw();
        });
    };
    return DataTableCell;
}());
__decorate([
    core_1.ContentChildren(function () { return true; }),
    __metadata("design:type", core_1.QueryList)
], DataTableCell.prototype, "children", void 0);
DataTableCell = __decorate([
    core_1.Component({
        selector: 'datatable-cell',
        template: '<ng-content></ng-content>'
    }),
    __param(0, core_1.Inject(core_1.forwardRef(function () { return datatable_column_component_1.DataTableColumnComponent; }))),
    __metadata("design:paramtypes", [datatable_column_component_1.DataTableColumnComponent,
        core_1.ViewContainerRef])
], DataTableCell);
exports.DataTableCell = DataTableCell;
//# sourceMappingURL=datatable-cell.component.js.map