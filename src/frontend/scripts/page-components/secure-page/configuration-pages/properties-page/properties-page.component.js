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
var properties_service_1 = require("../../../../services/singleton/properties-service");
var forms_1 = require("@angular/forms");
var alert_component_1 = require("../../../../components/alert/alert.component");
var router_1 = require("@angular/router");
var Observable_1 = require("rxjs/Observable");
var PropertiesPageComponent = (function () {
    function PropertiesPageComponent(router, activatedRoute, propertiesService, formBuilder) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.propertiesService = propertiesService;
        this.formBuilder = formBuilder;
        this.sectionLinks = [
            {
                label: 'Personalization',
                icon: 'paint-brush',
                path: ['', 'secure', 'configuration', 'properties', 'personalization']
            },
            {
                label: 'Authentication',
                icon: 'asterisk',
                path: ['', 'secure', 'configuration', 'properties', 'authentication']
            }
        ];
    }
    PropertiesPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.propertiesService.fetchProperties();
        // Gets the properties and builds a form from it.
        // This will be triggered any time fetchProperties() is called.
        this.propertiesService.getProperties().subscribe(function (properties) {
            _this.properties = properties;
            _this.buildForm();
        });
    };
    PropertiesPageComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.activatedRoute.params.subscribe(function (params) {
            var sectionPath = params['section'];
            // Ensure that the path we are on is a valid path.
            // Iterate through each section to see if a section exists with this path name.
            var pathIsValid = false;
            _this.propertySections.forEach(function (section) {
                if (section.getSectionPath() === sectionPath)
                    pathIsValid = true;
            });
            if (!pathIsValid)
                _this.router.navigate(['', 'secure', 'configuration', 'properties']);
            else
                _this.showSection(sectionPath);
            _this.propertySections.changes.subscribe(function () { return _this.showSection(sectionPath); });
        });
    };
    /**
     * Sets the specified section to visible if it is found, and the rest to invisible.
     * @param sectionPath The section to make visible.
     */
    PropertiesPageComponent.prototype.showSection = function (sectionPath) {
        this.propertySections.forEach(function (section) {
            if (section.getSectionPath() === sectionPath)
                section.setVisible(true);
            else
                section.setVisible(false);
        });
    };
    PropertiesPageComponent.prototype.buildForm = function () {
        this.formGroup = this.formBuilder.group(
        // This will turn the array of properties into an object with keys named by the property key names, and values of the properties' values.
        this.properties.reduce(function (map, property) {
            map[property.keyName] = property.propertyValue;
            return map;
        }, {}));
    };
    PropertiesPageComponent.prototype.reset = function () {
        var _this = this;
        var patches = [];
        this.properties.forEach(function (property) {
            property.propertyValue = property.defaultValue;
            patches.push(_this.propertiesService.patchProperty(property));
        });
        // Run all the patches at the same time.
        Observable_1.Observable.zip.apply(Observable_1.Observable, patches.concat([function () { return null; }])).subscribe(function (response) { return _this.propertiesService.fetchProperties(); });
        this.successAlert.display("Properties have been reset!");
    };
    PropertiesPageComponent.prototype.onSubmit = function () {
        var _this = this;
        var madeChange = false;
        var patches = [];
        for (var controlName in this.formGroup.controls) {
            if (this.formGroup.controls[controlName].dirty) {
                madeChange = true;
                var propertyPatch = {
                    propertyValue: this.formGroup.controls[controlName].value,
                    keyName: controlName
                };
                patches.push(this.propertiesService.patchProperty(propertyPatch));
            }
        }
        // Run all the patches at the same time.
        Observable_1.Observable.zip.apply(Observable_1.Observable, patches.concat([function () { return null; }])).subscribe(function (response) { return _this.propertiesService.fetchProperties(); });
        if (madeChange) {
            this.successAlert.display("Changes have been saved!");
        }
        else {
            this.warnAlert.display("No changes detected.");
        }
        madeChange = false;
    };
    return PropertiesPageComponent;
}());
__decorate([
    core_1.ViewChild('successAlert'),
    __metadata("design:type", alert_component_1.AlertComponent)
], PropertiesPageComponent.prototype, "successAlert", void 0);
__decorate([
    core_1.ViewChild('warnAlert'),
    __metadata("design:type", alert_component_1.AlertComponent)
], PropertiesPageComponent.prototype, "warnAlert", void 0);
__decorate([
    core_1.ViewChildren(core_1.forwardRef(function () { return PropertySectionComponent; })),
    __metadata("design:type", core_1.QueryList)
], PropertiesPageComponent.prototype, "propertySections", void 0);
PropertiesPageComponent = __decorate([
    core_1.Component({
        selector: 'properties-page',
        templateUrl: 'properties-page.component.html',
    }),
    __metadata("design:paramtypes", [router_1.Router,
        router_1.ActivatedRoute,
        properties_service_1.PropertiesService,
        forms_1.FormBuilder])
], PropertiesPageComponent);
exports.PropertiesPageComponent = PropertiesPageComponent;
var PropertySectionComponent = (function () {
    function PropertySectionComponent() {
        this.visible = false;
    }
    /**
     * @returns The path after the /properties/ part of the url.
     */
    PropertySectionComponent.prototype.getSectionPath = function () {
        return this.sectionPath;
    };
    PropertySectionComponent.prototype.isVisible = function () {
        return this.visible;
    };
    /**
     * Displays or hides the property section.
     * @param visible If the property section should be visible (defaults to true).
     */
    PropertySectionComponent.prototype.setVisible = function (visible) {
        if (visible === void 0) { visible = true; }
        this.visible = visible;
    };
    return PropertySectionComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], PropertySectionComponent.prototype, "sectionPath", void 0);
PropertySectionComponent = __decorate([
    core_1.Component({
        selector: 'property-section',
        template: "<ng-content *ngIf=\"visible\"></ng-content>"
    })
], PropertySectionComponent);
exports.PropertySectionComponent = PropertySectionComponent;
//# sourceMappingURL=properties-page.component.js.map