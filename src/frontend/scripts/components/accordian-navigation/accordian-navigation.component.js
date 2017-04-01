/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
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
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var AccordianNavigationComponent = AccordianNavigationComponent_1 = (function () {
    function AccordianNavigationComponent(router, activatedRoute) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.exactLinkMatching = false;
        /**
         * True if this menu item should automatically collapse when another menu item expands.
         * Only applicable if this menu item is not a link.
         */
        this.autoCollapse = true;
        /**
         * True if this menu item is able to be collapsed.
         * Only applicable if this menu item is not a link and has children.
         */
        this.canCollapse = true;
        /**
         * True if this menu item is currently expanded.
         * Only applicable if this menu item is not a link.
         */
        this.expanded = false;
    }
    AccordianNavigationComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.link) {
            this.router.events.subscribe(function (event) {
                if (event instanceof router_1.NavigationEnd) {
                    _this.active = _this.router.isActive(_this.router.createUrlTree(_this.link), _this.exactLinkMatching);
                    if (_this.active) {
                        _this.expand();
                    }
                }
            });
        }
    };
    AccordianNavigationComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // When the navigationQueryList is updated
        this.navigationQueryList.changes.subscribe(function (changes) {
            _this.updateChildrenArray();
        });
        this.updateChildrenArray();
    };
    AccordianNavigationComponent.prototype.updateChildrenArray = function () {
        var _this = this;
        // Remove ourselves from the children list (how annoying)
        this.children = this.navigationQueryList.filter(function (navigation) { return navigation !== _this; });
        // Assign ourselves to the parent variable of each child.
        this.children.forEach(function (navigation) {
            navigation.parent = _this;
        });
    };
    AccordianNavigationComponent.prototype.onClick = function () {
        if (this.canCollapse) {
            if (this.expanded)
                this.collapse();
            else
                this.expand();
        }
        if (this.link)
            this.router.navigate(this.link);
    };
    AccordianNavigationComponent.prototype.expand = function () {
        var _this = this;
        if (this.parent) {
            this.parent.children.forEach(function (navigation) {
                if (navigation !== _this)
                    if (navigation.autoCollapse)
                        navigation.collapse();
            });
            this.parent.expand();
        }
        this.expanded = true;
    };
    AccordianNavigationComponent.prototype.collapse = function () {
        if (this.canCollapse)
            this.expanded = false;
    };
    return AccordianNavigationComponent;
}());
__decorate([
    core_1.ContentChildren(AccordianNavigationComponent_1),
    __metadata("design:type", core_1.QueryList)
], AccordianNavigationComponent.prototype, "navigationQueryList", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], AccordianNavigationComponent.prototype, "icon", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], AccordianNavigationComponent.prototype, "label", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], AccordianNavigationComponent.prototype, "link", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], AccordianNavigationComponent.prototype, "exactLinkMatching", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], AccordianNavigationComponent.prototype, "autoCollapse", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], AccordianNavigationComponent.prototype, "canCollapse", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], AccordianNavigationComponent.prototype, "expanded", void 0);
AccordianNavigationComponent = AccordianNavigationComponent_1 = __decorate([
    core_1.Component({
        selector: 'accordian-navigation',
        templateUrl: 'accordian-navigation.component.html',
        styleUrls: ['accordian-navigation.component.css']
    }),
    __metadata("design:paramtypes", [router_1.Router,
        router_1.ActivatedRoute])
], AccordianNavigationComponent);
exports.AccordianNavigationComponent = AccordianNavigationComponent;
var AccordianNavigationComponent_1;
//# sourceMappingURL=accordian-navigation.component.js.map