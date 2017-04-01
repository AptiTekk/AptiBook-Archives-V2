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
var oauth_service_1 = require("../../../services/stateful/oauth.service");
var auth_service_1 = require("../../../services/singleton/auth.service");
var alert_component_1 = require("../../../components/alert/alert.component");
var forms_1 = require("@angular/forms");
var loader_service_1 = require("../../../services/singleton/loader.service");
var SignInComponent = (function () {
    function SignInComponent(formBuilder, router, activeRoute, oAuthService, authService, loaderService) {
        var _this = this;
        this.router = router;
        this.activeRoute = activeRoute;
        this.oAuthService = oAuthService;
        this.authService = authService;
        this.loaderService = loaderService;
        this.signInFormGroup = formBuilder.group({
            emailAddress: [null, forms_1.Validators.required],
            password: [null, forms_1.Validators.required]
        });
        //Get the Google Sign In URL
        this.oAuthService.getGoogleOAuthUrl().subscribe(function (url) { return _this.googleSignInUrl = url; });
    }
    SignInComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        //Check for errors in the parameters
        this.activeRoute.queryParams.subscribe(function (params) {
            if (params['googleError']) {
                if (params['googleError'] === "access_denied")
                    _this.loginDangerAlert.display("Unfortunately, Sign In with Google failed because access was denied.", false);
                else if (params['googleError'] === "inactive")
                    _this.loginDangerAlert.display("Unfortunately, Sign In with Google failed because it is not allowed.", false);
            }
            else if (params['verified'] !== undefined) {
                if (params['verified'] === "true")
                    _this.loginInfoAlert.display("Your Email Address has been verified and you may now sign in.", false);
                else if (params['verified'] === "false")
                    _this.loginDangerAlert.display("Your Email Address could not be verified.", false);
            }
        });
    };
    SignInComponent.prototype.onSubmit = function () {
        var _this = this;
        this.loaderService.startLoading();
        this.authService
            .signIn(this.signInFormGroup.controls['emailAddress'].value, this.signInFormGroup.controls['password'].value)
            .subscribe(function (user) { return _this.router.navigateByUrl("/secure").then(function () { return _this.loaderService.stopLoading(); }); }, function (err) {
            _this.loginDangerAlert.display(err, true);
            _this.loaderService.stopLoading();
        });
    };
    SignInComponent.prototype.onGoogleSignIn = function () {
        window.location.href = this.googleSignInUrl;
    };
    return SignInComponent;
}());
__decorate([
    core_1.ViewChild('loginDangerAlert'),
    __metadata("design:type", alert_component_1.AlertComponent)
], SignInComponent.prototype, "loginDangerAlert", void 0);
__decorate([
    core_1.ViewChild('loginInfoAlert'),
    __metadata("design:type", alert_component_1.AlertComponent)
], SignInComponent.prototype, "loginInfoAlert", void 0);
SignInComponent = __decorate([
    core_1.Component({
        selector: 'sign-in',
        templateUrl: 'sign-in.component.html'
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        router_1.Router,
        router_1.ActivatedRoute,
        oauth_service_1.OAuthService,
        auth_service_1.AuthService,
        loader_service_1.LoaderService])
], SignInComponent);
exports.SignInComponent = SignInComponent;
//# sourceMappingURL=sign-in.component.js.map