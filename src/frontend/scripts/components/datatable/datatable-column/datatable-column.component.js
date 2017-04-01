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
var datatable_cell_component_1 = require("../datatable-cell/datatable-cell.component");
var datatable_component_1 = require("../datatable.component");
var DataTableColumnComponent = (function () {
    function DataTableColumnComponent(datatable) {
        this.datatable = datatable;
        this.orderable = true;
    }
    DataTableColumnComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.cells.changes.subscribe(function (cells) { return _this.datatable.scheduleRedraw(); });
    };
    DataTableColumnComponent.prototype.scheduleRedraw = function () {
        if (this.datatable)
            this.datatable.scheduleRedraw();
    };
    return DataTableColumnComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DataTableColumnComponent.prototype, "title", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], DataTableColumnComponent.prototype, "orderable", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DataTableColumnComponent.prototype, "width", void 0);
__decorate([
    core_1.ContentChildren(datatable_cell_component_1.DataTableCell),
    __metadata("design:type", core_1.QueryList)
], DataTableColumnComponent.prototype, "cells", void 0);
DataTableColumnComponent = __decorate([
    core_1.Component({
        selector: 'datatable-column',
        template: ''
    }),
    __param(0, core_1.Inject(core_1.forwardRef(function () { return datatable_component_1.DataTableComponent; }))),
    __metadata("design:paramtypes", [datatable_component_1.DataTableComponent])
], DataTableColumnComponent);
exports.DataTableColumnComponent = DataTableColumnComponent;
//# sourceMappingURL=datatable-column.component.js.map