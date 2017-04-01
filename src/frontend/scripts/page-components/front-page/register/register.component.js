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
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var registration_service_1 = require("../../../services/singleton/registration.service");
var alert_component_1 = require("../../../components/alert/alert.component");
var loader_service_1 = require("../../../services/singleton/loader.service");
var RegisterComponent = (function () {
    function RegisterComponent(formBuilder, router, activeRoute, registrationService, loaderService) {
        this.router = router;
        this.activeRoute = activeRoute;
        this.registrationService = registrationService;
        this.loaderService = loaderService;
        this.formGroup = formBuilder.group({
            emailAddress: [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.maxLength(100), forms_1.Validators.pattern("[^<>;=]*")])],
            firstName: [null, forms_1.Validators.compose([forms_1.Validators.maxLength(30), forms_1.Validators.pattern("[^<>;=]*")])],
            lastName: [null, forms_1.Validators.compose([forms_1.Validators.maxLength(30), forms_1.Validators.pattern("[^<>;=]*")])],
            password: [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.maxLength(30)])],
            confirmPassword: [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.maxLength(30)])]
        });
    }
    RegisterComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        //Check for errors in the parameters
        this.activeRoute.queryParams.subscribe(function (params) {
            if (params['registerError']) {
                if (params['registerError'] === "user_exists")
                    _this.registerAlert.display("Unfortunately, a user with this email already exists.", false);
                else if (params['registerError'] === "null_fields")
                    _this.registerAlert.display("Unfortunately, an error has occurred.", false);
            }
        });
    };
    RegisterComponent.prototype.onSubmit = function () {
        var _this = this;
        var newUser = {
            emailAddress: this.formGroup.controls['emailAddress'].value,
            firstName: this.formGroup.controls['firstName'].value,
            lastName: this.formGroup.controls['lastName'].value,
            newPassword: this.formGroup.controls['password'].value,
            verified: false
        };
        this.loaderService.startLoading();
        this.registrationService.register(newUser).subscribe(function (user) { return _this.router.navigate(['', 'register', 'success']).then(function () { return _this.loaderService.stopLoading(); }); }, function (err) {
            _this.registerAlert.display(err, true);
            _this.loaderService.stopLoading();
        });
    };
    RegisterComponent.prototype.doPasswordsMatch = function () {
        if (this.formGroup.controls['confirmPassword'].pristine)
            return true;
        return this.formGroup.controls['password'].value === this.formGroup.controls['confirmPassword'].value;
    };
    return RegisterComponent;
}());
__decorate([
    core_1.ViewChild('registerAlert'),
    __metadata("design:type", alert_component_1.AlertComponent)
], RegisterComponent.prototype, "registerAlert", void 0);
RegisterComponent = __decorate([
    core_1.Component({
        selector: 'register',
        templateUrl: 'register.component.html'
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        router_1.Router,
        router_1.ActivatedRoute,
        registration_service_1.RegistrationService,
        loader_service_1.LoaderService])
], RegisterComponent);
exports.RegisterComponent = RegisterComponent;
//# sourceMappingURL=register.component.js.map