webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
	 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
	 * Proprietary and confidential.
	 */
	"use strict";
	var platform_browser_dynamic_1 = __webpack_require__(1);
	var app_module_1 = __webpack_require__(23);
	platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule);


/***/ },

/***/ 23:
/***/ function(module, exports, __webpack_require__) {

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
	var core_1 = __webpack_require__(3);
	var platform_browser_1 = __webpack_require__(21);
	var app_component_1 = __webpack_require__(24);
	var forms_1 = __webpack_require__(357);
	var http_1 = __webpack_require__(27);
	var components = __webpack_require__(358);
	var vendors = __webpack_require__(383);
	var services = __webpack_require__(25);
	var routes_1 = __webpack_require__(385);
	var mapImports = function (obj) { return Object.keys(obj).map(function (key) { return obj[key]; }); };
	var AppModule = (function () {
	    function AppModule() {
	    }
	    AppModule = __decorate([
	        core_1.NgModule({
	            imports: [
	                platform_browser_1.BrowserModule,
	                forms_1.FormsModule,
	                http_1.HttpModule,
	                routes_1.routes
	            ].concat(mapImports(vendors)),
	            providers: mapImports(services).slice(),
	            declarations: mapImports(components).slice(),
	            bootstrap: [app_component_1.AppComponent]
	        }), 
	        __metadata('design:paramtypes', [])
	    ], AppModule);
	    return AppModule;
	}());
	exports.AppModule = AppModule;


/***/ },

/***/ 24:
/***/ function(module, exports, __webpack_require__) {

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
	var core_1 = __webpack_require__(3);
	var services_1 = __webpack_require__(25);
	var AppComponent = (function () {
	    function AppComponent(tenantService) {
	        this.tenantService = tenantService;
	    }
	    AppComponent = __decorate([
	        core_1.Component({
	            selector: 'app',
	            template: __webpack_require__(355)
	        }), 
	        __metadata('design:paramtypes', [(typeof (_a = typeof services_1.TenantService !== 'undefined' && services_1.TenantService) === 'function' && _a) || Object])
	    ], AppComponent);
	    return AppComponent;
	    var _a;
	}());
	exports.AppComponent = AppComponent;


/***/ },

/***/ 25:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(26));
	__export(__webpack_require__(354));


/***/ },

/***/ 26:
/***/ function(module, exports, __webpack_require__) {

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
	var core_1 = __webpack_require__(3);
	var http_1 = __webpack_require__(27);
	var rxjs_1 = __webpack_require__(28);
	var APIService = (function () {
	    function APIService(http) {
	        this.http = http;
	        this.apiUrl = document.getElementsByTagName('base')[0].href + "/api/";
	        this.headers = new http_1.Headers({
	            'Content-Type': 'application/json',
	            'Accept': 'application/json'
	        });
	    }
	    APIService.convertToJson = function (response) {
	        return response.json();
	    };
	    APIService.checkForErrors = function (response) {
	        if (response.status >= 200 && response.status < 300) {
	            return response;
	        }
	        else {
	            var error = new Error(response.statusText);
	            error['response'] = response;
	            throw error;
	        }
	    };
	    APIService.removeTrailingSlash = function (path) {
	        if (path !== undefined && path.startsWith("/"))
	            path = path.substring(1);
	        return path;
	    };
	    APIService.prototype.get = function (path) {
	        var options = new http_1.RequestOptions({ headers: this.headers });
	        return this.http.get("" + this.apiUrl + APIService.removeTrailingSlash(path), options)
	            .map(APIService.checkForErrors)
	            .catch(function (e) { return rxjs_1.Observable.throw(e); })
	            .map(APIService.convertToJson);
	    };
	    APIService.prototype.post = function (path, data) {
	        var options = new http_1.RequestOptions({ headers: this.headers });
	        return this.http.post("" + this.apiUrl + APIService.removeTrailingSlash(path), data, options)
	            .map(APIService.checkForErrors)
	            .catch(function (e) { return rxjs_1.Observable.throw(e); })
	            .map(APIService.convertToJson);
	    };
	    APIService.prototype.remove = function (path) {
	        var options = new http_1.RequestOptions({ headers: this.headers });
	        return this.http.delete("" + this.apiUrl + APIService.removeTrailingSlash(path), options)
	            .map(APIService.checkForErrors)
	            .catch(function (e) { return rxjs_1.Observable.throw(e); })
	            .map(APIService.convertToJson);
	    };
	    APIService = __decorate([
	        core_1.Injectable(), 
	        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
	    ], APIService);
	    return APIService;
	    var _a;
	}());
	exports.APIService = APIService;


/***/ },

/***/ 354:
/***/ function(module, exports, __webpack_require__) {

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
	var core_1 = __webpack_require__(3);
	var api_service_1 = __webpack_require__(26);
	var rxjs_1 = __webpack_require__(28);
	var TenantService = (function () {
	    function TenantService(apiService) {
	        var _this = this;
	        this.apiService = apiService;
	        this.tenant = new rxjs_1.ReplaySubject(1);
	        apiService.get("tenant").subscribe(function (response) { return _this.tenant.next(response); }, function (err) { return _this.tenant = undefined; });
	    }
	    TenantService.prototype.getTenant = function () {
	        return this.tenant;
	    };
	    TenantService = __decorate([
	        core_1.Injectable(), 
	        __metadata('design:paramtypes', [(typeof (_a = typeof api_service_1.APIService !== 'undefined' && api_service_1.APIService) === 'function' && _a) || Object])
	    ], TenantService);
	    return TenantService;
	    var _a;
	}());
	exports.TenantService = TenantService;


/***/ },

/***/ 355:
/***/ function(module, exports, __webpack_require__) {

	
	        var result = __webpack_require__(356);
	
	        if (typeof result === "string") {
	            module.exports = result;
	        } else {
	            module.exports = result.toString();
	        }
	    

/***/ },

/***/ 356:
/***/ function(module, exports) {

	module.exports = "<!--\r\n  ~ Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved\r\n  ~ Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.\r\n  ~ Proprietary and confidential.\r\n  -->\r\n\r\n<router-outlet></router-outlet>\r\n<loader #loader></loader>\r\n";

/***/ },

/***/ 357:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @license Angular v2.1.2
	 * (c) 2010-2016 Google, Inc. https://angular.io/
	 * License: MIT
	 */
	(function (global, factory) {
	     true ? factory(exports, __webpack_require__(3), __webpack_require__(327), __webpack_require__(4), __webpack_require__(5), __webpack_require__(75)) :
	    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs/operator/toPromise', 'rxjs/Subject', 'rxjs/Observable', 'rxjs/observable/fromPromise'], factory) :
	    (factory((global.ng = global.ng || {}, global.ng.forms = global.ng.forms || {}),global.ng.core,global.Rx.Observable.prototype,global.Rx,global.Rx,global.Rx.Observable));
	}(this, function (exports,_angular_core,rxjs_operator_toPromise,rxjs_Subject,rxjs_Observable,rxjs_observable_fromPromise) { 'use strict';
	
	    function isPresent(obj) {
	        return obj != null;
	    }
	    function isBlank(obj) {
	        return obj == null;
	    }
	    // JS has NaN !== NaN
	    function looseIdentical(a, b) {
	        return a === b || typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b);
	    }
	    function isJsObject(o) {
	        return o !== null && (typeof o === 'function' || typeof o === 'object');
	    }
	    function isPrimitive(obj) {
	        return !isJsObject(obj);
	    }
	
	    /**
	     * Base class for control directives.
	     *
	     * Only used internally in the forms module.
	     *
	     * @stable
	     */
	    var AbstractControlDirective = (function () {
	        function AbstractControlDirective() {
	        }
	        Object.defineProperty(AbstractControlDirective.prototype, "control", {
	            get: function () { throw new Error('unimplemented'); },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControlDirective.prototype, "value", {
	            get: function () { return isPresent(this.control) ? this.control.value : null; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControlDirective.prototype, "valid", {
	            get: function () { return isPresent(this.control) ? this.control.valid : null; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControlDirective.prototype, "invalid", {
	            get: function () { return isPresent(this.control) ? this.control.invalid : null; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControlDirective.prototype, "pending", {
	            get: function () { return isPresent(this.control) ? this.control.pending : null; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControlDirective.prototype, "errors", {
	            get: function () {
	                return isPresent(this.control) ? this.control.errors : null;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControlDirective.prototype, "pristine", {
	            get: function () { return isPresent(this.control) ? this.control.pristine : null; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControlDirective.prototype, "dirty", {
	            get: function () { return isPresent(this.control) ? this.control.dirty : null; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControlDirective.prototype, "touched", {
	            get: function () { return isPresent(this.control) ? this.control.touched : null; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControlDirective.prototype, "untouched", {
	            get: function () { return isPresent(this.control) ? this.control.untouched : null; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControlDirective.prototype, "disabled", {
	            get: function () { return isPresent(this.control) ? this.control.disabled : null; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControlDirective.prototype, "enabled", {
	            get: function () { return isPresent(this.control) ? this.control.enabled : null; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControlDirective.prototype, "statusChanges", {
	            get: function () {
	                return isPresent(this.control) ? this.control.statusChanges : null;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControlDirective.prototype, "valueChanges", {
	            get: function () {
	                return isPresent(this.control) ? this.control.valueChanges : null;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControlDirective.prototype, "path", {
	            get: function () { return null; },
	            enumerable: true,
	            configurable: true
	        });
	        AbstractControlDirective.prototype.reset = function (value) {
	            if (value === void 0) { value = undefined; }
	            if (isPresent(this.control))
	                this.control.reset(value);
	        };
	        return AbstractControlDirective;
	    }());
	
	    /**
	     * @license
	     * Copyright Google Inc. All Rights Reserved.
	     *
	     * Use of this source code is governed by an MIT-style license that can be
	     * found in the LICENSE file at https://angular.io/license
	     */
	    var __extends$1 = (this && this.__extends) || function (d, b) {
	        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	    /**
	     * A directive that contains multiple {@link NgControl}s.
	     *
	     * Only used by the forms module.
	     *
	     * @stable
	     */
	    var ControlContainer = (function (_super) {
	        __extends$1(ControlContainer, _super);
	        function ControlContainer() {
	            _super.apply(this, arguments);
	        }
	        Object.defineProperty(ControlContainer.prototype, "formDirective", {
	            /**
	             * Get the form to which this container belongs.
	             */
	            get: function () { return null; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(ControlContainer.prototype, "path", {
	            /**
	             * Get the path to this container.
	             */
	            get: function () { return null; },
	            enumerable: true,
	            configurable: true
	        });
	        return ControlContainer;
	    }(AbstractControlDirective));
	
	    // Safari doesn't implement MapIterator.next(), which is used is Traceur's polyfill of Array.from
	    // TODO(mlaval): remove the work around once we have a working polyfill of Array.from
	    var _arrayFromMap = (function () {
	        try {
	            if ((new Map()).values().next) {
	                return function createArrayFromMap(m, getValues) {
	                    return getValues ? Array.from(m.values()) : Array.from(m.keys());
	                };
	            }
	        }
	        catch (e) {
	        }
	        return function createArrayFromMapWithForeach(m, getValues) {
	            var res = new Array(m.size), i = 0;
	            m.forEach(function (v, k) {
	                res[i] = getValues ? v : k;
	                i++;
	            });
	            return res;
	        };
	    })();
	    var MapWrapper = (function () {
	        function MapWrapper() {
	        }
	        MapWrapper.createFromStringMap = function (stringMap) {
	            var result = new Map();
	            for (var prop in stringMap) {
	                result.set(prop, stringMap[prop]);
	            }
	            return result;
	        };
	        MapWrapper.keys = function (m) { return _arrayFromMap(m, false); };
	        MapWrapper.values = function (m) { return _arrayFromMap(m, true); };
	        return MapWrapper;
	    }());
	    /**
	     * Wraps Javascript Objects
	     */
	    var StringMapWrapper = (function () {
	        function StringMapWrapper() {
	        }
	        StringMapWrapper.merge = function (m1, m2) {
	            var m = {};
	            for (var _i = 0, _a = Object.keys(m1); _i < _a.length; _i++) {
	                var k = _a[_i];
	                m[k] = m1[k];
	            }
	            for (var _b = 0, _c = Object.keys(m2); _b < _c.length; _b++) {
	                var k = _c[_b];
	                m[k] = m2[k];
	            }
	            return m;
	        };
	        StringMapWrapper.equals = function (m1, m2) {
	            var k1 = Object.keys(m1);
	            var k2 = Object.keys(m2);
	            if (k1.length != k2.length) {
	                return false;
	            }
	            for (var i = 0; i < k1.length; i++) {
	                var key = k1[i];
	                if (m1[key] !== m2[key]) {
	                    return false;
	                }
	            }
	            return true;
	        };
	        return StringMapWrapper;
	    }());
	    var ListWrapper = (function () {
	        function ListWrapper() {
	        }
	        ListWrapper.removeAll = function (list, items) {
	            for (var i = 0; i < items.length; ++i) {
	                var index = list.indexOf(items[i]);
	                list.splice(index, 1);
	            }
	        };
	        ListWrapper.remove = function (list, el) {
	            var index = list.indexOf(el);
	            if (index > -1) {
	                list.splice(index, 1);
	                return true;
	            }
	            return false;
	        };
	        ListWrapper.equals = function (a, b) {
	            if (a.length != b.length)
	                return false;
	            for (var i = 0; i < a.length; ++i) {
	                if (a[i] !== b[i])
	                    return false;
	            }
	            return true;
	        };
	        ListWrapper.maximum = function (list, predicate) {
	            if (list.length == 0) {
	                return null;
	            }
	            var solution = null;
	            var maxValue = -Infinity;
	            for (var index = 0; index < list.length; index++) {
	                var candidate = list[index];
	                if (candidate == null) {
	                    continue;
	                }
	                var candidateValue = predicate(candidate);
	                if (candidateValue > maxValue) {
	                    solution = candidate;
	                    maxValue = candidateValue;
	                }
	            }
	            return solution;
	        };
	        ListWrapper.flatten = function (list) {
	            var target = [];
	            _flattenArray(list, target);
	            return target;
	        };
	        return ListWrapper;
	    }());
	    function _flattenArray(source, target) {
	        if (isPresent(source)) {
	            for (var i = 0; i < source.length; i++) {
	                var item = source[i];
	                if (Array.isArray(item)) {
	                    _flattenArray(item, target);
	                }
	                else {
	                    target.push(item);
	                }
	            }
	        }
	        return target;
	    }
	
	    var isPromise = _angular_core.__core_private__.isPromise;
	
	    function isEmptyInputValue(value) {
	        return value == null || typeof value === 'string' && value.length === 0;
	    }
	    /**
	     * Providers for validators to be used for {@link FormControl}s in a form.
	     *
	     * Provide this using `multi: true` to add validators.
	     *
	     * ### Example
	     *
	     * {@example core/forms/ts/ng_validators/ng_validators.ts region='ng_validators'}
	     * @stable
	     */
	    var NG_VALIDATORS = new _angular_core.OpaqueToken('NgValidators');
	    /**
	     * Providers for asynchronous validators to be used for {@link FormControl}s
	     * in a form.
	     *
	     * Provide this using `multi: true` to add validators.
	     *
	     * See {@link NG_VALIDATORS} for more details.
	     *
	     * @stable
	     */
	    var NG_ASYNC_VALIDATORS = new _angular_core.OpaqueToken('NgAsyncValidators');
	    /**
	     * Provides a set of validators used by form controls.
	     *
	     * A validator is a function that processes a {@link FormControl} or collection of
	     * controls and returns a map of errors. A null map means that validation has passed.
	     *
	     * ### Example
	     *
	     * ```typescript
	     * var loginControl = new FormControl("", Validators.required)
	     * ```
	     *
	     * @stable
	     */
	    var Validators = (function () {
	        function Validators() {
	        }
	        /**
	         * Validator that requires controls to have a non-empty value.
	         */
	        Validators.required = function (control) {
	            return isEmptyInputValue(control.value) ? { 'required': true } : null;
	        };
	        /**
	         * Validator that requires controls to have a value of a minimum length.
	         */
	        Validators.minLength = function (minLength) {
	            return function (control) {
	                if (isEmptyInputValue(control.value)) {
	                    return null; // don't validate empty values to allow optional controls
	                }
	                var length = typeof control.value === 'string' ? control.value.length : 0;
	                return length < minLength ?
	                    { 'minlength': { 'requiredLength': minLength, 'actualLength': length } } :
	                    null;
	            };
	        };
	        /**
	         * Validator that requires controls to have a value of a maximum length.
	         */
	        Validators.maxLength = function (maxLength) {
	            return function (control) {
	                var length = typeof control.value === 'string' ? control.value.length : 0;
	                return length > maxLength ?
	                    { 'maxlength': { 'requiredLength': maxLength, 'actualLength': length } } :
	                    null;
	            };
	        };
	        /**
	         * Validator that requires a control to match a regex to its value.
	         */
	        Validators.pattern = function (pattern) {
	            return function (control) {
	                if (isEmptyInputValue(control.value)) {
	                    return null; // don't validate empty values to allow optional controls
	                }
	                var regex = new RegExp("^" + pattern + "$");
	                var value = control.value;
	                return regex.test(value) ?
	                    null :
	                    { 'pattern': { 'requiredPattern': "^" + pattern + "$", 'actualValue': value } };
	            };
	        };
	        /**
	         * No-op validator.
	         */
	        Validators.nullValidator = function (c) { return null; };
	        /**
	         * Compose multiple validators into a single function that returns the union
	         * of the individual error maps.
	         */
	        Validators.compose = function (validators) {
	            if (!validators)
	                return null;
	            var presentValidators = validators.filter(isPresent);
	            if (presentValidators.length == 0)
	                return null;
	            return function (control) {
	                return _mergeErrors(_executeValidators(control, presentValidators));
	            };
	        };
	        Validators.composeAsync = function (validators) {
	            if (!validators)
	                return null;
	            var presentValidators = validators.filter(isPresent);
	            if (presentValidators.length == 0)
	                return null;
	            return function (control) {
	                var promises = _executeAsyncValidators(control, presentValidators).map(_convertToPromise);
	                return Promise.all(promises).then(_mergeErrors);
	            };
	        };
	        return Validators;
	    }());
	    function _convertToPromise(obj) {
	        return isPromise(obj) ? obj : rxjs_operator_toPromise.toPromise.call(obj);
	    }
	    function _executeValidators(control, validators) {
	        return validators.map(function (v) { return v(control); });
	    }
	    function _executeAsyncValidators(control, validators) {
	        return validators.map(function (v) { return v(control); });
	    }
	    function _mergeErrors(arrayOfErrors) {
	        var res = arrayOfErrors.reduce(function (res, errors) {
	            return isPresent(errors) ? StringMapWrapper.merge(res, errors) : res;
	        }, {});
	        return Object.keys(res).length === 0 ? null : res;
	    }
	
	    /**
	     * Used to provide a {@link ControlValueAccessor} for form controls.
	     *
	     * See {@link DefaultValueAccessor} for how to implement one.
	     * @stable
	     */
	    var NG_VALUE_ACCESSOR = new _angular_core.OpaqueToken('NgValueAccessor');
	
	    var CHECKBOX_VALUE_ACCESSOR = {
	        provide: NG_VALUE_ACCESSOR,
	        useExisting: _angular_core.forwardRef(function () { return CheckboxControlValueAccessor; }),
	        multi: true
	    };
	    /**
	     * The accessor for writing a value and listening to changes on a checkbox input element.
	     *
	     *  ### Example
	     *  ```
	     *  <input type="checkbox" name="rememberLogin" ngModel>
	     *  ```
	     *
	     *  @stable
	     */
	    var CheckboxControlValueAccessor = (function () {
	        function CheckboxControlValueAccessor(_renderer, _elementRef) {
	            this._renderer = _renderer;
	            this._elementRef = _elementRef;
	            this.onChange = function (_) { };
	            this.onTouched = function () { };
	        }
	        CheckboxControlValueAccessor.prototype.writeValue = function (value) {
	            this._renderer.setElementProperty(this._elementRef.nativeElement, 'checked', value);
	        };
	        CheckboxControlValueAccessor.prototype.registerOnChange = function (fn) { this.onChange = fn; };
	        CheckboxControlValueAccessor.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
	        CheckboxControlValueAccessor.prototype.setDisabledState = function (isDisabled) {
	            this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
	        };
	        CheckboxControlValueAccessor.decorators = [
	            { type: _angular_core.Directive, args: [{
	                        selector: 'input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]',
	                        host: { '(change)': 'onChange($event.target.checked)', '(blur)': 'onTouched()' },
	                        providers: [CHECKBOX_VALUE_ACCESSOR]
	                    },] },
	        ];
	        /** @nocollapse */
	        CheckboxControlValueAccessor.ctorParameters = [
	            { type: _angular_core.Renderer, },
	            { type: _angular_core.ElementRef, },
	        ];
	        return CheckboxControlValueAccessor;
	    }());
	
	    var DEFAULT_VALUE_ACCESSOR = {
	        provide: NG_VALUE_ACCESSOR,
	        useExisting: _angular_core.forwardRef(function () { return DefaultValueAccessor; }),
	        multi: true
	    };
	    /**
	     * The default accessor for writing a value and listening to changes that is used by the
	     * {@link NgModel}, {@link FormControlDirective}, and {@link FormControlName} directives.
	     *
	     *  ### Example
	     *  ```
	     *  <input type="text" name="searchQuery" ngModel>
	     *  ```
	     *
	     *  @stable
	     */
	    var DefaultValueAccessor = (function () {
	        function DefaultValueAccessor(_renderer, _elementRef) {
	            this._renderer = _renderer;
	            this._elementRef = _elementRef;
	            this.onChange = function (_) { };
	            this.onTouched = function () { };
	        }
	        DefaultValueAccessor.prototype.writeValue = function (value) {
	            var normalizedValue = isBlank(value) ? '' : value;
	            this._renderer.setElementProperty(this._elementRef.nativeElement, 'value', normalizedValue);
	        };
	        DefaultValueAccessor.prototype.registerOnChange = function (fn) { this.onChange = fn; };
	        DefaultValueAccessor.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
	        DefaultValueAccessor.prototype.setDisabledState = function (isDisabled) {
	            this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
	        };
	        DefaultValueAccessor.decorators = [
	            { type: _angular_core.Directive, args: [{
	                        selector: 'input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]',
	                        // TODO: vsavkin replace the above selector with the one below it once
	                        // https://github.com/angular/angular/issues/3011 is implemented
	                        // selector: '[ngControl],[ngModel],[ngFormControl]',
	                        host: { '(input)': 'onChange($event.target.value)', '(blur)': 'onTouched()' },
	                        providers: [DEFAULT_VALUE_ACCESSOR]
	                    },] },
	        ];
	        /** @nocollapse */
	        DefaultValueAccessor.ctorParameters = [
	            { type: _angular_core.Renderer, },
	            { type: _angular_core.ElementRef, },
	        ];
	        return DefaultValueAccessor;
	    }());
	
	    /**
	     * @license
	     * Copyright Google Inc. All Rights Reserved.
	     *
	     * Use of this source code is governed by an MIT-style license that can be
	     * found in the LICENSE file at https://angular.io/license
	     */
	    function normalizeValidator(validator) {
	        if (validator.validate !== undefined) {
	            return function (c) { return validator.validate(c); };
	        }
	        else {
	            return validator;
	        }
	    }
	    function normalizeAsyncValidator(validator) {
	        if (validator.validate !== undefined) {
	            return function (c) { return validator.validate(c); };
	        }
	        else {
	            return validator;
	        }
	    }
	
	    var NUMBER_VALUE_ACCESSOR = {
	        provide: NG_VALUE_ACCESSOR,
	        useExisting: _angular_core.forwardRef(function () { return NumberValueAccessor; }),
	        multi: true
	    };
	    /**
	     * The accessor for writing a number value and listening to changes that is used by the
	     * {@link NgModel}, {@link FormControlDirective}, and {@link FormControlName} directives.
	     *
	     *  ### Example
	     *  ```
	     *  <input type="number" [(ngModel)]="age">
	     *  ```
	     */
	    var NumberValueAccessor = (function () {
	        function NumberValueAccessor(_renderer, _elementRef) {
	            this._renderer = _renderer;
	            this._elementRef = _elementRef;
	            this.onChange = function (_) { };
	            this.onTouched = function () { };
	        }
	        NumberValueAccessor.prototype.writeValue = function (value) {
	            // The value needs to be normalized for IE9, otherwise it is set to 'null' when null
	            var normalizedValue = isBlank(value) ? '' : value;
	            this._renderer.setElementProperty(this._elementRef.nativeElement, 'value', normalizedValue);
	        };
	        NumberValueAccessor.prototype.registerOnChange = function (fn) {
	            this.onChange = function (value) { fn(value == '' ? null : parseFloat(value)); };
	        };
	        NumberValueAccessor.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
	        NumberValueAccessor.prototype.setDisabledState = function (isDisabled) {
	            this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
	        };
	        NumberValueAccessor.decorators = [
	            { type: _angular_core.Directive, args: [{
	                        selector: 'input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]',
	                        host: {
	                            '(change)': 'onChange($event.target.value)',
	                            '(input)': 'onChange($event.target.value)',
	                            '(blur)': 'onTouched()'
	                        },
	                        providers: [NUMBER_VALUE_ACCESSOR]
	                    },] },
	        ];
	        /** @nocollapse */
	        NumberValueAccessor.ctorParameters = [
	            { type: _angular_core.Renderer, },
	            { type: _angular_core.ElementRef, },
	        ];
	        return NumberValueAccessor;
	    }());
	
	    /**
	     * @license
	     * Copyright Google Inc. All Rights Reserved.
	     *
	     * Use of this source code is governed by an MIT-style license that can be
	     * found in the LICENSE file at https://angular.io/license
	     */
	    var __extends$2 = (this && this.__extends) || function (d, b) {
	        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	    function unimplemented() {
	        throw new Error('unimplemented');
	    }
	    /**
	     * A base class that all control directive extend.
	     * It binds a {@link FormControl} object to a DOM element.
	     *
	     * Used internally by Angular forms.
	     *
	     * @stable
	     */
	    var NgControl = (function (_super) {
	        __extends$2(NgControl, _super);
	        function NgControl() {
	            _super.apply(this, arguments);
	            /** @internal */
	            this._parent = null;
	            this.name = null;
	            this.valueAccessor = null;
	            /** @internal */
	            this._rawValidators = [];
	            /** @internal */
	            this._rawAsyncValidators = [];
	        }
	        Object.defineProperty(NgControl.prototype, "validator", {
	            get: function () { return unimplemented(); },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(NgControl.prototype, "asyncValidator", {
	            get: function () { return unimplemented(); },
	            enumerable: true,
	            configurable: true
	        });
	        return NgControl;
	    }(AbstractControlDirective));
	
	    var RADIO_VALUE_ACCESSOR = {
	        provide: NG_VALUE_ACCESSOR,
	        useExisting: _angular_core.forwardRef(function () { return RadioControlValueAccessor; }),
	        multi: true
	    };
	    /**
	     * Internal class used by Angular to uncheck radio buttons with the matching name.
	     */
	    var RadioControlRegistry = (function () {
	        function RadioControlRegistry() {
	            this._accessors = [];
	        }
	        RadioControlRegistry.prototype.add = function (control, accessor) {
	            this._accessors.push([control, accessor]);
	        };
	        RadioControlRegistry.prototype.remove = function (accessor) {
	            var indexToRemove = -1;
	            for (var i = 0; i < this._accessors.length; ++i) {
	                if (this._accessors[i][1] === accessor) {
	                    indexToRemove = i;
	                }
	            }
	            this._accessors.splice(indexToRemove, 1);
	        };
	        RadioControlRegistry.prototype.select = function (accessor) {
	            var _this = this;
	            this._accessors.forEach(function (c) {
	                if (_this._isSameGroup(c, accessor) && c[1] !== accessor) {
	                    c[1].fireUncheck(accessor.value);
	                }
	            });
	        };
	        RadioControlRegistry.prototype._isSameGroup = function (controlPair, accessor) {
	            if (!controlPair[0].control)
	                return false;
	            return controlPair[0]._parent === accessor._control._parent &&
	                controlPair[1].name === accessor.name;
	        };
	        RadioControlRegistry.decorators = [
	            { type: _angular_core.Injectable },
	        ];
	        /** @nocollapse */
	        RadioControlRegistry.ctorParameters = [];
	        return RadioControlRegistry;
	    }());
	    /**
	     * @whatItDoes  Writes radio control values and listens to radio control changes.
	     *
	     * Used by {@link NgModel}, {@link FormControlDirective}, and {@link FormControlName}
	     * to keep the view synced with the {@link FormControl} model.
	     *
	     * @howToUse
	     *
	     * If you have imported the {@link FormsModule} or the {@link ReactiveFormsModule}, this
	     * value accessor will be active on any radio control that has a form directive. You do
	     * **not** need to add a special selector to activate it.
	     *
	     * ### How to use radio buttons with form directives
	     *
	     * To use radio buttons in a template-driven form, you'll want to ensure that radio buttons
	     * in the same group have the same `name` attribute.  Radio buttons with different `name`
	     * attributes do not affect each other.
	     *
	     * {@example forms/ts/radioButtons/radio_button_example.ts region='TemplateDriven'}
	     *
	     * When using radio buttons in a reactive form, radio buttons in the same group should have the
	     * same `formControlName`. You can also add a `name` attribute, but it's optional.
	     *
	     * {@example forms/ts/reactiveRadioButtons/reactive_radio_button_example.ts region='Reactive'}
	     *
	     *  * **npm package**: `@angular/forms`
	     *
	     *  @stable
	     */
	    var RadioControlValueAccessor = (function () {
	        function RadioControlValueAccessor(_renderer, _elementRef, _registry, _injector) {
	            this._renderer = _renderer;
	            this._elementRef = _elementRef;
	            this._registry = _registry;
	            this._injector = _injector;
	            this.onChange = function () { };
	            this.onTouched = function () { };
	        }
	        RadioControlValueAccessor.prototype.ngOnInit = function () {
	            this._control = this._injector.get(NgControl);
	            this._checkName();
	            this._registry.add(this._control, this);
	        };
	        RadioControlValueAccessor.prototype.ngOnDestroy = function () { this._registry.remove(this); };
	        RadioControlValueAccessor.prototype.writeValue = function (value) {
	            this._state = value === this.value;
	            this._renderer.setElementProperty(this._elementRef.nativeElement, 'checked', this._state);
	        };
	        RadioControlValueAccessor.prototype.registerOnChange = function (fn) {
	            var _this = this;
	            this._fn = fn;
	            this.onChange = function () {
	                fn(_this.value);
	                _this._registry.select(_this);
	            };
	        };
	        RadioControlValueAccessor.prototype.fireUncheck = function (value) { this.writeValue(value); };
	        RadioControlValueAccessor.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
	        RadioControlValueAccessor.prototype.setDisabledState = function (isDisabled) {
	            this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
	        };
	        RadioControlValueAccessor.prototype._checkName = function () {
	            if (this.name && this.formControlName && this.name !== this.formControlName) {
	                this._throwNameError();
	            }
	            if (!this.name && this.formControlName)
	                this.name = this.formControlName;
	        };
	        RadioControlValueAccessor.prototype._throwNameError = function () {
	            throw new Error("\n      If you define both a name and a formControlName attribute on your radio button, their values\n      must match. Ex: <input type=\"radio\" formControlName=\"food\" name=\"food\">\n    ");
	        };
	        RadioControlValueAccessor.decorators = [
	            { type: _angular_core.Directive, args: [{
	                        selector: 'input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]',
	                        host: { '(change)': 'onChange()', '(blur)': 'onTouched()' },
	                        providers: [RADIO_VALUE_ACCESSOR]
	                    },] },
	        ];
	        /** @nocollapse */
	        RadioControlValueAccessor.ctorParameters = [
	            { type: _angular_core.Renderer, },
	            { type: _angular_core.ElementRef, },
	            { type: RadioControlRegistry, },
	            { type: _angular_core.Injector, },
	        ];
	        RadioControlValueAccessor.propDecorators = {
	            'name': [{ type: _angular_core.Input },],
	            'formControlName': [{ type: _angular_core.Input },],
	            'value': [{ type: _angular_core.Input },],
	        };
	        return RadioControlValueAccessor;
	    }());
	
	    var SELECT_VALUE_ACCESSOR = {
	        provide: NG_VALUE_ACCESSOR,
	        useExisting: _angular_core.forwardRef(function () { return SelectControlValueAccessor; }),
	        multi: true
	    };
	    function _buildValueString(id, value) {
	        if (isBlank(id))
	            return "" + value;
	        if (!isPrimitive(value))
	            value = 'Object';
	        return (id + ": " + value).slice(0, 50);
	    }
	    function _extractId(valueString) {
	        return valueString.split(':')[0];
	    }
	    /**
	     * @whatItDoes Writes values and listens to changes on a select element.
	     *
	     * Used by {@link NgModel}, {@link FormControlDirective}, and {@link FormControlName}
	     * to keep the view synced with the {@link FormControl} model.
	     *
	     * @howToUse
	     *
	     * If you have imported the {@link FormsModule} or the {@link ReactiveFormsModule}, this
	     * value accessor will be active on any select control that has a form directive. You do
	     * **not** need to add a special selector to activate it.
	     *
	     * ### How to use select controls with form directives
	     *
	     * To use a select in a template-driven form, simply add an `ngModel` and a `name`
	     * attribute to the main `<select>` tag.
	     *
	     * If your option values are simple strings, you can bind to the normal `value` property
	     * on the option.  If your option values happen to be objects (and you'd like to save the
	     * selection in your form as an object), use `ngValue` instead:
	     *
	     * {@example forms/ts/selectControl/select_control_example.ts region='Component'}
	     *
	     * In reactive forms, you'll also want to add your form directive (`formControlName` or
	     * `formControl`) on the main `<select>` tag. Like in the former example, you have the
	     * choice of binding to the  `value` or `ngValue` property on the select's options.
	     *
	     * {@example forms/ts/reactiveSelectControl/reactive_select_control_example.ts region='Component'}
	     *
	     * Note: We listen to the 'change' event because 'input' events aren't fired
	     * for selects in Firefox and IE:
	     * https://bugzilla.mozilla.org/show_bug.cgi?id=1024350
	     * https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/4660045/
	     *
	     * * **npm package**: `@angular/forms`
	     *
	     * @stable
	     */
	    var SelectControlValueAccessor = (function () {
	        function SelectControlValueAccessor(_renderer, _elementRef) {
	            this._renderer = _renderer;
	            this._elementRef = _elementRef;
	            /** @internal */
	            this._optionMap = new Map();
	            /** @internal */
	            this._idCounter = 0;
	            this.onChange = function (_) { };
	            this.onTouched = function () { };
	        }
	        SelectControlValueAccessor.prototype.writeValue = function (value) {
	            this.value = value;
	            var valueString = _buildValueString(this._getOptionId(value), value);
	            this._renderer.setElementProperty(this._elementRef.nativeElement, 'value', valueString);
	        };
	        SelectControlValueAccessor.prototype.registerOnChange = function (fn) {
	            var _this = this;
	            this.onChange = function (valueString) {
	                _this.value = valueString;
	                fn(_this._getOptionValue(valueString));
	            };
	        };
	        SelectControlValueAccessor.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
	        SelectControlValueAccessor.prototype.setDisabledState = function (isDisabled) {
	            this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
	        };
	        /** @internal */
	        SelectControlValueAccessor.prototype._registerOption = function () { return (this._idCounter++).toString(); };
	        /** @internal */
	        SelectControlValueAccessor.prototype._getOptionId = function (value) {
	            for (var _i = 0, _a = MapWrapper.keys(this._optionMap); _i < _a.length; _i++) {
	                var id = _a[_i];
	                if (looseIdentical(this._optionMap.get(id), value))
	                    return id;
	            }
	            return null;
	        };
	        /** @internal */
	        SelectControlValueAccessor.prototype._getOptionValue = function (valueString) {
	            var value = this._optionMap.get(_extractId(valueString));
	            return isPresent(value) ? value : valueString;
	        };
	        SelectControlValueAccessor.decorators = [
	            { type: _angular_core.Directive, args: [{
	                        selector: 'select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]',
	                        host: { '(change)': 'onChange($event.target.value)', '(blur)': 'onTouched()' },
	                        providers: [SELECT_VALUE_ACCESSOR]
	                    },] },
	        ];
	        /** @nocollapse */
	        SelectControlValueAccessor.ctorParameters = [
	            { type: _angular_core.Renderer, },
	            { type: _angular_core.ElementRef, },
	        ];
	        return SelectControlValueAccessor;
	    }());
	    /**
	     * @whatItDoes Marks `<option>` as dynamic, so Angular can be notified when options change.
	     *
	     * @howToUse
	     *
	     * See docs for {@link SelectControlValueAccessor} for usage examples.
	     *
	     * @stable
	     */
	    var NgSelectOption = (function () {
	        function NgSelectOption(_element, _renderer, _select) {
	            this._element = _element;
	            this._renderer = _renderer;
	            this._select = _select;
	            if (isPresent(this._select))
	                this.id = this._select._registerOption();
	        }
	        Object.defineProperty(NgSelectOption.prototype, "ngValue", {
	            set: function (value) {
	                if (this._select == null)
	                    return;
	                this._select._optionMap.set(this.id, value);
	                this._setElementValue(_buildValueString(this.id, value));
	                this._select.writeValue(this._select.value);
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(NgSelectOption.prototype, "value", {
	            set: function (value) {
	                this._setElementValue(value);
	                if (isPresent(this._select))
	                    this._select.writeValue(this._select.value);
	            },
	            enumerable: true,
	            configurable: true
	        });
	        /** @internal */
	        NgSelectOption.prototype._setElementValue = function (value) {
	            this._renderer.setElementProperty(this._element.nativeElement, 'value', value);
	        };
	        NgSelectOption.prototype.ngOnDestroy = function () {
	            if (isPresent(this._select)) {
	                this._select._optionMap.delete(this.id);
	                this._select.writeValue(this._select.value);
	            }
	        };
	        NgSelectOption.decorators = [
	            { type: _angular_core.Directive, args: [{ selector: 'option' },] },
	        ];
	        /** @nocollapse */
	        NgSelectOption.ctorParameters = [
	            { type: _angular_core.ElementRef, },
	            { type: _angular_core.Renderer, },
	            { type: SelectControlValueAccessor, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Host },] },
	        ];
	        NgSelectOption.propDecorators = {
	            'ngValue': [{ type: _angular_core.Input, args: ['ngValue',] },],
	            'value': [{ type: _angular_core.Input, args: ['value',] },],
	        };
	        return NgSelectOption;
	    }());
	
	    var SELECT_MULTIPLE_VALUE_ACCESSOR = {
	        provide: NG_VALUE_ACCESSOR,
	        useExisting: _angular_core.forwardRef(function () { return SelectMultipleControlValueAccessor; }),
	        multi: true
	    };
	    function _buildValueString$1(id, value) {
	        if (isBlank(id))
	            return "" + value;
	        if (typeof value === 'string')
	            value = "'" + value + "'";
	        if (!isPrimitive(value))
	            value = 'Object';
	        return (id + ": " + value).slice(0, 50);
	    }
	    function _extractId$1(valueString) {
	        return valueString.split(':')[0];
	    }
	    /**
	     * The accessor for writing a value and listening to changes on a select element.
	     *
	     * @stable
	     */
	    var SelectMultipleControlValueAccessor = (function () {
	        function SelectMultipleControlValueAccessor(_renderer, _elementRef) {
	            this._renderer = _renderer;
	            this._elementRef = _elementRef;
	            /** @internal */
	            this._optionMap = new Map();
	            /** @internal */
	            this._idCounter = 0;
	            this.onChange = function (_) { };
	            this.onTouched = function () { };
	        }
	        SelectMultipleControlValueAccessor.prototype.writeValue = function (value) {
	            var _this = this;
	            this.value = value;
	            if (value == null)
	                return;
	            var values = value;
	            // convert values to ids
	            var ids = values.map(function (v) { return _this._getOptionId(v); });
	            this._optionMap.forEach(function (opt, o) { opt._setSelected(ids.indexOf(o.toString()) > -1); });
	        };
	        SelectMultipleControlValueAccessor.prototype.registerOnChange = function (fn) {
	            var _this = this;
	            this.onChange = function (_) {
	                var selected = [];
	                if (_.hasOwnProperty('selectedOptions')) {
	                    var options = _.selectedOptions;
	                    for (var i = 0; i < options.length; i++) {
	                        var opt = options.item(i);
	                        var val = _this._getOptionValue(opt.value);
	                        selected.push(val);
	                    }
	                }
	                else {
	                    var options = _.options;
	                    for (var i = 0; i < options.length; i++) {
	                        var opt = options.item(i);
	                        if (opt.selected) {
	                            var val = _this._getOptionValue(opt.value);
	                            selected.push(val);
	                        }
	                    }
	                }
	                fn(selected);
	            };
	        };
	        SelectMultipleControlValueAccessor.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
	        SelectMultipleControlValueAccessor.prototype.setDisabledState = function (isDisabled) {
	            this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
	        };
	        /** @internal */
	        SelectMultipleControlValueAccessor.prototype._registerOption = function (value) {
	            var id = (this._idCounter++).toString();
	            this._optionMap.set(id, value);
	            return id;
	        };
	        /** @internal */
	        SelectMultipleControlValueAccessor.prototype._getOptionId = function (value) {
	            for (var _i = 0, _a = MapWrapper.keys(this._optionMap); _i < _a.length; _i++) {
	                var id = _a[_i];
	                if (looseIdentical(this._optionMap.get(id)._value, value))
	                    return id;
	            }
	            return null;
	        };
	        /** @internal */
	        SelectMultipleControlValueAccessor.prototype._getOptionValue = function (valueString) {
	            var opt = this._optionMap.get(_extractId$1(valueString));
	            return isPresent(opt) ? opt._value : valueString;
	        };
	        SelectMultipleControlValueAccessor.decorators = [
	            { type: _angular_core.Directive, args: [{
	                        selector: 'select[multiple][formControlName],select[multiple][formControl],select[multiple][ngModel]',
	                        host: { '(change)': 'onChange($event.target)', '(blur)': 'onTouched()' },
	                        providers: [SELECT_MULTIPLE_VALUE_ACCESSOR]
	                    },] },
	        ];
	        /** @nocollapse */
	        SelectMultipleControlValueAccessor.ctorParameters = [
	            { type: _angular_core.Renderer, },
	            { type: _angular_core.ElementRef, },
	        ];
	        return SelectMultipleControlValueAccessor;
	    }());
	    /**
	     * Marks `<option>` as dynamic, so Angular can be notified when options change.
	     *
	     * ### Example
	     *
	     * ```
	     * <select multiple name="city" ngModel>
	     *   <option *ngFor="let c of cities" [value]="c"></option>
	     * </select>
	     * ```
	     */
	    var NgSelectMultipleOption = (function () {
	        function NgSelectMultipleOption(_element, _renderer, _select) {
	            this._element = _element;
	            this._renderer = _renderer;
	            this._select = _select;
	            if (isPresent(this._select)) {
	                this.id = this._select._registerOption(this);
	            }
	        }
	        Object.defineProperty(NgSelectMultipleOption.prototype, "ngValue", {
	            set: function (value) {
	                if (this._select == null)
	                    return;
	                this._value = value;
	                this._setElementValue(_buildValueString$1(this.id, value));
	                this._select.writeValue(this._select.value);
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(NgSelectMultipleOption.prototype, "value", {
	            set: function (value) {
	                if (isPresent(this._select)) {
	                    this._value = value;
	                    this._setElementValue(_buildValueString$1(this.id, value));
	                    this._select.writeValue(this._select.value);
	                }
	                else {
	                    this._setElementValue(value);
	                }
	            },
	            enumerable: true,
	            configurable: true
	        });
	        /** @internal */
	        NgSelectMultipleOption.prototype._setElementValue = function (value) {
	            this._renderer.setElementProperty(this._element.nativeElement, 'value', value);
	        };
	        /** @internal */
	        NgSelectMultipleOption.prototype._setSelected = function (selected) {
	            this._renderer.setElementProperty(this._element.nativeElement, 'selected', selected);
	        };
	        NgSelectMultipleOption.prototype.ngOnDestroy = function () {
	            if (isPresent(this._select)) {
	                this._select._optionMap.delete(this.id);
	                this._select.writeValue(this._select.value);
	            }
	        };
	        NgSelectMultipleOption.decorators = [
	            { type: _angular_core.Directive, args: [{ selector: 'option' },] },
	        ];
	        /** @nocollapse */
	        NgSelectMultipleOption.ctorParameters = [
	            { type: _angular_core.ElementRef, },
	            { type: _angular_core.Renderer, },
	            { type: SelectMultipleControlValueAccessor, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Host },] },
	        ];
	        NgSelectMultipleOption.propDecorators = {
	            'ngValue': [{ type: _angular_core.Input, args: ['ngValue',] },],
	            'value': [{ type: _angular_core.Input, args: ['value',] },],
	        };
	        return NgSelectMultipleOption;
	    }());
	
	    function controlPath(name, parent) {
	        return parent.path.concat([name]);
	    }
	    function setUpControl(control, dir) {
	        if (!control)
	            _throwError(dir, 'Cannot find control with');
	        if (!dir.valueAccessor)
	            _throwError(dir, 'No value accessor for form control with');
	        control.validator = Validators.compose([control.validator, dir.validator]);
	        control.asyncValidator = Validators.composeAsync([control.asyncValidator, dir.asyncValidator]);
	        dir.valueAccessor.writeValue(control.value);
	        // view -> model
	        dir.valueAccessor.registerOnChange(function (newValue) {
	            dir.viewToModelUpdate(newValue);
	            control.markAsDirty();
	            control.setValue(newValue, { emitModelToViewChange: false });
	        });
	        // touched
	        dir.valueAccessor.registerOnTouched(function () { return control.markAsTouched(); });
	        control.registerOnChange(function (newValue, emitModelEvent) {
	            // control -> view
	            dir.valueAccessor.writeValue(newValue);
	            // control -> ngModel
	            if (emitModelEvent)
	                dir.viewToModelUpdate(newValue);
	        });
	        if (dir.valueAccessor.setDisabledState) {
	            control.registerOnDisabledChange(function (isDisabled) { dir.valueAccessor.setDisabledState(isDisabled); });
	        }
	        // re-run validation when validator binding changes, e.g. minlength=3 -> minlength=4
	        dir._rawValidators.forEach(function (validator) {
	            if (validator.registerOnValidatorChange)
	                validator.registerOnValidatorChange(function () { return control.updateValueAndValidity(); });
	        });
	        dir._rawAsyncValidators.forEach(function (validator) {
	            if (validator.registerOnValidatorChange)
	                validator.registerOnValidatorChange(function () { return control.updateValueAndValidity(); });
	        });
	    }
	    function cleanUpControl(control, dir) {
	        dir.valueAccessor.registerOnChange(function () { return _noControlError(dir); });
	        dir.valueAccessor.registerOnTouched(function () { return _noControlError(dir); });
	        dir._rawValidators.forEach(function (validator) { return validator.registerOnValidatorChange(null); });
	        dir._rawAsyncValidators.forEach(function (validator) { return validator.registerOnValidatorChange(null); });
	        if (control)
	            control._clearChangeFns();
	    }
	    function setUpFormContainer(control, dir) {
	        if (isBlank(control))
	            _throwError(dir, 'Cannot find control with');
	        control.validator = Validators.compose([control.validator, dir.validator]);
	        control.asyncValidator = Validators.composeAsync([control.asyncValidator, dir.asyncValidator]);
	    }
	    function _noControlError(dir) {
	        return _throwError(dir, 'There is no FormControl instance attached to form control element with');
	    }
	    function _throwError(dir, message) {
	        var messageEnd;
	        if (dir.path.length > 1) {
	            messageEnd = "path: '" + dir.path.join(' -> ') + "'";
	        }
	        else if (dir.path[0]) {
	            messageEnd = "name: '" + dir.path + "'";
	        }
	        else {
	            messageEnd = 'unspecified name attribute';
	        }
	        throw new Error(message + " " + messageEnd);
	    }
	    function composeValidators(validators) {
	        return isPresent(validators) ? Validators.compose(validators.map(normalizeValidator)) : null;
	    }
	    function composeAsyncValidators(validators) {
	        return isPresent(validators) ? Validators.composeAsync(validators.map(normalizeAsyncValidator)) :
	            null;
	    }
	    function isPropertyUpdated(changes, viewModel) {
	        if (!changes.hasOwnProperty('model'))
	            return false;
	        var change = changes['model'];
	        if (change.isFirstChange())
	            return true;
	        return !looseIdentical(viewModel, change.currentValue);
	    }
	    var BUILTIN_ACCESSORS = [
	        CheckboxControlValueAccessor,
	        NumberValueAccessor,
	        SelectControlValueAccessor,
	        SelectMultipleControlValueAccessor,
	        RadioControlValueAccessor,
	    ];
	    function isBuiltInAccessor(valueAccessor) {
	        return BUILTIN_ACCESSORS.some(function (a) { return valueAccessor.constructor === a; });
	    }
	    // TODO: vsavkin remove it once https://github.com/angular/angular/issues/3011 is implemented
	    function selectValueAccessor(dir, valueAccessors) {
	        if (!valueAccessors)
	            return null;
	        var defaultAccessor;
	        var builtinAccessor;
	        var customAccessor;
	        valueAccessors.forEach(function (v) {
	            if (v.constructor === DefaultValueAccessor) {
	                defaultAccessor = v;
	            }
	            else if (isBuiltInAccessor(v)) {
	                if (builtinAccessor)
	                    _throwError(dir, 'More than one built-in value accessor matches form control with');
	                builtinAccessor = v;
	            }
	            else {
	                if (customAccessor)
	                    _throwError(dir, 'More than one custom value accessor matches form control with');
	                customAccessor = v;
	            }
	        });
	        if (customAccessor)
	            return customAccessor;
	        if (builtinAccessor)
	            return builtinAccessor;
	        if (defaultAccessor)
	            return defaultAccessor;
	        _throwError(dir, 'No valid value accessor for form control with');
	        return null;
	    }
	
	    /**
	     * @license
	     * Copyright Google Inc. All Rights Reserved.
	     *
	     * Use of this source code is governed by an MIT-style license that can be
	     * found in the LICENSE file at https://angular.io/license
	     */
	    var __extends = (this && this.__extends) || function (d, b) {
	        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	    /**
	     * This is a base class for code shared between {@link NgModelGroup} and {@link FormGroupName}.
	     *
	     * @stable
	     */
	    var AbstractFormGroupDirective = (function (_super) {
	        __extends(AbstractFormGroupDirective, _super);
	        function AbstractFormGroupDirective() {
	            _super.apply(this, arguments);
	        }
	        AbstractFormGroupDirective.prototype.ngOnInit = function () {
	            this._checkParentType();
	            this.formDirective.addFormGroup(this);
	        };
	        AbstractFormGroupDirective.prototype.ngOnDestroy = function () {
	            if (this.formDirective) {
	                this.formDirective.removeFormGroup(this);
	            }
	        };
	        Object.defineProperty(AbstractFormGroupDirective.prototype, "control", {
	            /**
	             * Get the {@link FormGroup} backing this binding.
	             */
	            get: function () { return this.formDirective.getFormGroup(this); },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractFormGroupDirective.prototype, "path", {
	            /**
	             * Get the path to this control group.
	             */
	            get: function () { return controlPath(this.name, this._parent); },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractFormGroupDirective.prototype, "formDirective", {
	            /**
	             * Get the {@link Form} to which this group belongs.
	             */
	            get: function () { return this._parent ? this._parent.formDirective : null; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractFormGroupDirective.prototype, "validator", {
	            get: function () { return composeValidators(this._validators); },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractFormGroupDirective.prototype, "asyncValidator", {
	            get: function () { return composeAsyncValidators(this._asyncValidators); },
	            enumerable: true,
	            configurable: true
	        });
	        /** @internal */
	        AbstractFormGroupDirective.prototype._checkParentType = function () { };
	        return AbstractFormGroupDirective;
	    }(ControlContainer));
	
	    /**
	     * @license
	     * Copyright Google Inc. All Rights Reserved.
	     *
	     * Use of this source code is governed by an MIT-style license that can be
	     * found in the LICENSE file at https://angular.io/license
	     */
	    var __extends$3 = (this && this.__extends) || function (d, b) {
	        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	    var AbstractControlStatus = (function () {
	        function AbstractControlStatus(cd) {
	            this._cd = cd;
	        }
	        Object.defineProperty(AbstractControlStatus.prototype, "ngClassUntouched", {
	            get: function () {
	                return isPresent(this._cd.control) ? this._cd.control.untouched : false;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControlStatus.prototype, "ngClassTouched", {
	            get: function () {
	                return isPresent(this._cd.control) ? this._cd.control.touched : false;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControlStatus.prototype, "ngClassPristine", {
	            get: function () {
	                return isPresent(this._cd.control) ? this._cd.control.pristine : false;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControlStatus.prototype, "ngClassDirty", {
	            get: function () {
	                return isPresent(this._cd.control) ? this._cd.control.dirty : false;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControlStatus.prototype, "ngClassValid", {
	            get: function () {
	                return isPresent(this._cd.control) ? this._cd.control.valid : false;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControlStatus.prototype, "ngClassInvalid", {
	            get: function () {
	                return isPresent(this._cd.control) ? this._cd.control.invalid : false;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        return AbstractControlStatus;
	    }());
	    var ngControlStatusHost = {
	        '[class.ng-untouched]': 'ngClassUntouched',
	        '[class.ng-touched]': 'ngClassTouched',
	        '[class.ng-pristine]': 'ngClassPristine',
	        '[class.ng-dirty]': 'ngClassDirty',
	        '[class.ng-valid]': 'ngClassValid',
	        '[class.ng-invalid]': 'ngClassInvalid'
	    };
	    /**
	     * Directive automatically applied to Angular form controls that sets CSS classes
	     * based on control status (valid/invalid/dirty/etc).
	     *
	     * @stable
	     */
	    var NgControlStatus = (function (_super) {
	        __extends$3(NgControlStatus, _super);
	        function NgControlStatus(cd) {
	            _super.call(this, cd);
	        }
	        NgControlStatus.decorators = [
	            { type: _angular_core.Directive, args: [{ selector: '[formControlName],[ngModel],[formControl]', host: ngControlStatusHost },] },
	        ];
	        /** @nocollapse */
	        NgControlStatus.ctorParameters = [
	            { type: NgControl, decorators: [{ type: _angular_core.Self },] },
	        ];
	        return NgControlStatus;
	    }(AbstractControlStatus));
	    /**
	     * Directive automatically applied to Angular form groups that sets CSS classes
	     * based on control status (valid/invalid/dirty/etc).
	     *
	     * @stable
	     */
	    var NgControlStatusGroup = (function (_super) {
	        __extends$3(NgControlStatusGroup, _super);
	        function NgControlStatusGroup(cd) {
	            _super.call(this, cd);
	        }
	        NgControlStatusGroup.decorators = [
	            { type: _angular_core.Directive, args: [{
	                        selector: '[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]',
	                        host: ngControlStatusHost
	                    },] },
	        ];
	        /** @nocollapse */
	        NgControlStatusGroup.ctorParameters = [
	            { type: ControlContainer, decorators: [{ type: _angular_core.Self },] },
	        ];
	        return NgControlStatusGroup;
	    }(AbstractControlStatus));
	
	    /**
	     * @license
	     * Copyright Google Inc. All Rights Reserved.
	     *
	     * Use of this source code is governed by an MIT-style license that can be
	     * found in the LICENSE file at https://angular.io/license
	     */
	    var __extends$5 = (this && this.__extends) || function (d, b) {
	        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	    /**
	     * Use by directives and components to emit custom Events.
	     *
	     * ### Examples
	     *
	     * In the following example, `Zippy` alternatively emits `open` and `close` events when its
	     * title gets clicked:
	     *
	     * ```
	     * @Component({
	     *   selector: 'zippy',
	     *   template: `
	     *   <div class="zippy">
	     *     <div (click)="toggle()">Toggle</div>
	     *     <div [hidden]="!visible">
	     *       <ng-content></ng-content>
	     *     </div>
	     *  </div>`})
	     * export class Zippy {
	     *   visible: boolean = true;
	     *   @Output() open: EventEmitter<any> = new EventEmitter();
	     *   @Output() close: EventEmitter<any> = new EventEmitter();
	     *
	     *   toggle() {
	     *     this.visible = !this.visible;
	     *     if (this.visible) {
	     *       this.open.emit(null);
	     *     } else {
	     *       this.close.emit(null);
	     *     }
	     *   }
	     * }
	     * ```
	     *
	     * The events payload can be accessed by the parameter `$event` on the components output event
	     * handler:
	     *
	     * ```
	     * <zippy (open)="onOpen($event)" (close)="onClose($event)"></zippy>
	     * ```
	     *
	     * Uses Rx.Observable but provides an adapter to make it work as specified here:
	     * https://github.com/jhusain/observable-spec
	     *
	     * Once a reference implementation of the spec is available, switch to it.
	     * @stable
	     */
	    var EventEmitter = (function (_super) {
	        __extends$5(EventEmitter, _super);
	        /**
	         * Creates an instance of [EventEmitter], which depending on [isAsync],
	         * delivers events synchronously or asynchronously.
	         */
	        function EventEmitter(isAsync) {
	            if (isAsync === void 0) { isAsync = false; }
	            _super.call(this);
	            this.__isAsync = isAsync;
	        }
	        EventEmitter.prototype.emit = function (value) { _super.prototype.next.call(this, value); };
	        EventEmitter.prototype.subscribe = function (generatorOrNext, error, complete) {
	            var schedulerFn;
	            var errorFn = function (err) { return null; };
	            var completeFn = function () { return null; };
	            if (generatorOrNext && typeof generatorOrNext === 'object') {
	                schedulerFn = this.__isAsync ? function (value) {
	                    setTimeout(function () { return generatorOrNext.next(value); });
	                } : function (value) { generatorOrNext.next(value); };
	                if (generatorOrNext.error) {
	                    errorFn = this.__isAsync ? function (err) { setTimeout(function () { return generatorOrNext.error(err); }); } :
	                        function (err) { generatorOrNext.error(err); };
	                }
	                if (generatorOrNext.complete) {
	                    completeFn = this.__isAsync ? function () { setTimeout(function () { return generatorOrNext.complete(); }); } :
	                        function () { generatorOrNext.complete(); };
	                }
	            }
	            else {
	                schedulerFn = this.__isAsync ? function (value) { setTimeout(function () { return generatorOrNext(value); }); } :
	                    function (value) { generatorOrNext(value); };
	                if (error) {
	                    errorFn =
	                        this.__isAsync ? function (err) { setTimeout(function () { return error(err); }); } : function (err) { error(err); };
	                }
	                if (complete) {
	                    completeFn =
	                        this.__isAsync ? function () { setTimeout(function () { return complete(); }); } : function () { complete(); };
	                }
	            }
	            return _super.prototype.subscribe.call(this, schedulerFn, errorFn, completeFn);
	        };
	        return EventEmitter;
	    }(rxjs_Subject.Subject));
	
	    /**
	     * @license
	     * Copyright Google Inc. All Rights Reserved.
	     *
	     * Use of this source code is governed by an MIT-style license that can be
	     * found in the LICENSE file at https://angular.io/license
	     */
	    var __extends$6 = (this && this.__extends) || function (d, b) {
	        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	    /**
	     * Indicates that a FormControl is valid, i.e. that no errors exist in the input value.
	     */
	    var VALID = 'VALID';
	    /**
	     * Indicates that a FormControl is invalid, i.e. that an error exists in the input value.
	     */
	    var INVALID = 'INVALID';
	    /**
	     * Indicates that a FormControl is pending, i.e. that async validation is occurring and
	     * errors are not yet available for the input value.
	     */
	    var PENDING = 'PENDING';
	    /**
	     * Indicates that a FormControl is disabled, i.e. that the control is exempt from ancestor
	     * calculations of validity or value.
	     */
	    var DISABLED = 'DISABLED';
	    function _find(control, path, delimiter) {
	        if (path == null)
	            return null;
	        if (!(path instanceof Array)) {
	            path = path.split(delimiter);
	        }
	        if (path instanceof Array && (path.length === 0))
	            return null;
	        return path.reduce(function (v, name) {
	            if (v instanceof FormGroup) {
	                return v.controls[name] || null;
	            }
	            if (v instanceof FormArray) {
	                return v.at(name) || null;
	            }
	            return null;
	        }, control);
	    }
	    function toObservable(r) {
	        return isPromise(r) ? rxjs_observable_fromPromise.fromPromise(r) : r;
	    }
	    function coerceToValidator(validator) {
	        return Array.isArray(validator) ? composeValidators(validator) : validator;
	    }
	    function coerceToAsyncValidator(asyncValidator) {
	        return Array.isArray(asyncValidator) ? composeAsyncValidators(asyncValidator) : asyncValidator;
	    }
	    /**
	     * @whatItDoes This is the base class for {@link FormControl}, {@link FormGroup}, and
	     * {@link FormArray}.
	     *
	     * It provides some of the shared behavior that all controls and groups of controls have, like
	     * running validators, calculating status, and resetting state. It also defines the properties
	     * that are shared between all sub-classes, like `value`, `valid`, and `dirty`. It shouldn't be
	     * instantiated directly.
	     *
	     * @stable
	     */
	    var AbstractControl = (function () {
	        function AbstractControl(validator, asyncValidator) {
	            this.validator = validator;
	            this.asyncValidator = asyncValidator;
	            /** @internal */
	            this._onCollectionChange = function () { };
	            this._pristine = true;
	            this._touched = false;
	            /** @internal */
	            this._onDisabledChange = [];
	        }
	        Object.defineProperty(AbstractControl.prototype, "value", {
	            /**
	             * The value of the control.
	             */
	            get: function () { return this._value; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControl.prototype, "status", {
	            /**
	             * The validation status of the control. There are four possible
	             * validation statuses:
	             *
	             * * **VALID**:  control has passed all validation checks
	             * * **INVALID**: control has failed at least one validation check
	             * * **PENDING**: control is in the midst of conducting a validation check
	             * * **DISABLED**: control is exempt from validation checks
	             *
	             * These statuses are mutually exclusive, so a control cannot be
	             * both valid AND invalid or invalid AND disabled.
	             */
	            get: function () { return this._status; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControl.prototype, "valid", {
	            /**
	             * A control is `valid` when its `status === VALID`.
	             *
	             * In order to have this status, the control must have passed all its
	             * validation checks.
	             */
	            get: function () { return this._status === VALID; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControl.prototype, "invalid", {
	            /**
	             * A control is `invalid` when its `status === INVALID`.
	             *
	             * In order to have this status, the control must have failed
	             * at least one of its validation checks.
	             */
	            get: function () { return this._status === INVALID; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControl.prototype, "pending", {
	            /**
	             * A control is `pending` when its `status === PENDING`.
	             *
	             * In order to have this status, the control must be in the
	             * middle of conducting a validation check.
	             */
	            get: function () { return this._status == PENDING; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControl.prototype, "disabled", {
	            /**
	             * A control is `disabled` when its `status === DISABLED`.
	             *
	             * Disabled controls are exempt from validation checks and
	             * are not included in the aggregate value of their ancestor
	             * controls.
	             */
	            get: function () { return this._status === DISABLED; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControl.prototype, "enabled", {
	            /**
	             * A control is `enabled` as long as its `status !== DISABLED`.
	             *
	             * In other words, it has a status of `VALID`, `INVALID`, or
	             * `PENDING`.
	             */
	            get: function () { return this._status !== DISABLED; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControl.prototype, "errors", {
	            /**
	             * Returns any errors generated by failing validation. If there
	             * are no errors, it will return null.
	             */
	            get: function () { return this._errors; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControl.prototype, "pristine", {
	            /**
	             * A control is `pristine` if the user has not yet changed
	             * the value in the UI.
	             *
	             * Note that programmatic changes to a control's value will
	             * *not* mark it dirty.
	             */
	            get: function () { return this._pristine; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControl.prototype, "dirty", {
	            /**
	             * A control is `dirty` if the user has changed the value
	             * in the UI.
	             *
	             * Note that programmatic changes to a control's value will
	             * *not* mark it dirty.
	             */
	            get: function () { return !this.pristine; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControl.prototype, "touched", {
	            /**
	            * A control is marked `touched` once the user has triggered
	            * a `blur` event on it.
	            */
	            get: function () { return this._touched; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControl.prototype, "untouched", {
	            /**
	             * A control is `untouched` if the user has not yet triggered
	             * a `blur` event on it.
	             */
	            get: function () { return !this._touched; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControl.prototype, "valueChanges", {
	            /**
	             * Emits an event every time the value of the control changes, in
	             * the UI or programmatically.
	             */
	            get: function () { return this._valueChanges; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(AbstractControl.prototype, "statusChanges", {
	            /**
	             * Emits an event every time the validation status of the control
	             * is re-calculated.
	             */
	            get: function () { return this._statusChanges; },
	            enumerable: true,
	            configurable: true
	        });
	        /**
	         * Sets the synchronous validators that are active on this control.  Calling
	         * this will overwrite any existing sync validators.
	         */
	        AbstractControl.prototype.setValidators = function (newValidator) {
	            this.validator = coerceToValidator(newValidator);
	        };
	        /**
	         * Sets the async validators that are active on this control. Calling this
	         * will overwrite any existing async validators.
	         */
	        AbstractControl.prototype.setAsyncValidators = function (newValidator) {
	            this.asyncValidator = coerceToAsyncValidator(newValidator);
	        };
	        /**
	         * Empties out the sync validator list.
	         */
	        AbstractControl.prototype.clearValidators = function () { this.validator = null; };
	        /**
	         * Empties out the async validator list.
	         */
	        AbstractControl.prototype.clearAsyncValidators = function () { this.asyncValidator = null; };
	        /**
	         * Marks the control as `touched`.
	         *
	         * This will also mark all direct ancestors as `touched` to maintain
	         * the model.
	         */
	        AbstractControl.prototype.markAsTouched = function (_a) {
	            var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
	            this._touched = true;
	            if (this._parent && !onlySelf) {
	                this._parent.markAsTouched({ onlySelf: onlySelf });
	            }
	        };
	        /**
	         * Marks the control as `untouched`.
	         *
	         * If the control has any children, it will also mark all children as `untouched`
	         * to maintain the model, and re-calculate the `touched` status of all parent
	         * controls.
	         */
	        AbstractControl.prototype.markAsUntouched = function (_a) {
	            var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
	            this._touched = false;
	            this._forEachChild(function (control) { control.markAsUntouched({ onlySelf: true }); });
	            if (this._parent && !onlySelf) {
	                this._parent._updateTouched({ onlySelf: onlySelf });
	            }
	        };
	        /**
	         * Marks the control as `dirty`.
	         *
	         * This will also mark all direct ancestors as `dirty` to maintain
	         * the model.
	         */
	        AbstractControl.prototype.markAsDirty = function (_a) {
	            var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
	            this._pristine = false;
	            if (this._parent && !onlySelf) {
	                this._parent.markAsDirty({ onlySelf: onlySelf });
	            }
	        };
	        /**
	         * Marks the control as `pristine`.
	         *
	         * If the control has any children, it will also mark all children as `pristine`
	         * to maintain the model, and re-calculate the `pristine` status of all parent
	         * controls.
	         */
	        AbstractControl.prototype.markAsPristine = function (_a) {
	            var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
	            this._pristine = true;
	            this._forEachChild(function (control) { control.markAsPristine({ onlySelf: true }); });
	            if (this._parent && !onlySelf) {
	                this._parent._updatePristine({ onlySelf: onlySelf });
	            }
	        };
	        /**
	         * Marks the control as `pending`.
	         */
	        AbstractControl.prototype.markAsPending = function (_a) {
	            var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
	            this._status = PENDING;
	            if (this._parent && !onlySelf) {
	                this._parent.markAsPending({ onlySelf: onlySelf });
	            }
	        };
	        /**
	         * Disables the control. This means the control will be exempt from validation checks and
	         * excluded from the aggregate value of any parent. Its status is `DISABLED`.
	         *
	         * If the control has children, all children will be disabled to maintain the model.
	         */
	        AbstractControl.prototype.disable = function (_a) {
	            var _b = _a === void 0 ? {} : _a, onlySelf = _b.onlySelf, emitEvent = _b.emitEvent;
	            this._status = DISABLED;
	            this._errors = null;
	            this._forEachChild(function (control) { control.disable({ onlySelf: true }); });
	            this._updateValue();
	            if (emitEvent !== false) {
	                this._valueChanges.emit(this._value);
	                this._statusChanges.emit(this._status);
	            }
	            this._updateAncestors(onlySelf);
	            this._onDisabledChange.forEach(function (changeFn) { return changeFn(true); });
	        };
	        /**
	         * Enables the control. This means the control will be included in validation checks and
	         * the aggregate value of its parent. Its status is re-calculated based on its value and
	         * its validators.
	         *
	         * If the control has children, all children will be enabled.
	         */
	        AbstractControl.prototype.enable = function (_a) {
	            var _b = _a === void 0 ? {} : _a, onlySelf = _b.onlySelf, emitEvent = _b.emitEvent;
	            this._status = VALID;
	            this._forEachChild(function (control) { control.enable({ onlySelf: true }); });
	            this.updateValueAndValidity({ onlySelf: true, emitEvent: emitEvent });
	            this._updateAncestors(onlySelf);
	            this._onDisabledChange.forEach(function (changeFn) { return changeFn(false); });
	        };
	        AbstractControl.prototype._updateAncestors = function (onlySelf) {
	            if (this._parent && !onlySelf) {
	                this._parent.updateValueAndValidity();
	                this._parent._updatePristine();
	                this._parent._updateTouched();
	            }
	        };
	        AbstractControl.prototype.setParent = function (parent) { this._parent = parent; };
	        /**
	         * Re-calculates the value and validation status of the control.
	         *
	         * By default, it will also update the value and validity of its ancestors.
	         */
	        AbstractControl.prototype.updateValueAndValidity = function (_a) {
	            var _b = _a === void 0 ? {} : _a, onlySelf = _b.onlySelf, emitEvent = _b.emitEvent;
	            this._setInitialStatus();
	            this._updateValue();
	            if (this.enabled) {
	                this._errors = this._runValidator();
	                this._status = this._calculateStatus();
	                if (this._status === VALID || this._status === PENDING) {
	                    this._runAsyncValidator(emitEvent);
	                }
	            }
	            if (emitEvent !== false) {
	                this._valueChanges.emit(this._value);
	                this._statusChanges.emit(this._status);
	            }
	            if (this._parent && !onlySelf) {
	                this._parent.updateValueAndValidity({ onlySelf: onlySelf, emitEvent: emitEvent });
	            }
	        };
	        /** @internal */
	        AbstractControl.prototype._updateTreeValidity = function (_a) {
	            var emitEvent = (_a === void 0 ? { emitEvent: true } : _a).emitEvent;
	            this._forEachChild(function (ctrl) { return ctrl._updateTreeValidity({ emitEvent: emitEvent }); });
	            this.updateValueAndValidity({ onlySelf: true, emitEvent: emitEvent });
	        };
	        AbstractControl.prototype._setInitialStatus = function () { this._status = this._allControlsDisabled() ? DISABLED : VALID; };
	        AbstractControl.prototype._runValidator = function () {
	            return this.validator ? this.validator(this) : null;
	        };
	        AbstractControl.prototype._runAsyncValidator = function (emitEvent) {
	            var _this = this;
	            if (this.asyncValidator) {
	                this._status = PENDING;
	                this._cancelExistingSubscription();
	                var obs = toObservable(this.asyncValidator(this));
	                this._asyncValidationSubscription =
	                    obs.subscribe({ next: function (res) { return _this.setErrors(res, { emitEvent: emitEvent }); } });
	            }
	        };
	        AbstractControl.prototype._cancelExistingSubscription = function () {
	            if (this._asyncValidationSubscription) {
	                this._asyncValidationSubscription.unsubscribe();
	            }
	        };
	        /**
	         * Sets errors on a form control.
	         *
	         * This is used when validations are run manually by the user, rather than automatically.
	         *
	         * Calling `setErrors` will also update the validity of the parent control.
	         *
	         * ### Example
	         *
	         * ```
	         * const login = new FormControl("someLogin");
	         * login.setErrors({
	         *   "notUnique": true
	         * });
	         *
	         * expect(login.valid).toEqual(false);
	         * expect(login.errors).toEqual({"notUnique": true});
	         *
	         * login.setValue("someOtherLogin");
	         *
	         * expect(login.valid).toEqual(true);
	         * ```
	         */
	        AbstractControl.prototype.setErrors = function (errors, _a) {
	            var emitEvent = (_a === void 0 ? {} : _a).emitEvent;
	            this._errors = errors;
	            this._updateControlsErrors(emitEvent !== false);
	        };
	        /**
	         * Retrieves a child control given the control's name or path.
	         *
	         * Paths can be passed in as an array or a string delimited by a dot.
	         *
	         * To get a control nested within a `person` sub-group:
	         *
	         * * `this.form.get('person.name');`
	         *
	         * -OR-
	         *
	         * * `this.form.get(['person', 'name']);`
	         */
	        AbstractControl.prototype.get = function (path) { return _find(this, path, '.'); };
	        /**
	         * Returns true if the control with the given path has the error specified. Otherwise
	         * returns null or undefined.
	         *
	         * If no path is given, it checks for the error on the present control.
	         */
	        AbstractControl.prototype.getError = function (errorCode, path) {
	            if (path === void 0) { path = null; }
	            var control = path ? this.get(path) : this;
	            return control && control._errors ? control._errors[errorCode] : null;
	        };
	        /**
	         * Returns true if the control with the given path has the error specified. Otherwise
	         * returns false.
	         *
	         * If no path is given, it checks for the error on the present control.
	         */
	        AbstractControl.prototype.hasError = function (errorCode, path) {
	            if (path === void 0) { path = null; }
	            return !!this.getError(errorCode, path);
	        };
	        Object.defineProperty(AbstractControl.prototype, "root", {
	            /**
	             * Retrieves the top-level ancestor of this control.
	             */
	            get: function () {
	                var x = this;
	                while (x._parent) {
	                    x = x._parent;
	                }
	                return x;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        /** @internal */
	        AbstractControl.prototype._updateControlsErrors = function (emitEvent) {
	            this._status = this._calculateStatus();
	            if (emitEvent) {
	                this._statusChanges.emit(this._status);
	            }
	            if (this._parent) {
	                this._parent._updateControlsErrors(emitEvent);
	            }
	        };
	        /** @internal */
	        AbstractControl.prototype._initObservables = function () {
	            this._valueChanges = new EventEmitter();
	            this._statusChanges = new EventEmitter();
	        };
	        AbstractControl.prototype._calculateStatus = function () {
	            if (this._allControlsDisabled())
	                return DISABLED;
	            if (this._errors)
	                return INVALID;
	            if (this._anyControlsHaveStatus(PENDING))
	                return PENDING;
	            if (this._anyControlsHaveStatus(INVALID))
	                return INVALID;
	            return VALID;
	        };
	        /** @internal */
	        AbstractControl.prototype._anyControlsHaveStatus = function (status) {
	            return this._anyControls(function (control) { return control.status === status; });
	        };
	        /** @internal */
	        AbstractControl.prototype._anyControlsDirty = function () {
	            return this._anyControls(function (control) { return control.dirty; });
	        };
	        /** @internal */
	        AbstractControl.prototype._anyControlsTouched = function () {
	            return this._anyControls(function (control) { return control.touched; });
	        };
	        /** @internal */
	        AbstractControl.prototype._updatePristine = function (_a) {
	            var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
	            this._pristine = !this._anyControlsDirty();
	            if (this._parent && !onlySelf) {
	                this._parent._updatePristine({ onlySelf: onlySelf });
	            }
	        };
	        /** @internal */
	        AbstractControl.prototype._updateTouched = function (_a) {
	            var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
	            this._touched = this._anyControlsTouched();
	            if (this._parent && !onlySelf) {
	                this._parent._updateTouched({ onlySelf: onlySelf });
	            }
	        };
	        /** @internal */
	        AbstractControl.prototype._isBoxedValue = function (formState) {
	            return typeof formState === 'object' && formState !== null &&
	                Object.keys(formState).length === 2 && 'value' in formState && 'disabled' in formState;
	        };
	        /** @internal */
	        AbstractControl.prototype._registerOnCollectionChange = function (fn) { this._onCollectionChange = fn; };
	        return AbstractControl;
	    }());
	    /**
	     * @whatItDoes Tracks the value and validation status of an individual form control.
	     *
	     * It is one of the three fundamental building blocks of Angular forms, along with
	     * {@link FormGroup} and {@link FormArray}.
	     *
	     * @howToUse
	     *
	     * When instantiating a {@link FormControl}, you can pass in an initial value as the
	     * first argument. Example:
	     *
	     * ```ts
	     * const ctrl = new FormControl('some value');
	     * console.log(ctrl.value);     // 'some value'
	     *```
	     *
	     * You can also initialize the control with a form state object on instantiation,
	     * which includes both the value and whether or not the control is disabled.
	     * You can't use the value key without the disabled key; both are required
	     * to use this way of initialization.
	     *
	     * ```ts
	     * const ctrl = new FormControl({value: 'n/a', disabled: true});
	     * console.log(ctrl.value);     // 'n/a'
	     * console.log(ctrl.status);   // 'DISABLED'
	     * ```
	     *
	     * To include a sync validator (or an array of sync validators) with the control,
	     * pass it in as the second argument. Async validators are also supported, but
	     * have to be passed in separately as the third arg.
	     *
	     * ```ts
	     * const ctrl = new FormControl('', Validators.required);
	     * console.log(ctrl.value);     // ''
	     * console.log(ctrl.status);   // 'INVALID'
	     * ```
	     *
	     * See its superclass, {@link AbstractControl}, for more properties and methods.
	     *
	     * * **npm package**: `@angular/forms`
	     *
	     * @stable
	     */
	    var FormControl = (function (_super) {
	        __extends$6(FormControl, _super);
	        function FormControl(formState, validator, asyncValidator) {
	            if (formState === void 0) { formState = null; }
	            if (validator === void 0) { validator = null; }
	            if (asyncValidator === void 0) { asyncValidator = null; }
	            _super.call(this, coerceToValidator(validator), coerceToAsyncValidator(asyncValidator));
	            /** @internal */
	            this._onChange = [];
	            this._applyFormState(formState);
	            this.updateValueAndValidity({ onlySelf: true, emitEvent: false });
	            this._initObservables();
	        }
	        /**
	         * Set the value of the form control to `value`.
	         *
	         * If `onlySelf` is `true`, this change will only affect the validation of this `FormControl`
	         * and not its parent component. This defaults to false.
	         *
	         * If `emitEvent` is `true`, this
	         * change will cause a `valueChanges` event on the `FormControl` to be emitted. This defaults
	         * to true (as it falls through to `updateValueAndValidity`).
	         *
	         * If `emitModelToViewChange` is `true`, the view will be notified about the new value
	         * via an `onChange` event. This is the default behavior if `emitModelToViewChange` is not
	         * specified.
	         *
	         * If `emitViewToModelChange` is `true`, an ngModelChange event will be fired to update the
	         * model.  This is the default behavior if `emitViewToModelChange` is not specified.
	         */
	        FormControl.prototype.setValue = function (value, _a) {
	            var _this = this;
	            var _b = _a === void 0 ? {} : _a, onlySelf = _b.onlySelf, emitEvent = _b.emitEvent, emitModelToViewChange = _b.emitModelToViewChange, emitViewToModelChange = _b.emitViewToModelChange;
	            this._value = value;
	            if (this._onChange.length && emitModelToViewChange !== false) {
	                this._onChange.forEach(function (changeFn) { return changeFn(_this._value, emitViewToModelChange !== false); });
	            }
	            this.updateValueAndValidity({ onlySelf: onlySelf, emitEvent: emitEvent });
	        };
	        /**
	         * Patches the value of a control.
	         *
	         * This function is functionally the same as {@link FormControl.setValue} at this level.
	         * It exists for symmetry with {@link FormGroup.patchValue} on `FormGroups` and `FormArrays`,
	         * where it does behave differently.
	         */
	        FormControl.prototype.patchValue = function (value, options) {
	            if (options === void 0) { options = {}; }
	            this.setValue(value, options);
	        };
	        /**
	         * Resets the form control. This means by default:
	         *
	         * * it is marked as `pristine`
	         * * it is marked as `untouched`
	         * * value is set to null
	         *
	         * You can also reset to a specific form state by passing through a standalone
	         * value or a form state object that contains both a value and a disabled state
	         * (these are the only two properties that cannot be calculated).
	         *
	         * Ex:
	         *
	         * ```ts
	         * this.control.reset('Nancy');
	         *
	         * console.log(this.control.value);  // 'Nancy'
	         * ```
	         *
	         * OR
	         *
	         * ```
	         * this.control.reset({value: 'Nancy', disabled: true});
	         *
	         * console.log(this.control.value);  // 'Nancy'
	         * console.log(this.control.status);  // 'DISABLED'
	         * ```
	         */
	        FormControl.prototype.reset = function (formState, _a) {
	            if (formState === void 0) { formState = null; }
	            var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
	            this._applyFormState(formState);
	            this.markAsPristine({ onlySelf: onlySelf });
	            this.markAsUntouched({ onlySelf: onlySelf });
	            this.setValue(this._value, { onlySelf: onlySelf });
	        };
	        /**
	         * @internal
	         */
	        FormControl.prototype._updateValue = function () { };
	        /**
	         * @internal
	         */
	        FormControl.prototype._anyControls = function (condition) { return false; };
	        /**
	         * @internal
	         */
	        FormControl.prototype._allControlsDisabled = function () { return this.disabled; };
	        /**
	         * Register a listener for change events.
	         */
	        FormControl.prototype.registerOnChange = function (fn) { this._onChange.push(fn); };
	        /**
	         * @internal
	         */
	        FormControl.prototype._clearChangeFns = function () {
	            this._onChange = [];
	            this._onDisabledChange = [];
	            this._onCollectionChange = function () { };
	        };
	        /**
	         * Register a listener for disabled events.
	         */
	        FormControl.prototype.registerOnDisabledChange = function (fn) {
	            this._onDisabledChange.push(fn);
	        };
	        /**
	         * @internal
	         */
	        FormControl.prototype._forEachChild = function (cb) { };
	        FormControl.prototype._applyFormState = function (formState) {
	            if (this._isBoxedValue(formState)) {
	                this._value = formState.value;
	                formState.disabled ? this.disable({ onlySelf: true, emitEvent: false }) :
	                    this.enable({ onlySelf: true, emitEvent: false });
	            }
	            else {
	                this._value = formState;
	            }
	        };
	        return FormControl;
	    }(AbstractControl));
	    /**
	     * @whatItDoes Tracks the value and validity state of a group of {@link FormControl}
	     * instances.
	     *
	     * A `FormGroup` aggregates the values of each child {@link FormControl} into one object,
	     * with each control name as the key.  It calculates its status by reducing the statuses
	     * of its children. For example, if one of the controls in a group is invalid, the entire
	     * group becomes invalid.
	     *
	     * `FormGroup` is one of the three fundamental building blocks used to define forms in Angular,
	     * along with {@link FormControl} and {@link FormArray}.
	     *
	     * @howToUse
	     *
	     * When instantiating a {@link FormGroup}, pass in a collection of child controls as the first
	     * argument. The key for each child will be the name under which it is registered.
	     *
	     * ### Example
	     *
	     * ```
	     * const form = new FormGroup({
	     *   first: new FormControl('Nancy', Validators.minLength(2)),
	     *   last: new FormControl('Drew'),
	     * });
	     *
	     * console.log(form.value);   // {first: 'Nancy', last; 'Drew'}
	     * console.log(form.status);  // 'VALID'
	     * ```
	     *
	     * You can also include group-level validators as the second arg, or group-level async
	     * validators as the third arg. These come in handy when you want to perform validation
	     * that considers the value of more than one child control.
	     *
	     * ### Example
	     *
	     * ```
	     * const form = new FormGroup({
	     *   password: new FormControl('', Validators.minLength(2)),
	     *   passwordConfirm: new FormControl('', Validators.minLength(2)),
	     * }, passwordMatchValidator);
	     *
	     *
	     * function passwordMatchValidator(g: FormGroup) {
	     *    return g.get('password').value === g.get('passwordConfirm').value
	     *       ? null : {'mismatch': true};
	     * }
	     * ```
	     *
	     * * **npm package**: `@angular/forms`
	     *
	     * @stable
	     */
	    var FormGroup = (function (_super) {
	        __extends$6(FormGroup, _super);
	        function FormGroup(controls, validator, asyncValidator) {
	            if (validator === void 0) { validator = null; }
	            if (asyncValidator === void 0) { asyncValidator = null; }
	            _super.call(this, validator, asyncValidator);
	            this.controls = controls;
	            this._initObservables();
	            this._setUpControls();
	            this.updateValueAndValidity({ onlySelf: true, emitEvent: false });
	        }
	        /**
	         * Registers a control with the group's list of controls.
	         *
	         * This method does not update value or validity of the control, so for
	         * most cases you'll want to use {@link FormGroup.addControl} instead.
	         */
	        FormGroup.prototype.registerControl = function (name, control) {
	            if (this.controls[name])
	                return this.controls[name];
	            this.controls[name] = control;
	            control.setParent(this);
	            control._registerOnCollectionChange(this._onCollectionChange);
	            return control;
	        };
	        /**
	         * Add a control to this group.
	         */
	        FormGroup.prototype.addControl = function (name, control) {
	            this.registerControl(name, control);
	            this.updateValueAndValidity();
	            this._onCollectionChange();
	        };
	        /**
	         * Remove a control from this group.
	         */
	        FormGroup.prototype.removeControl = function (name) {
	            if (this.controls[name])
	                this.controls[name]._registerOnCollectionChange(function () { });
	            delete (this.controls[name]);
	            this.updateValueAndValidity();
	            this._onCollectionChange();
	        };
	        /**
	         * Replace an existing control.
	         */
	        FormGroup.prototype.setControl = function (name, control) {
	            if (this.controls[name])
	                this.controls[name]._registerOnCollectionChange(function () { });
	            delete (this.controls[name]);
	            if (control)
	                this.registerControl(name, control);
	            this.updateValueAndValidity();
	            this._onCollectionChange();
	        };
	        /**
	         * Check whether there is an enabled control with the given name in the group.
	         *
	         * It will return false for disabled controls. If you'd like to check for
	         * existence in the group only, use {@link AbstractControl.get} instead.
	         */
	        FormGroup.prototype.contains = function (controlName) {
	            return this.controls.hasOwnProperty(controlName) && this.controls[controlName].enabled;
	        };
	        /**
	         *  Sets the value of the {@link FormGroup}. It accepts an object that matches
	         *  the structure of the group, with control names as keys.
	         *
	         * This method performs strict checks, so it will throw an error if you try
	         * to set the value of a control that doesn't exist or if you exclude the
	         * value of a control.
	         *
	         *  ### Example
	         *
	         *  ```
	         *  const form = new FormGroup({
	         *     first: new FormControl(),
	         *     last: new FormControl()
	         *  });
	         *  console.log(form.value);   // {first: null, last: null}
	         *
	         *  form.setValue({first: 'Nancy', last: 'Drew'});
	         *  console.log(form.value);   // {first: 'Nancy', last: 'Drew'}
	         *
	         *  ```
	         */
	        FormGroup.prototype.setValue = function (value, _a) {
	            var _this = this;
	            var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
	            this._checkAllValuesPresent(value);
	            Object.keys(value).forEach(function (name) {
	                _this._throwIfControlMissing(name);
	                _this.controls[name].setValue(value[name], { onlySelf: true });
	            });
	            this.updateValueAndValidity({ onlySelf: onlySelf });
	        };
	        /**
	         *  Patches the value of the {@link FormGroup}. It accepts an object with control
	         *  names as keys, and will do its best to match the values to the correct controls
	         *  in the group.
	         *
	         *  It accepts both super-sets and sub-sets of the group without throwing an error.
	         *
	         *  ### Example
	         *
	         *  ```
	         *  const form = new FormGroup({
	         *     first: new FormControl(),
	         *     last: new FormControl()
	         *  });
	         *  console.log(form.value);   // {first: null, last: null}
	         *
	         *  form.patchValue({first: 'Nancy'});
	         *  console.log(form.value);   // {first: 'Nancy', last: null}
	         *
	         *  ```
	         */
	        FormGroup.prototype.patchValue = function (value, _a) {
	            var _this = this;
	            var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
	            Object.keys(value).forEach(function (name) {
	                if (_this.controls[name]) {
	                    _this.controls[name].patchValue(value[name], { onlySelf: true });
	                }
	            });
	            this.updateValueAndValidity({ onlySelf: onlySelf });
	        };
	        /**
	         * Resets the {@link FormGroup}. This means by default:
	         *
	         * * The group and all descendants are marked `pristine`
	         * * The group and all descendants are marked `untouched`
	         * * The value of all descendants will be null or null maps
	         *
	         * You can also reset to a specific form state by passing in a map of states
	         * that matches the structure of your form, with control names as keys. The state
	         * can be a standalone value or a form state object with both a value and a disabled
	         * status.
	         *
	         * ### Example
	         *
	         * ```ts
	         * this.form.reset({first: 'name', last: 'last name'});
	         *
	         * console.log(this.form.value);  // {first: 'name', last: 'last name'}
	         * ```
	         *
	         * - OR -
	         *
	         * ```
	         * this.form.reset({
	         *   first: {value: 'name', disabled: true},
	         *   last: 'last'
	         * });
	         *
	         * console.log(this.form.value);  // {first: 'name', last: 'last name'}
	         * console.log(this.form.get('first').status);  // 'DISABLED'
	         * ```
	         */
	        FormGroup.prototype.reset = function (value, _a) {
	            if (value === void 0) { value = {}; }
	            var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
	            this._forEachChild(function (control, name) {
	                control.reset(value[name], { onlySelf: true });
	            });
	            this.updateValueAndValidity({ onlySelf: onlySelf });
	            this._updatePristine({ onlySelf: onlySelf });
	            this._updateTouched({ onlySelf: onlySelf });
	        };
	        /**
	         * The aggregate value of the {@link FormGroup}, including any disabled controls.
	         *
	         * If you'd like to include all values regardless of disabled status, use this method.
	         * Otherwise, the `value` property is the best way to get the value of the group.
	         */
	        FormGroup.prototype.getRawValue = function () {
	            return this._reduceChildren({}, function (acc, control, name) {
	                acc[name] = control.value;
	                return acc;
	            });
	        };
	        /** @internal */
	        FormGroup.prototype._throwIfControlMissing = function (name) {
	            if (!Object.keys(this.controls).length) {
	                throw new Error("\n        There are no form controls registered with this group yet.  If you're using ngModel,\n        you may want to check next tick (e.g. use setTimeout).\n      ");
	            }
	            if (!this.controls[name]) {
	                throw new Error("Cannot find form control with name: " + name + ".");
	            }
	        };
	        /** @internal */
	        FormGroup.prototype._forEachChild = function (cb) {
	            var _this = this;
	            Object.keys(this.controls).forEach(function (k) { return cb(_this.controls[k], k); });
	        };
	        /** @internal */
	        FormGroup.prototype._setUpControls = function () {
	            var _this = this;
	            this._forEachChild(function (control) {
	                control.setParent(_this);
	                control._registerOnCollectionChange(_this._onCollectionChange);
	            });
	        };
	        /** @internal */
	        FormGroup.prototype._updateValue = function () { this._value = this._reduceValue(); };
	        /** @internal */
	        FormGroup.prototype._anyControls = function (condition) {
	            var _this = this;
	            var res = false;
	            this._forEachChild(function (control, name) {
	                res = res || (_this.contains(name) && condition(control));
	            });
	            return res;
	        };
	        /** @internal */
	        FormGroup.prototype._reduceValue = function () {
	            var _this = this;
	            return this._reduceChildren({}, function (acc, control, name) {
	                if (control.enabled || _this.disabled) {
	                    acc[name] = control.value;
	                }
	                return acc;
	            });
	        };
	        /** @internal */
	        FormGroup.prototype._reduceChildren = function (initValue, fn) {
	            var res = initValue;
	            this._forEachChild(function (control, name) { res = fn(res, control, name); });
	            return res;
	        };
	        /** @internal */
	        FormGroup.prototype._allControlsDisabled = function () {
	            for (var _i = 0, _a = Object.keys(this.controls); _i < _a.length; _i++) {
	                var controlName = _a[_i];
	                if (this.controls[controlName].enabled) {
	                    return false;
	                }
	            }
	            return Object.keys(this.controls).length > 0 || this.disabled;
	        };
	        /** @internal */
	        FormGroup.prototype._checkAllValuesPresent = function (value) {
	            this._forEachChild(function (control, name) {
	                if (value[name] === undefined) {
	                    throw new Error("Must supply a value for form control with name: '" + name + "'.");
	                }
	            });
	        };
	        return FormGroup;
	    }(AbstractControl));
	    /**
	     * @whatItDoes Tracks the value and validity state of an array of {@link FormControl}
	     * instances.
	     *
	     * A `FormArray` aggregates the values of each child {@link FormControl} into an array.
	     * It calculates its status by reducing the statuses of its children. For example, if one of
	     * the controls in a `FormArray` is invalid, the entire array becomes invalid.
	     *
	     * `FormArray` is one of the three fundamental building blocks used to define forms in Angular,
	     * along with {@link FormControl} and {@link FormGroup}.
	     *
	     * @howToUse
	     *
	     * When instantiating a {@link FormArray}, pass in an array of child controls as the first
	     * argument.
	     *
	     * ### Example
	     *
	     * ```
	     * const arr = new FormArray([
	     *   new FormControl('Nancy', Validators.minLength(2)),
	     *   new FormControl('Drew'),
	     * ]);
	     *
	     * console.log(arr.value);   // ['Nancy', 'Drew']
	     * console.log(arr.status);  // 'VALID'
	     * ```
	     *
	     * You can also include array-level validators as the second arg, or array-level async
	     * validators as the third arg. These come in handy when you want to perform validation
	     * that considers the value of more than one child control.
	     *
	     * ### Adding or removing controls
	     *
	     * To change the controls in the array, use the `push`, `insert`, or `removeAt` methods
	     * in `FormArray` itself. These methods ensure the controls are properly tracked in the
	     * form's hierarchy. Do not modify the array of `AbstractControl`s used to instantiate
	     * the `FormArray` directly, as that will result in strange and unexpected behavior such
	     * as broken change detection.
	     *
	     * * **npm package**: `@angular/forms`
	     *
	     * @stable
	     */
	    var FormArray = (function (_super) {
	        __extends$6(FormArray, _super);
	        function FormArray(controls, validator, asyncValidator) {
	            if (validator === void 0) { validator = null; }
	            if (asyncValidator === void 0) { asyncValidator = null; }
	            _super.call(this, validator, asyncValidator);
	            this.controls = controls;
	            this._initObservables();
	            this._setUpControls();
	            this.updateValueAndValidity({ onlySelf: true, emitEvent: false });
	        }
	        /**
	         * Get the {@link AbstractControl} at the given `index` in the array.
	         */
	        FormArray.prototype.at = function (index) { return this.controls[index]; };
	        /**
	         * Insert a new {@link AbstractControl} at the end of the array.
	         */
	        FormArray.prototype.push = function (control) {
	            this.controls.push(control);
	            this._registerControl(control);
	            this.updateValueAndValidity();
	            this._onCollectionChange();
	        };
	        /**
	         * Insert a new {@link AbstractControl} at the given `index` in the array.
	         */
	        FormArray.prototype.insert = function (index, control) {
	            this.controls.splice(index, 0, control);
	            this._registerControl(control);
	            this.updateValueAndValidity();
	            this._onCollectionChange();
	        };
	        /**
	         * Remove the control at the given `index` in the array.
	         */
	        FormArray.prototype.removeAt = function (index) {
	            if (this.controls[index])
	                this.controls[index]._registerOnCollectionChange(function () { });
	            this.controls.splice(index, 1);
	            this.updateValueAndValidity();
	            this._onCollectionChange();
	        };
	        /**
	         * Replace an existing control.
	         */
	        FormArray.prototype.setControl = function (index, control) {
	            if (this.controls[index])
	                this.controls[index]._registerOnCollectionChange(function () { });
	            this.controls.splice(index, 1);
	            if (control) {
	                this.controls.splice(index, 0, control);
	                this._registerControl(control);
	            }
	            this.updateValueAndValidity();
	            this._onCollectionChange();
	        };
	        Object.defineProperty(FormArray.prototype, "length", {
	            /**
	             * Length of the control array.
	             */
	            get: function () { return this.controls.length; },
	            enumerable: true,
	            configurable: true
	        });
	        /**
	         *  Sets the value of the {@link FormArray}. It accepts an array that matches
	         *  the structure of the control.
	         *
	         * This method performs strict checks, so it will throw an error if you try
	         * to set the value of a control that doesn't exist or if you exclude the
	         * value of a control.
	         *
	         *  ### Example
	         *
	         *  ```
	         *  const arr = new FormArray([
	         *     new FormControl(),
	         *     new FormControl()
	         *  ]);
	         *  console.log(arr.value);   // [null, null]
	         *
	         *  arr.setValue(['Nancy', 'Drew']);
	         *  console.log(arr.value);   // ['Nancy', 'Drew']
	         *  ```
	         */
	        FormArray.prototype.setValue = function (value, _a) {
	            var _this = this;
	            var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
	            this._checkAllValuesPresent(value);
	            value.forEach(function (newValue, index) {
	                _this._throwIfControlMissing(index);
	                _this.at(index).setValue(newValue, { onlySelf: true });
	            });
	            this.updateValueAndValidity({ onlySelf: onlySelf });
	        };
	        /**
	         *  Patches the value of the {@link FormArray}. It accepts an array that matches the
	         *  structure of the control, and will do its best to match the values to the correct
	         *  controls in the group.
	         *
	         *  It accepts both super-sets and sub-sets of the array without throwing an error.
	         *
	         *  ### Example
	         *
	         *  ```
	         *  const arr = new FormArray([
	         *     new FormControl(),
	         *     new FormControl()
	         *  ]);
	         *  console.log(arr.value);   // [null, null]
	         *
	         *  arr.patchValue(['Nancy']);
	         *  console.log(arr.value);   // ['Nancy', null]
	         *  ```
	         */
	        FormArray.prototype.patchValue = function (value, _a) {
	            var _this = this;
	            var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
	            value.forEach(function (newValue, index) {
	                if (_this.at(index)) {
	                    _this.at(index).patchValue(newValue, { onlySelf: true });
	                }
	            });
	            this.updateValueAndValidity({ onlySelf: onlySelf });
	        };
	        /**
	         * Resets the {@link FormArray}. This means by default:
	         *
	         * * The array and all descendants are marked `pristine`
	         * * The array and all descendants are marked `untouched`
	         * * The value of all descendants will be null or null maps
	         *
	         * You can also reset to a specific form state by passing in an array of states
	         * that matches the structure of the control. The state can be a standalone value
	         * or a form state object with both a value and a disabled status.
	         *
	         * ### Example
	         *
	         * ```ts
	         * this.arr.reset(['name', 'last name']);
	         *
	         * console.log(this.arr.value);  // ['name', 'last name']
	         * ```
	         *
	         * - OR -
	         *
	         * ```
	         * this.arr.reset([
	         *   {value: 'name', disabled: true},
	         *   'last'
	         * ]);
	         *
	         * console.log(this.arr.value);  // ['name', 'last name']
	         * console.log(this.arr.get(0).status);  // 'DISABLED'
	         * ```
	         */
	        FormArray.prototype.reset = function (value, _a) {
	            if (value === void 0) { value = []; }
	            var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
	            this._forEachChild(function (control, index) {
	                control.reset(value[index], { onlySelf: true });
	            });
	            this.updateValueAndValidity({ onlySelf: onlySelf });
	            this._updatePristine({ onlySelf: onlySelf });
	            this._updateTouched({ onlySelf: onlySelf });
	        };
	        /**
	         * The aggregate value of the array, including any disabled controls.
	         *
	         * If you'd like to include all values regardless of disabled status, use this method.
	         * Otherwise, the `value` property is the best way to get the value of the array.
	         */
	        FormArray.prototype.getRawValue = function () { return this.controls.map(function (control) { return control.value; }); };
	        /** @internal */
	        FormArray.prototype._throwIfControlMissing = function (index) {
	            if (!this.controls.length) {
	                throw new Error("\n        There are no form controls registered with this array yet.  If you're using ngModel,\n        you may want to check next tick (e.g. use setTimeout).\n      ");
	            }
	            if (!this.at(index)) {
	                throw new Error("Cannot find form control at index " + index);
	            }
	        };
	        /** @internal */
	        FormArray.prototype._forEachChild = function (cb) {
	            this.controls.forEach(function (control, index) { cb(control, index); });
	        };
	        /** @internal */
	        FormArray.prototype._updateValue = function () {
	            var _this = this;
	            this._value = this.controls.filter(function (control) { return control.enabled || _this.disabled; })
	                .map(function (control) { return control.value; });
	        };
	        /** @internal */
	        FormArray.prototype._anyControls = function (condition) {
	            return this.controls.some(function (control) { return control.enabled && condition(control); });
	        };
	        /** @internal */
	        FormArray.prototype._setUpControls = function () {
	            var _this = this;
	            this._forEachChild(function (control) { return _this._registerControl(control); });
	        };
	        /** @internal */
	        FormArray.prototype._checkAllValuesPresent = function (value) {
	            this._forEachChild(function (control, i) {
	                if (value[i] === undefined) {
	                    throw new Error("Must supply a value for form control at index: " + i + ".");
	                }
	            });
	        };
	        /** @internal */
	        FormArray.prototype._allControlsDisabled = function () {
	            for (var _i = 0, _a = this.controls; _i < _a.length; _i++) {
	                var control = _a[_i];
	                if (control.enabled)
	                    return false;
	            }
	            return this.controls.length > 0 || this.disabled;
	        };
	        FormArray.prototype._registerControl = function (control) {
	            control.setParent(this);
	            control._registerOnCollectionChange(this._onCollectionChange);
	        };
	        return FormArray;
	    }(AbstractControl));
	
	    /**
	     * @license
	     * Copyright Google Inc. All Rights Reserved.
	     *
	     * Use of this source code is governed by an MIT-style license that can be
	     * found in the LICENSE file at https://angular.io/license
	     */
	    var __extends$4 = (this && this.__extends) || function (d, b) {
	        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	    var formDirectiveProvider = {
	        provide: ControlContainer,
	        useExisting: _angular_core.forwardRef(function () { return NgForm; })
	    };
	    var resolvedPromise = Promise.resolve(null);
	    /**
	     * @whatItDoes Creates a top-level {@link FormGroup} instance and binds it to a form
	     * to track aggregate form value and validation status.
	     *
	     * @howToUse
	     *
	     * As soon as you import the `FormsModule`, this directive becomes active by default on
	     * all `<form>` tags.  You don't need to add a special selector.
	     *
	     * You can export the directive into a local template variable using `ngForm` as the key
	     * (ex: `#myForm="ngForm"`). This is optional, but useful.  Many properties from the underlying
	     * {@link FormGroup} instance are duplicated on the directive itself, so a reference to it
	     * will give you access to the aggregate value and validity status of the form, as well as
	     * user interaction properties like `dirty` and `touched`.
	     *
	     * To register child controls with the form, you'll want to use {@link NgModel} with a
	     * `name` attribute.  You can also use {@link NgModelGroup} if you'd like to create
	     * sub-groups within the form.
	     *
	     * You can listen to the directive's `ngSubmit` event to be notified when the user has
	     * triggered a form submission. The `ngSubmit` event will be emitted with the original form
	     * submission event.
	     *
	     * {@example forms/ts/simpleForm/simple_form_example.ts region='Component'}
	     *
	     * * **npm package**: `@angular/forms`
	     *
	     * * **NgModule**: `FormsModule`
	     *
	     *  @stable
	     */
	    var NgForm = (function (_super) {
	        __extends$4(NgForm, _super);
	        function NgForm(validators, asyncValidators) {
	            _super.call(this);
	            this._submitted = false;
	            this.ngSubmit = new EventEmitter();
	            this.form =
	                new FormGroup({}, composeValidators(validators), composeAsyncValidators(asyncValidators));
	        }
	        Object.defineProperty(NgForm.prototype, "submitted", {
	            get: function () { return this._submitted; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(NgForm.prototype, "formDirective", {
	            get: function () { return this; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(NgForm.prototype, "control", {
	            get: function () { return this.form; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(NgForm.prototype, "path", {
	            get: function () { return []; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(NgForm.prototype, "controls", {
	            get: function () { return this.form.controls; },
	            enumerable: true,
	            configurable: true
	        });
	        NgForm.prototype.addControl = function (dir) {
	            var _this = this;
	            resolvedPromise.then(function () {
	                var container = _this._findContainer(dir.path);
	                dir._control = container.registerControl(dir.name, dir.control);
	                setUpControl(dir.control, dir);
	                dir.control.updateValueAndValidity({ emitEvent: false });
	            });
	        };
	        NgForm.prototype.getControl = function (dir) { return this.form.get(dir.path); };
	        NgForm.prototype.removeControl = function (dir) {
	            var _this = this;
	            resolvedPromise.then(function () {
	                var container = _this._findContainer(dir.path);
	                if (isPresent(container)) {
	                    container.removeControl(dir.name);
	                }
	            });
	        };
	        NgForm.prototype.addFormGroup = function (dir) {
	            var _this = this;
	            resolvedPromise.then(function () {
	                var container = _this._findContainer(dir.path);
	                var group = new FormGroup({});
	                setUpFormContainer(group, dir);
	                container.registerControl(dir.name, group);
	                group.updateValueAndValidity({ emitEvent: false });
	            });
	        };
	        NgForm.prototype.removeFormGroup = function (dir) {
	            var _this = this;
	            resolvedPromise.then(function () {
	                var container = _this._findContainer(dir.path);
	                if (isPresent(container)) {
	                    container.removeControl(dir.name);
	                }
	            });
	        };
	        NgForm.prototype.getFormGroup = function (dir) { return this.form.get(dir.path); };
	        NgForm.prototype.updateModel = function (dir, value) {
	            var _this = this;
	            resolvedPromise.then(function () {
	                var ctrl = _this.form.get(dir.path);
	                ctrl.setValue(value);
	            });
	        };
	        NgForm.prototype.setValue = function (value) { this.control.setValue(value); };
	        NgForm.prototype.onSubmit = function ($event) {
	            this._submitted = true;
	            this.ngSubmit.emit($event);
	            return false;
	        };
	        NgForm.prototype.onReset = function () { this.resetForm(); };
	        NgForm.prototype.resetForm = function (value) {
	            if (value === void 0) { value = undefined; }
	            this.form.reset(value);
	            this._submitted = false;
	        };
	        /** @internal */
	        NgForm.prototype._findContainer = function (path) {
	            path.pop();
	            return path.length ? this.form.get(path) : this.form;
	        };
	        NgForm.decorators = [
	            { type: _angular_core.Directive, args: [{
	                        selector: 'form:not([ngNoForm]):not([formGroup]),ngForm,[ngForm]',
	                        providers: [formDirectiveProvider],
	                        host: { '(submit)': 'onSubmit($event)', '(reset)': 'onReset()' },
	                        outputs: ['ngSubmit'],
	                        exportAs: 'ngForm'
	                    },] },
	        ];
	        /** @nocollapse */
	        NgForm.ctorParameters = [
	            { type: Array, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self }, { type: _angular_core.Inject, args: [NG_VALIDATORS,] },] },
	            { type: Array, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self }, { type: _angular_core.Inject, args: [NG_ASYNC_VALIDATORS,] },] },
	        ];
	        return NgForm;
	    }(ControlContainer));
	
	    /**
	     * @license
	     * Copyright Google Inc. All Rights Reserved.
	     *
	     * Use of this source code is governed by an MIT-style license that can be
	     * found in the LICENSE file at https://angular.io/license
	     */
	    var Examples = {
	        formControlName: "\n    <div [formGroup]=\"myGroup\">\n      <input formControlName=\"firstName\">\n    </div>\n\n    In your class:\n\n    this.myGroup = new FormGroup({\n       firstName: new FormControl()\n    });",
	        formGroupName: "\n    <div [formGroup]=\"myGroup\">\n       <div formGroupName=\"person\">\n          <input formControlName=\"firstName\">\n       </div>\n    </div>\n\n    In your class:\n\n    this.myGroup = new FormGroup({\n       person: new FormGroup({ firstName: new FormControl() })\n    });",
	        formArrayName: "\n    <div [formGroup]=\"myGroup\">\n      <div formArrayName=\"cities\">\n        <div *ngFor=\"let city of cityArray.controls; let i=index\">\n          <input [formControlName]=\"i\">\n        </div>\n      </div>\n    </div>\n\n    In your class:\n\n    this.cityArray = new FormArray([new FormControl('SF')]);\n    this.myGroup = new FormGroup({\n      cities: this.cityArray\n    });",
	        ngModelGroup: "\n    <form>\n       <div ngModelGroup=\"person\">\n          <input [(ngModel)]=\"person.name\" name=\"firstName\">\n       </div>\n    </form>",
	        ngModelWithFormGroup: "\n    <div [formGroup]=\"myGroup\">\n       <input formControlName=\"firstName\">\n       <input [(ngModel)]=\"showMoreControls\" [ngModelOptions]=\"{standalone: true}\">\n    </div>\n  "
	    };
	
	    var TemplateDrivenErrors = (function () {
	        function TemplateDrivenErrors() {
	        }
	        TemplateDrivenErrors.modelParentException = function () {
	            throw new Error("\n      ngModel cannot be used to register form controls with a parent formGroup directive.  Try using\n      formGroup's partner directive \"formControlName\" instead.  Example:\n\n      " + Examples.formControlName + "\n\n      Or, if you'd like to avoid registering this form control, indicate that it's standalone in ngModelOptions:\n\n      Example:\n\n      " + Examples.ngModelWithFormGroup);
	        };
	        TemplateDrivenErrors.formGroupNameException = function () {
	            throw new Error("\n      ngModel cannot be used to register form controls with a parent formGroupName or formArrayName directive.\n\n      Option 1: Use formControlName instead of ngModel (reactive strategy):\n\n      " + Examples.formGroupName + "\n\n      Option 2:  Update ngModel's parent be ngModelGroup (template-driven strategy):\n\n      " + Examples.ngModelGroup);
	        };
	        TemplateDrivenErrors.missingNameException = function () {
	            throw new Error("If ngModel is used within a form tag, either the name attribute must be set or the form\n      control must be defined as 'standalone' in ngModelOptions.\n\n      Example 1: <input [(ngModel)]=\"person.firstName\" name=\"first\">\n      Example 2: <input [(ngModel)]=\"person.firstName\" [ngModelOptions]=\"{standalone: true}\">");
	        };
	        TemplateDrivenErrors.modelGroupParentException = function () {
	            throw new Error("\n      ngModelGroup cannot be used with a parent formGroup directive.\n\n      Option 1: Use formGroupName instead of ngModelGroup (reactive strategy):\n\n      " + Examples.formGroupName + "\n\n      Option 2:  Use a regular form tag instead of the formGroup directive (template-driven strategy):\n\n      " + Examples.ngModelGroup);
	        };
	        return TemplateDrivenErrors;
	    }());
	
	    /**
	     * @license
	     * Copyright Google Inc. All Rights Reserved.
	     *
	     * Use of this source code is governed by an MIT-style license that can be
	     * found in the LICENSE file at https://angular.io/license
	     */
	    var __extends$8 = (this && this.__extends) || function (d, b) {
	        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	    var modelGroupProvider = {
	        provide: ControlContainer,
	        useExisting: _angular_core.forwardRef(function () { return NgModelGroup; })
	    };
	    /**
	     * @whatItDoes Creates and binds a {@link FormGroup} instance to a DOM element.
	     *
	     * @howToUse
	     *
	     * This directive can only be used as a child of {@link NgForm} (or in other words,
	     * within `<form>` tags).
	     *
	     * Use this directive if you'd like to create a sub-group within a form. This can
	     * come in handy if you want to validate a sub-group of your form separately from
	     * the rest of your form, or if some values in your domain model make more sense to
	     * consume together in a nested object.
	     *
	     * Pass in the name you'd like this sub-group to have and it will become the key
	     * for the sub-group in the form's full value. You can also export the directive into
	     * a local template variable using `ngModelGroup` (ex: `#myGroup="ngModelGroup"`).
	     *
	     * {@example forms/ts/ngModelGroup/ng_model_group_example.ts region='Component'}
	     *
	     * * **npm package**: `@angular/forms`
	     *
	     * * **NgModule**: `FormsModule`
	     *
	     * @stable
	     */
	    var NgModelGroup = (function (_super) {
	        __extends$8(NgModelGroup, _super);
	        function NgModelGroup(parent, validators, asyncValidators) {
	            _super.call(this);
	            this._parent = parent;
	            this._validators = validators;
	            this._asyncValidators = asyncValidators;
	        }
	        /** @internal */
	        NgModelGroup.prototype._checkParentType = function () {
	            if (!(this._parent instanceof NgModelGroup) && !(this._parent instanceof NgForm)) {
	                TemplateDrivenErrors.modelGroupParentException();
	            }
	        };
	        NgModelGroup.decorators = [
	            { type: _angular_core.Directive, args: [{ selector: '[ngModelGroup]', providers: [modelGroupProvider], exportAs: 'ngModelGroup' },] },
	        ];
	        /** @nocollapse */
	        NgModelGroup.ctorParameters = [
	            { type: ControlContainer, decorators: [{ type: _angular_core.Host }, { type: _angular_core.SkipSelf },] },
	            { type: Array, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self }, { type: _angular_core.Inject, args: [NG_VALIDATORS,] },] },
	            { type: Array, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self }, { type: _angular_core.Inject, args: [NG_ASYNC_VALIDATORS,] },] },
	        ];
	        NgModelGroup.propDecorators = {
	            'name': [{ type: _angular_core.Input, args: ['ngModelGroup',] },],
	        };
	        return NgModelGroup;
	    }(AbstractFormGroupDirective));
	
	    /**
	     * @license
	     * Copyright Google Inc. All Rights Reserved.
	     *
	     * Use of this source code is governed by an MIT-style license that can be
	     * found in the LICENSE file at https://angular.io/license
	     */
	    var __extends$7 = (this && this.__extends) || function (d, b) {
	        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	    var formControlBinding = {
	        provide: NgControl,
	        useExisting: _angular_core.forwardRef(function () { return NgModel; })
	    };
	    var resolvedPromise$1 = Promise.resolve(null);
	    /**
	     * @whatItDoes Creates a {@link FormControl} instance from a domain model and binds it
	     * to a form control element.
	     *
	     * The {@link FormControl} instance will track the value, user interaction, and
	     * validation status of the control and keep the view synced with the model. If used
	     * within a parent form, the directive will also register itself with the form as a child
	     * control.
	     *
	     * @howToUse
	     *
	     * This directive can be used by itself or as part of a larger form. All you need is the
	     * `ngModel` selector to activate it.
	     *
	     * It accepts a domain model as an optional {@link @Input}. If you have a one-way binding
	     * to `ngModel` with `[]` syntax, changing the value of the domain model in the component
	     * class will set the value in the view. If you have a two-way binding with `[()]` syntax
	     * (also known as 'banana-box syntax'), the value in the UI will always be synced back to
	     * the domain model in your class as well.
	     *
	     * If you wish to inspect the properties of the associated {@link FormControl} (like
	     * validity state), you can also export the directive into a local template variable using
	     * `ngModel` as the key (ex: `#myVar="ngModel"`). You can then access the control using the
	     * directive's `control` property, but most properties you'll need (like `valid` and `dirty`)
	     * will fall through to the control anyway, so you can access them directly. You can see a
	     * full list of properties directly available in {@link AbstractControlDirective}.
	     *
	     * The following is an example of a simple standalone control using `ngModel`:
	     *
	     * {@example forms/ts/simpleNgModel/simple_ng_model_example.ts region='Component'}
	     *
	     * When using the `ngModel` within `<form>` tags, you'll also need to supply a `name` attribute
	     * so that the control can be registered with the parent form under that name.
	     *
	     * It's worth noting that in the context of a parent form, you often can skip one-way or
	     * two-way binding because the parent form will sync the value for you. You can access
	     * its properties by exporting it into a local template variable using `ngForm` (ex:
	     * `#f="ngForm"`). Then you can pass it where it needs to go on submit.
	     *
	     * If you do need to populate initial values into your form, using a one-way binding for
	     * `ngModel` tends to be sufficient as long as you use the exported form's value rather
	     * than the domain model's value on submit.
	     *
	     * Take a look at an example of using `ngModel` within a form:
	     *
	     * {@example forms/ts/simpleForm/simple_form_example.ts region='Component'}
	     *
	     * To see `ngModel` examples with different form control types, see:
	     *
	     * * Radio buttons: {@link RadioControlValueAccessor}
	     * * Selects: {@link SelectControlValueAccessor}
	     *
	     * **npm package**: `@angular/forms`
	     *
	     * **NgModule**: `FormsModule`
	     *
	     *  @stable
	     */
	    var NgModel = (function (_super) {
	        __extends$7(NgModel, _super);
	        function NgModel(parent, validators, asyncValidators, valueAccessors) {
	            _super.call(this);
	            /** @internal */
	            this._control = new FormControl();
	            /** @internal */
	            this._registered = false;
	            this.update = new EventEmitter();
	            this._parent = parent;
	            this._rawValidators = validators || [];
	            this._rawAsyncValidators = asyncValidators || [];
	            this.valueAccessor = selectValueAccessor(this, valueAccessors);
	        }
	        NgModel.prototype.ngOnChanges = function (changes) {
	            this._checkForErrors();
	            if (!this._registered)
	                this._setUpControl();
	            if ('isDisabled' in changes) {
	                this._updateDisabled(changes);
	            }
	            if (isPropertyUpdated(changes, this.viewModel)) {
	                this._updateValue(this.model);
	                this.viewModel = this.model;
	            }
	        };
	        NgModel.prototype.ngOnDestroy = function () { this.formDirective && this.formDirective.removeControl(this); };
	        Object.defineProperty(NgModel.prototype, "control", {
	            get: function () { return this._control; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(NgModel.prototype, "path", {
	            get: function () {
	                return this._parent ? controlPath(this.name, this._parent) : [this.name];
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(NgModel.prototype, "formDirective", {
	            get: function () { return this._parent ? this._parent.formDirective : null; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(NgModel.prototype, "validator", {
	            get: function () { return composeValidators(this._rawValidators); },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(NgModel.prototype, "asyncValidator", {
	            get: function () {
	                return composeAsyncValidators(this._rawAsyncValidators);
	            },
	            enumerable: true,
	            configurable: true
	        });
	        NgModel.prototype.viewToModelUpdate = function (newValue) {
	            this.viewModel = newValue;
	            this.update.emit(newValue);
	        };
	        NgModel.prototype._setUpControl = function () {
	            this._isStandalone() ? this._setUpStandalone() :
	                this.formDirective.addControl(this);
	            this._registered = true;
	        };
	        NgModel.prototype._isStandalone = function () {
	            return !this._parent || (this.options && this.options.standalone);
	        };
	        NgModel.prototype._setUpStandalone = function () {
	            setUpControl(this._control, this);
	            this._control.updateValueAndValidity({ emitEvent: false });
	        };
	        NgModel.prototype._checkForErrors = function () {
	            if (!this._isStandalone()) {
	                this._checkParentType();
	            }
	            this._checkName();
	        };
	        NgModel.prototype._checkParentType = function () {
	            if (!(this._parent instanceof NgModelGroup) &&
	                this._parent instanceof AbstractFormGroupDirective) {
	                TemplateDrivenErrors.formGroupNameException();
	            }
	            else if (!(this._parent instanceof NgModelGroup) && !(this._parent instanceof NgForm)) {
	                TemplateDrivenErrors.modelParentException();
	            }
	        };
	        NgModel.prototype._checkName = function () {
	            if (this.options && this.options.name)
	                this.name = this.options.name;
	            if (!this._isStandalone() && !this.name) {
	                TemplateDrivenErrors.missingNameException();
	            }
	        };
	        NgModel.prototype._updateValue = function (value) {
	            var _this = this;
	            resolvedPromise$1.then(function () { _this.control.setValue(value, { emitViewToModelChange: false }); });
	        };
	        NgModel.prototype._updateDisabled = function (changes) {
	            var _this = this;
	            var disabledValue = changes['isDisabled'].currentValue;
	            var isDisabled = disabledValue === '' || (disabledValue && disabledValue !== 'false');
	            resolvedPromise$1.then(function () {
	                if (isDisabled && !_this.control.disabled) {
	                    _this.control.disable();
	                }
	                else if (!isDisabled && _this.control.disabled) {
	                    _this.control.enable();
	                }
	            });
	        };
	        NgModel.decorators = [
	            { type: _angular_core.Directive, args: [{
	                        selector: '[ngModel]:not([formControlName]):not([formControl])',
	                        providers: [formControlBinding],
	                        exportAs: 'ngModel'
	                    },] },
	        ];
	        /** @nocollapse */
	        NgModel.ctorParameters = [
	            { type: ControlContainer, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Host },] },
	            { type: Array, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self }, { type: _angular_core.Inject, args: [NG_VALIDATORS,] },] },
	            { type: Array, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self }, { type: _angular_core.Inject, args: [NG_ASYNC_VALIDATORS,] },] },
	            { type: Array, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self }, { type: _angular_core.Inject, args: [NG_VALUE_ACCESSOR,] },] },
	        ];
	        NgModel.propDecorators = {
	            'name': [{ type: _angular_core.Input },],
	            'isDisabled': [{ type: _angular_core.Input, args: ['disabled',] },],
	            'model': [{ type: _angular_core.Input, args: ['ngModel',] },],
	            'options': [{ type: _angular_core.Input, args: ['ngModelOptions',] },],
	            'update': [{ type: _angular_core.Output, args: ['ngModelChange',] },],
	        };
	        return NgModel;
	    }(NgControl));
	
	    var ReactiveErrors = (function () {
	        function ReactiveErrors() {
	        }
	        ReactiveErrors.controlParentException = function () {
	            throw new Error("formControlName must be used with a parent formGroup directive.  You'll want to add a formGroup\n       directive and pass it an existing FormGroup instance (you can create one in your class).\n\n      Example:\n\n      " + Examples.formControlName);
	        };
	        ReactiveErrors.ngModelGroupException = function () {
	            throw new Error("formControlName cannot be used with an ngModelGroup parent. It is only compatible with parents\n       that also have a \"form\" prefix: formGroupName, formArrayName, or formGroup.\n\n       Option 1:  Update the parent to be formGroupName (reactive form strategy)\n\n        " + Examples.formGroupName + "\n\n        Option 2: Use ngModel instead of formControlName (template-driven strategy)\n\n        " + Examples.ngModelGroup);
	        };
	        ReactiveErrors.missingFormException = function () {
	            throw new Error("formGroup expects a FormGroup instance. Please pass one in.\n\n       Example:\n\n       " + Examples.formControlName);
	        };
	        ReactiveErrors.groupParentException = function () {
	            throw new Error("formGroupName must be used with a parent formGroup directive.  You'll want to add a formGroup\n      directive and pass it an existing FormGroup instance (you can create one in your class).\n\n      Example:\n\n      " + Examples.formGroupName);
	        };
	        ReactiveErrors.arrayParentException = function () {
	            throw new Error("formArrayName must be used with a parent formGroup directive.  You'll want to add a formGroup\n       directive and pass it an existing FormGroup instance (you can create one in your class).\n\n        Example:\n\n        " + Examples.formArrayName);
	        };
	        ReactiveErrors.disabledAttrWarning = function () {
	            console.warn("\n      It looks like you're using the disabled attribute with a reactive form directive. If you set disabled to true\n      when you set up this control in your component class, the disabled attribute will actually be set in the DOM for\n      you. We recommend using this approach to avoid 'changed after checked' errors.\n       \n      Example: \n      form = new FormGroup({\n        first: new FormControl({value: 'Nancy', disabled: true}, Validators.required),\n        last: new FormControl('Drew', Validators.required)\n      });\n    ");
	        };
	        return ReactiveErrors;
	    }());
	
	    /**
	     * @license
	     * Copyright Google Inc. All Rights Reserved.
	     *
	     * Use of this source code is governed by an MIT-style license that can be
	     * found in the LICENSE file at https://angular.io/license
	     */
	    var __extends$9 = (this && this.__extends) || function (d, b) {
	        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	    var formControlBinding$1 = {
	        provide: NgControl,
	        useExisting: _angular_core.forwardRef(function () { return FormControlDirective; })
	    };
	    /**
	     * @whatItDoes Syncs a standalone {@link FormControl} instance to a form control element.
	     *
	     * In other words, this directive ensures that any values written to the {@link FormControl}
	     * instance programmatically will be written to the DOM element (model -> view). Conversely,
	     * any values written to the DOM element through user input will be reflected in the
	     * {@link FormControl} instance (view -> model).
	     *
	     * @howToUse
	     *
	     * Use this directive if you'd like to create and manage a {@link FormControl} instance directly.
	     * Simply create a {@link FormControl}, save it to your component class, and pass it into the
	     * {@link FormControlDirective}.
	     *
	     * This directive is designed to be used as a standalone control.  Unlike {@link FormControlName},
	     * it does not require that your {@link FormControl} instance be part of any parent
	     * {@link FormGroup}, and it won't be registered to any {@link FormGroupDirective} that
	     * exists above it.
	     *
	     * **Get the value**: the `value` property is always synced and available on the
	     * {@link FormControl} instance. See a full list of available properties in
	     * {@link AbstractControl}.
	     *
	     * **Set the value**: You can pass in an initial value when instantiating the {@link FormControl},
	     * or you can set it programmatically later using {@link AbstractControl.setValue} or
	     * {@link AbstractControl.patchValue}.
	     *
	     * **Listen to value**: If you want to listen to changes in the value of the control, you can
	     * subscribe to the {@link AbstractControl.valueChanges} event.  You can also listen to
	     * {@link AbstractControl.statusChanges} to be notified when the validation status is
	     * re-calculated.
	     *
	     * ### Example
	     *
	     * {@example forms/ts/simpleFormControl/simple_form_control_example.ts region='Component'}
	     *
	     * * **npm package**: `@angular/forms`
	     *
	     * * **NgModule**: `ReactiveFormsModule`
	     *
	     *  @stable
	     */
	    var FormControlDirective = (function (_super) {
	        __extends$9(FormControlDirective, _super);
	        function FormControlDirective(validators, asyncValidators, valueAccessors) {
	            _super.call(this);
	            this.update = new EventEmitter();
	            this._rawValidators = validators || [];
	            this._rawAsyncValidators = asyncValidators || [];
	            this.valueAccessor = selectValueAccessor(this, valueAccessors);
	        }
	        Object.defineProperty(FormControlDirective.prototype, "isDisabled", {
	            set: function (isDisabled) { ReactiveErrors.disabledAttrWarning(); },
	            enumerable: true,
	            configurable: true
	        });
	        FormControlDirective.prototype.ngOnChanges = function (changes) {
	            if (this._isControlChanged(changes)) {
	                setUpControl(this.form, this);
	                if (this.control.disabled && this.valueAccessor.setDisabledState) {
	                    this.valueAccessor.setDisabledState(true);
	                }
	                this.form.updateValueAndValidity({ emitEvent: false });
	            }
	            if (isPropertyUpdated(changes, this.viewModel)) {
	                this.form.setValue(this.model);
	                this.viewModel = this.model;
	            }
	        };
	        Object.defineProperty(FormControlDirective.prototype, "path", {
	            get: function () { return []; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(FormControlDirective.prototype, "validator", {
	            get: function () { return composeValidators(this._rawValidators); },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(FormControlDirective.prototype, "asyncValidator", {
	            get: function () {
	                return composeAsyncValidators(this._rawAsyncValidators);
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(FormControlDirective.prototype, "control", {
	            get: function () { return this.form; },
	            enumerable: true,
	            configurable: true
	        });
	        FormControlDirective.prototype.viewToModelUpdate = function (newValue) {
	            this.viewModel = newValue;
	            this.update.emit(newValue);
	        };
	        FormControlDirective.prototype._isControlChanged = function (changes) {
	            return changes.hasOwnProperty('form');
	        };
	        FormControlDirective.decorators = [
	            { type: _angular_core.Directive, args: [{ selector: '[formControl]', providers: [formControlBinding$1], exportAs: 'ngForm' },] },
	        ];
	        /** @nocollapse */
	        FormControlDirective.ctorParameters = [
	            { type: Array, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self }, { type: _angular_core.Inject, args: [NG_VALIDATORS,] },] },
	            { type: Array, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self }, { type: _angular_core.Inject, args: [NG_ASYNC_VALIDATORS,] },] },
	            { type: Array, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self }, { type: _angular_core.Inject, args: [NG_VALUE_ACCESSOR,] },] },
	        ];
	        FormControlDirective.propDecorators = {
	            'form': [{ type: _angular_core.Input, args: ['formControl',] },],
	            'model': [{ type: _angular_core.Input, args: ['ngModel',] },],
	            'update': [{ type: _angular_core.Output, args: ['ngModelChange',] },],
	            'isDisabled': [{ type: _angular_core.Input, args: ['disabled',] },],
	        };
	        return FormControlDirective;
	    }(NgControl));
	
	    /**
	     * @license
	     * Copyright Google Inc. All Rights Reserved.
	     *
	     * Use of this source code is governed by an MIT-style license that can be
	     * found in the LICENSE file at https://angular.io/license
	     */
	    var __extends$11 = (this && this.__extends) || function (d, b) {
	        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	    var formDirectiveProvider$1 = {
	        provide: ControlContainer,
	        useExisting: _angular_core.forwardRef(function () { return FormGroupDirective; })
	    };
	    /**
	     * @whatItDoes Binds an existing {@link FormGroup} to a DOM element.
	     *
	     * @howToUse
	     *
	     * This directive accepts an existing {@link FormGroup} instance. It will then use this
	     * {@link FormGroup} instance to match any child {@link FormControl}, {@link FormGroup},
	     * and {@link FormArray} instances to child {@link FormControlName}, {@link FormGroupName},
	     * and {@link FormArrayName} directives.
	     *
	     * **Set value**: You can set the form's initial value when instantiating the
	     * {@link FormGroup}, or you can set it programmatically later using the {@link FormGroup}'s
	     * {@link AbstractControl.setValue} or {@link AbstractControl.patchValue} methods.
	     *
	     * **Listen to value**: If you want to listen to changes in the value of the form, you can subscribe
	     * to the {@link FormGroup}'s {@link AbstractControl.valueChanges} event.  You can also listen to
	     * its {@link AbstractControl.statusChanges} event to be notified when the validation status is
	     * re-calculated.
	     *
	     * Furthermore, you can listen to the directive's `ngSubmit` event to be notified when the user has
	     * triggered a form submission. The `ngSubmit` event will be emitted with the original form
	     * submission event.
	     *
	     * ### Example
	     *
	     * In this example, we create form controls for first name and last name.
	     *
	     * {@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
	     *
	     * **npm package**: `@angular/forms`
	     *
	     * **NgModule**: {@link ReactiveFormsModule}
	     *
	     *  @stable
	     */
	    var FormGroupDirective = (function (_super) {
	        __extends$11(FormGroupDirective, _super);
	        function FormGroupDirective(_validators, _asyncValidators) {
	            _super.call(this);
	            this._validators = _validators;
	            this._asyncValidators = _asyncValidators;
	            this._submitted = false;
	            this.directives = [];
	            this.form = null;
	            this.ngSubmit = new EventEmitter();
	        }
	        FormGroupDirective.prototype.ngOnChanges = function (changes) {
	            this._checkFormPresent();
	            if (changes.hasOwnProperty('form')) {
	                this._updateValidators();
	                this._updateDomValue();
	                this._updateRegistrations();
	            }
	        };
	        Object.defineProperty(FormGroupDirective.prototype, "submitted", {
	            get: function () { return this._submitted; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(FormGroupDirective.prototype, "formDirective", {
	            get: function () { return this; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(FormGroupDirective.prototype, "control", {
	            get: function () { return this.form; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(FormGroupDirective.prototype, "path", {
	            get: function () { return []; },
	            enumerable: true,
	            configurable: true
	        });
	        FormGroupDirective.prototype.addControl = function (dir) {
	            var ctrl = this.form.get(dir.path);
	            setUpControl(ctrl, dir);
	            ctrl.updateValueAndValidity({ emitEvent: false });
	            this.directives.push(dir);
	            return ctrl;
	        };
	        FormGroupDirective.prototype.getControl = function (dir) { return this.form.get(dir.path); };
	        FormGroupDirective.prototype.removeControl = function (dir) { ListWrapper.remove(this.directives, dir); };
	        FormGroupDirective.prototype.addFormGroup = function (dir) {
	            var ctrl = this.form.get(dir.path);
	            setUpFormContainer(ctrl, dir);
	            ctrl.updateValueAndValidity({ emitEvent: false });
	        };
	        FormGroupDirective.prototype.removeFormGroup = function (dir) { };
	        FormGroupDirective.prototype.getFormGroup = function (dir) { return this.form.get(dir.path); };
	        FormGroupDirective.prototype.addFormArray = function (dir) {
	            var ctrl = this.form.get(dir.path);
	            setUpFormContainer(ctrl, dir);
	            ctrl.updateValueAndValidity({ emitEvent: false });
	        };
	        FormGroupDirective.prototype.removeFormArray = function (dir) { };
	        FormGroupDirective.prototype.getFormArray = function (dir) { return this.form.get(dir.path); };
	        FormGroupDirective.prototype.updateModel = function (dir, value) {
	            var ctrl = this.form.get(dir.path);
	            ctrl.setValue(value);
	        };
	        FormGroupDirective.prototype.onSubmit = function ($event) {
	            this._submitted = true;
	            this.ngSubmit.emit($event);
	            return false;
	        };
	        FormGroupDirective.prototype.onReset = function () { this.resetForm(); };
	        FormGroupDirective.prototype.resetForm = function (value) {
	            if (value === void 0) { value = undefined; }
	            this.form.reset(value);
	            this._submitted = false;
	        };
	        /** @internal */
	        FormGroupDirective.prototype._updateDomValue = function () {
	            var _this = this;
	            this.directives.forEach(function (dir) {
	                var newCtrl = _this.form.get(dir.path);
	                if (dir._control !== newCtrl) {
	                    cleanUpControl(dir._control, dir);
	                    if (newCtrl)
	                        setUpControl(newCtrl, dir);
	                    dir._control = newCtrl;
	                }
	            });
	            this.form._updateTreeValidity({ emitEvent: false });
	        };
	        FormGroupDirective.prototype._updateRegistrations = function () {
	            var _this = this;
	            this.form._registerOnCollectionChange(function () { return _this._updateDomValue(); });
	            if (this._oldForm)
	                this._oldForm._registerOnCollectionChange(function () { });
	            this._oldForm = this.form;
	        };
	        FormGroupDirective.prototype._updateValidators = function () {
	            var sync = composeValidators(this._validators);
	            this.form.validator = Validators.compose([this.form.validator, sync]);
	            var async = composeAsyncValidators(this._asyncValidators);
	            this.form.asyncValidator = Validators.composeAsync([this.form.asyncValidator, async]);
	        };
	        FormGroupDirective.prototype._checkFormPresent = function () {
	            if (!this.form) {
	                ReactiveErrors.missingFormException();
	            }
	        };
	        FormGroupDirective.decorators = [
	            { type: _angular_core.Directive, args: [{
	                        selector: '[formGroup]',
	                        providers: [formDirectiveProvider$1],
	                        host: { '(submit)': 'onSubmit($event)', '(reset)': 'onReset()' },
	                        exportAs: 'ngForm'
	                    },] },
	        ];
	        /** @nocollapse */
	        FormGroupDirective.ctorParameters = [
	            { type: Array, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self }, { type: _angular_core.Inject, args: [NG_VALIDATORS,] },] },
	            { type: Array, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self }, { type: _angular_core.Inject, args: [NG_ASYNC_VALIDATORS,] },] },
	        ];
	        FormGroupDirective.propDecorators = {
	            'form': [{ type: _angular_core.Input, args: ['formGroup',] },],
	            'ngSubmit': [{ type: _angular_core.Output },],
	        };
	        return FormGroupDirective;
	    }(ControlContainer));
	
	    /**
	     * @license
	     * Copyright Google Inc. All Rights Reserved.
	     *
	     * Use of this source code is governed by an MIT-style license that can be
	     * found in the LICENSE file at https://angular.io/license
	     */
	    var __extends$12 = (this && this.__extends) || function (d, b) {
	        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	    var formGroupNameProvider = {
	        provide: ControlContainer,
	        useExisting: _angular_core.forwardRef(function () { return FormGroupName; })
	    };
	    /**
	     * @whatItDoes Syncs a nested {@link FormGroup} to a DOM element.
	     *
	     * @howToUse
	     *
	     * This directive can only be used with a parent {@link FormGroupDirective} (selector:
	     * `[formGroup]`).
	     *
	     * It accepts the string name of the nested {@link FormGroup} you want to link, and
	     * will look for a {@link FormGroup} registered with that name in the parent
	     * {@link FormGroup} instance you passed into {@link FormGroupDirective}.
	     *
	     * Nested form groups can come in handy when you want to validate a sub-group of a
	     * form separately from the rest or when you'd like to group the values of certain
	     * controls into their own nested object.
	     *
	     * **Access the group**: You can access the associated {@link FormGroup} using the
	     * {@link AbstractControl.get} method. Ex: `this.form.get('name')`.
	     *
	     * You can also access individual controls within the group using dot syntax.
	     * Ex: `this.form.get('name.first')`
	     *
	     * **Get the value**: the `value` property is always synced and available on the
	     * {@link FormGroup}. See a full list of available properties in {@link AbstractControl}.
	     *
	     * **Set the value**: You can set an initial value for each child control when instantiating
	     * the {@link FormGroup}, or you can set it programmatically later using
	     * {@link AbstractControl.setValue} or {@link AbstractControl.patchValue}.
	     *
	     * **Listen to value**: If you want to listen to changes in the value of the group, you can
	     * subscribe to the {@link AbstractControl.valueChanges} event.  You can also listen to
	     * {@link AbstractControl.statusChanges} to be notified when the validation status is
	     * re-calculated.
	     *
	     * ### Example
	     *
	     * {@example forms/ts/nestedFormGroup/nested_form_group_example.ts region='Component'}
	     *
	     * * **npm package**: `@angular/forms`
	     *
	     * * **NgModule**: `ReactiveFormsModule`
	     *
	     * @stable
	     */
	    var FormGroupName = (function (_super) {
	        __extends$12(FormGroupName, _super);
	        function FormGroupName(parent, validators, asyncValidators) {
	            _super.call(this);
	            this._parent = parent;
	            this._validators = validators;
	            this._asyncValidators = asyncValidators;
	        }
	        /** @internal */
	        FormGroupName.prototype._checkParentType = function () {
	            if (_hasInvalidParent(this._parent)) {
	                ReactiveErrors.groupParentException();
	            }
	        };
	        FormGroupName.decorators = [
	            { type: _angular_core.Directive, args: [{ selector: '[formGroupName]', providers: [formGroupNameProvider] },] },
	        ];
	        /** @nocollapse */
	        FormGroupName.ctorParameters = [
	            { type: ControlContainer, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Host }, { type: _angular_core.SkipSelf },] },
	            { type: Array, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self }, { type: _angular_core.Inject, args: [NG_VALIDATORS,] },] },
	            { type: Array, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self }, { type: _angular_core.Inject, args: [NG_ASYNC_VALIDATORS,] },] },
	        ];
	        FormGroupName.propDecorators = {
	            'name': [{ type: _angular_core.Input, args: ['formGroupName',] },],
	        };
	        return FormGroupName;
	    }(AbstractFormGroupDirective));
	    var formArrayNameProvider = {
	        provide: ControlContainer,
	        useExisting: _angular_core.forwardRef(function () { return FormArrayName; })
	    };
	    /**
	     * @whatItDoes Syncs a nested {@link FormArray} to a DOM element.
	     *
	     * @howToUse
	     *
	     * This directive is designed to be used with a parent {@link FormGroupDirective} (selector:
	     * `[formGroup]`).
	     *
	     * It accepts the string name of the nested {@link FormArray} you want to link, and
	     * will look for a {@link FormArray} registered with that name in the parent
	     * {@link FormGroup} instance you passed into {@link FormGroupDirective}.
	     *
	     * Nested form arrays can come in handy when you have a group of form controls but
	     * you're not sure how many there will be. Form arrays allow you to create new
	     * form controls dynamically.
	     *
	     * **Access the array**: You can access the associated {@link FormArray} using the
	     * {@link AbstractControl.get} method on the parent {@link FormGroup}.
	     * Ex: `this.form.get('cities')`.
	     *
	     * **Get the value**: the `value` property is always synced and available on the
	     * {@link FormArray}. See a full list of available properties in {@link AbstractControl}.
	     *
	     * **Set the value**: You can set an initial value for each child control when instantiating
	     * the {@link FormArray}, or you can set the value programmatically later using the
	     * {@link FormArray}'s {@link AbstractControl.setValue} or {@link AbstractControl.patchValue}
	     * methods.
	     *
	     * **Listen to value**: If you want to listen to changes in the value of the array, you can
	     * subscribe to the {@link FormArray}'s {@link AbstractControl.valueChanges} event.  You can also
	     * listen to its {@link AbstractControl.statusChanges} event to be notified when the validation
	     * status is re-calculated.
	     *
	     * **Add new controls**: You can add new controls to the {@link FormArray} dynamically by
	     * calling its {@link FormArray.push} method.
	     *  Ex: `this.form.get('cities').push(new FormControl());`
	     *
	     * ### Example
	     *
	     * {@example forms/ts/nestedFormArray/nested_form_array_example.ts region='Component'}
	     *
	     * * **npm package**: `@angular/forms`
	     *
	     * * **NgModule**: `ReactiveFormsModule`
	     *
	     * @stable
	     */
	    var FormArrayName = (function (_super) {
	        __extends$12(FormArrayName, _super);
	        function FormArrayName(parent, validators, asyncValidators) {
	            _super.call(this);
	            this._parent = parent;
	            this._validators = validators;
	            this._asyncValidators = asyncValidators;
	        }
	        FormArrayName.prototype.ngOnInit = function () {
	            this._checkParentType();
	            this.formDirective.addFormArray(this);
	        };
	        FormArrayName.prototype.ngOnDestroy = function () {
	            if (this.formDirective) {
	                this.formDirective.removeFormArray(this);
	            }
	        };
	        Object.defineProperty(FormArrayName.prototype, "control", {
	            get: function () { return this.formDirective.getFormArray(this); },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(FormArrayName.prototype, "formDirective", {
	            get: function () {
	                return this._parent ? this._parent.formDirective : null;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(FormArrayName.prototype, "path", {
	            get: function () { return controlPath(this.name, this._parent); },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(FormArrayName.prototype, "validator", {
	            get: function () { return composeValidators(this._validators); },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(FormArrayName.prototype, "asyncValidator", {
	            get: function () { return composeAsyncValidators(this._asyncValidators); },
	            enumerable: true,
	            configurable: true
	        });
	        FormArrayName.prototype._checkParentType = function () {
	            if (_hasInvalidParent(this._parent)) {
	                ReactiveErrors.arrayParentException();
	            }
	        };
	        FormArrayName.decorators = [
	            { type: _angular_core.Directive, args: [{ selector: '[formArrayName]', providers: [formArrayNameProvider] },] },
	        ];
	        /** @nocollapse */
	        FormArrayName.ctorParameters = [
	            { type: ControlContainer, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Host }, { type: _angular_core.SkipSelf },] },
	            { type: Array, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self }, { type: _angular_core.Inject, args: [NG_VALIDATORS,] },] },
	            { type: Array, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self }, { type: _angular_core.Inject, args: [NG_ASYNC_VALIDATORS,] },] },
	        ];
	        FormArrayName.propDecorators = {
	            'name': [{ type: _angular_core.Input, args: ['formArrayName',] },],
	        };
	        return FormArrayName;
	    }(ControlContainer));
	    function _hasInvalidParent(parent) {
	        return !(parent instanceof FormGroupName) && !(parent instanceof FormGroupDirective) &&
	            !(parent instanceof FormArrayName);
	    }
	
	    /**
	     * @license
	     * Copyright Google Inc. All Rights Reserved.
	     *
	     * Use of this source code is governed by an MIT-style license that can be
	     * found in the LICENSE file at https://angular.io/license
	     */
	    var __extends$10 = (this && this.__extends) || function (d, b) {
	        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	    var controlNameBinding = {
	        provide: NgControl,
	        useExisting: _angular_core.forwardRef(function () { return FormControlName; })
	    };
	    /**
	     * @whatItDoes  Syncs a {@link FormControl} in an existing {@link FormGroup} to a form control
	     * element by name.
	     *
	     * In other words, this directive ensures that any values written to the {@link FormControl}
	     * instance programmatically will be written to the DOM element (model -> view). Conversely,
	     * any values written to the DOM element through user input will be reflected in the
	     * {@link FormControl} instance (view -> model).
	     *
	     * @howToUse
	     *
	     * This directive is designed to be used with a parent {@link FormGroupDirective} (selector:
	     * `[formGroup]`).
	     *
	     * It accepts the string name of the {@link FormControl} instance you want to
	     * link, and will look for a {@link FormControl} registered with that name in the
	     * closest {@link FormGroup} or {@link FormArray} above it.
	     *
	     * **Access the control**: You can access the {@link FormControl} associated with
	     * this directive by using the {@link AbstractControl.get} method.
	     * Ex: `this.form.get('first');`
	     *
	     * **Get value**: the `value` property is always synced and available on the {@link FormControl}.
	     * See a full list of available properties in {@link AbstractControl}.
	     *
	     *  **Set value**: You can set an initial value for the control when instantiating the
	     *  {@link FormControl}, or you can set it programmatically later using
	     *  {@link AbstractControl.setValue} or {@link AbstractControl.patchValue}.
	     *
	     * **Listen to value**: If you want to listen to changes in the value of the control, you can
	     * subscribe to the {@link AbstractControl.valueChanges} event.  You can also listen to
	     * {@link AbstractControl.statusChanges} to be notified when the validation status is
	     * re-calculated.
	     *
	     * ### Example
	     *
	     * In this example, we create form controls for first name and last name.
	     *
	     * {@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
	     *
	     * To see `formControlName` examples with different form control types, see:
	     *
	     * * Radio buttons: {@link RadioControlValueAccessor}
	     * * Selects: {@link SelectControlValueAccessor}
	     *
	     * **npm package**: `@angular/forms`
	     *
	     * **NgModule**: {@link ReactiveFormsModule}
	     *
	     *  @stable
	     */
	    var FormControlName = (function (_super) {
	        __extends$10(FormControlName, _super);
	        function FormControlName(parent, validators, asyncValidators, valueAccessors) {
	            _super.call(this);
	            this._added = false;
	            this.update = new EventEmitter();
	            this._parent = parent;
	            this._rawValidators = validators || [];
	            this._rawAsyncValidators = asyncValidators || [];
	            this.valueAccessor = selectValueAccessor(this, valueAccessors);
	        }
	        Object.defineProperty(FormControlName.prototype, "isDisabled", {
	            set: function (isDisabled) { ReactiveErrors.disabledAttrWarning(); },
	            enumerable: true,
	            configurable: true
	        });
	        FormControlName.prototype.ngOnChanges = function (changes) {
	            if (!this._added)
	                this._setUpControl();
	            if (isPropertyUpdated(changes, this.viewModel)) {
	                this.viewModel = this.model;
	                this.formDirective.updateModel(this, this.model);
	            }
	        };
	        FormControlName.prototype.ngOnDestroy = function () {
	            if (this.formDirective) {
	                this.formDirective.removeControl(this);
	            }
	        };
	        FormControlName.prototype.viewToModelUpdate = function (newValue) {
	            this.viewModel = newValue;
	            this.update.emit(newValue);
	        };
	        Object.defineProperty(FormControlName.prototype, "path", {
	            get: function () { return controlPath(this.name, this._parent); },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(FormControlName.prototype, "formDirective", {
	            get: function () { return this._parent ? this._parent.formDirective : null; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(FormControlName.prototype, "validator", {
	            get: function () { return composeValidators(this._rawValidators); },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(FormControlName.prototype, "asyncValidator", {
	            get: function () {
	                return composeAsyncValidators(this._rawAsyncValidators);
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(FormControlName.prototype, "control", {
	            get: function () { return this._control; },
	            enumerable: true,
	            configurable: true
	        });
	        FormControlName.prototype._checkParentType = function () {
	            if (!(this._parent instanceof FormGroupName) &&
	                this._parent instanceof AbstractFormGroupDirective) {
	                ReactiveErrors.ngModelGroupException();
	            }
	            else if (!(this._parent instanceof FormGroupName) && !(this._parent instanceof FormGroupDirective) &&
	                !(this._parent instanceof FormArrayName)) {
	                ReactiveErrors.controlParentException();
	            }
	        };
	        FormControlName.prototype._setUpControl = function () {
	            this._checkParentType();
	            this._control = this.formDirective.addControl(this);
	            if (this.control.disabled && this.valueAccessor.setDisabledState) {
	                this.valueAccessor.setDisabledState(true);
	            }
	            this._added = true;
	        };
	        FormControlName.decorators = [
	            { type: _angular_core.Directive, args: [{ selector: '[formControlName]', providers: [controlNameBinding] },] },
	        ];
	        /** @nocollapse */
	        FormControlName.ctorParameters = [
	            { type: ControlContainer, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Host }, { type: _angular_core.SkipSelf },] },
	            { type: Array, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self }, { type: _angular_core.Inject, args: [NG_VALIDATORS,] },] },
	            { type: Array, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self }, { type: _angular_core.Inject, args: [NG_ASYNC_VALIDATORS,] },] },
	            { type: Array, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self }, { type: _angular_core.Inject, args: [NG_VALUE_ACCESSOR,] },] },
	        ];
	        FormControlName.propDecorators = {
	            'name': [{ type: _angular_core.Input, args: ['formControlName',] },],
	            'model': [{ type: _angular_core.Input, args: ['ngModel',] },],
	            'update': [{ type: _angular_core.Output, args: ['ngModelChange',] },],
	            'isDisabled': [{ type: _angular_core.Input, args: ['disabled',] },],
	        };
	        return FormControlName;
	    }(NgControl));
	
	    var REQUIRED_VALIDATOR = {
	        provide: NG_VALIDATORS,
	        useExisting: _angular_core.forwardRef(function () { return RequiredValidator; }),
	        multi: true
	    };
	    /**
	     * A Directive that adds the `required` validator to any controls marked with the
	     * `required` attribute, via the {@link NG_VALIDATORS} binding.
	     *
	     * ### Example
	     *
	     * ```
	     * <input name="fullName" ngModel required>
	     * ```
	     *
	     * @stable
	     */
	    var RequiredValidator = (function () {
	        function RequiredValidator() {
	        }
	        Object.defineProperty(RequiredValidator.prototype, "required", {
	            get: function () { return this._required; },
	            set: function (value) {
	                this._required = isPresent(value) && "" + value !== 'false';
	                if (this._onChange)
	                    this._onChange();
	            },
	            enumerable: true,
	            configurable: true
	        });
	        RequiredValidator.prototype.validate = function (c) {
	            return this.required ? Validators.required(c) : null;
	        };
	        RequiredValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
	        RequiredValidator.decorators = [
	            { type: _angular_core.Directive, args: [{
	                        selector: '[required][formControlName],[required][formControl],[required][ngModel]',
	                        providers: [REQUIRED_VALIDATOR],
	                        host: { '[attr.required]': 'required? "" : null' }
	                    },] },
	        ];
	        /** @nocollapse */
	        RequiredValidator.ctorParameters = [];
	        RequiredValidator.propDecorators = {
	            'required': [{ type: _angular_core.Input },],
	        };
	        return RequiredValidator;
	    }());
	    /**
	     * Provider which adds {@link MinLengthValidator} to {@link NG_VALIDATORS}.
	     *
	     * ## Example:
	     *
	     * {@example common/forms/ts/validators/validators.ts region='min'}
	     */
	    var MIN_LENGTH_VALIDATOR = {
	        provide: NG_VALIDATORS,
	        useExisting: _angular_core.forwardRef(function () { return MinLengthValidator; }),
	        multi: true
	    };
	    /**
	     * A directive which installs the {@link MinLengthValidator} for any `formControlName`,
	     * `formControl`, or control with `ngModel` that also has a `minlength` attribute.
	     *
	     * @stable
	     */
	    var MinLengthValidator = (function () {
	        function MinLengthValidator() {
	        }
	        MinLengthValidator.prototype._createValidator = function () {
	            this._validator = Validators.minLength(parseInt(this.minlength, 10));
	        };
	        MinLengthValidator.prototype.ngOnChanges = function (changes) {
	            if (changes['minlength']) {
	                this._createValidator();
	                if (this._onChange)
	                    this._onChange();
	            }
	        };
	        MinLengthValidator.prototype.validate = function (c) {
	            return isPresent(this.minlength) ? this._validator(c) : null;
	        };
	        MinLengthValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
	        MinLengthValidator.decorators = [
	            { type: _angular_core.Directive, args: [{
	                        selector: '[minlength][formControlName],[minlength][formControl],[minlength][ngModel]',
	                        providers: [MIN_LENGTH_VALIDATOR],
	                        host: { '[attr.minlength]': 'minlength? minlength : null' }
	                    },] },
	        ];
	        /** @nocollapse */
	        MinLengthValidator.ctorParameters = [];
	        MinLengthValidator.propDecorators = {
	            'minlength': [{ type: _angular_core.Input },],
	        };
	        return MinLengthValidator;
	    }());
	    /**
	     * Provider which adds {@link MaxLengthValidator} to {@link NG_VALIDATORS}.
	     *
	     * ## Example:
	     *
	     * {@example common/forms/ts/validators/validators.ts region='max'}
	     */
	    var MAX_LENGTH_VALIDATOR = {
	        provide: NG_VALIDATORS,
	        useExisting: _angular_core.forwardRef(function () { return MaxLengthValidator; }),
	        multi: true
	    };
	    /**
	     * A directive which installs the {@link MaxLengthValidator} for any `formControlName,
	     * `formControl`,
	     * or control with `ngModel` that also has a `maxlength` attribute.
	     *
	     * @stable
	     */
	    var MaxLengthValidator = (function () {
	        function MaxLengthValidator() {
	        }
	        MaxLengthValidator.prototype._createValidator = function () {
	            this._validator = Validators.maxLength(parseInt(this.maxlength, 10));
	        };
	        MaxLengthValidator.prototype.ngOnChanges = function (changes) {
	            if (changes['maxlength']) {
	                this._createValidator();
	                if (this._onChange)
	                    this._onChange();
	            }
	        };
	        MaxLengthValidator.prototype.validate = function (c) {
	            return isPresent(this.maxlength) ? this._validator(c) : null;
	        };
	        MaxLengthValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
	        MaxLengthValidator.decorators = [
	            { type: _angular_core.Directive, args: [{
	                        selector: '[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]',
	                        providers: [MAX_LENGTH_VALIDATOR],
	                        host: { '[attr.maxlength]': 'maxlength? maxlength : null' }
	                    },] },
	        ];
	        /** @nocollapse */
	        MaxLengthValidator.ctorParameters = [];
	        MaxLengthValidator.propDecorators = {
	            'maxlength': [{ type: _angular_core.Input },],
	        };
	        return MaxLengthValidator;
	    }());
	    var PATTERN_VALIDATOR = {
	        provide: NG_VALIDATORS,
	        useExisting: _angular_core.forwardRef(function () { return PatternValidator; }),
	        multi: true
	    };
	    /**
	     * A Directive that adds the `pattern` validator to any controls marked with the
	     * `pattern` attribute, via the {@link NG_VALIDATORS} binding. Uses attribute value
	     * as the regex to validate Control value against.  Follows pattern attribute
	     * semantics; i.e. regex must match entire Control value.
	     *
	     * ### Example
	     *
	     * ```
	     * <input [name]="fullName" pattern="[a-zA-Z ]*" ngModel>
	     * ```
	     * @stable
	     */
	    var PatternValidator = (function () {
	        function PatternValidator() {
	        }
	        PatternValidator.prototype._createValidator = function () { this._validator = Validators.pattern(this.pattern); };
	        PatternValidator.prototype.ngOnChanges = function (changes) {
	            if (changes['pattern']) {
	                this._createValidator();
	                if (this._onChange)
	                    this._onChange();
	            }
	        };
	        PatternValidator.prototype.validate = function (c) {
	            return isPresent(this.pattern) ? this._validator(c) : null;
	        };
	        PatternValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
	        PatternValidator.decorators = [
	            { type: _angular_core.Directive, args: [{
	                        selector: '[pattern][formControlName],[pattern][formControl],[pattern][ngModel]',
	                        providers: [PATTERN_VALIDATOR],
	                        host: { '[attr.pattern]': 'pattern? pattern : null' }
	                    },] },
	        ];
	        /** @nocollapse */
	        PatternValidator.ctorParameters = [];
	        PatternValidator.propDecorators = {
	            'pattern': [{ type: _angular_core.Input },],
	        };
	        return PatternValidator;
	    }());
	
	    /**
	     * @whatItDoes Creates an {@link AbstractControl} from a user-specified configuration.
	     *
	     * It is essentially syntactic sugar that shortens the `new FormGroup()`,
	     * `new FormControl()`, and `new FormArray()` boilerplate that can build up in larger
	     * forms.
	     *
	     * @howToUse
	     *
	     * To use, inject `FormBuilder` into your component class. You can then call its methods
	     * directly.
	     *
	     * {@example forms/ts/formBuilder/form_builder_example.ts region='Component'}
	     *
	     *  * **npm package**: `@angular/forms`
	     *
	     *  * **NgModule**: {@link ReactiveFormsModule}
	     *
	     * @stable
	     */
	    var FormBuilder = (function () {
	        function FormBuilder() {
	        }
	        /**
	         * Construct a new {@link FormGroup} with the given map of configuration.
	         * Valid keys for the `extra` parameter map are `validator` and `asyncValidator`.
	         *
	         * See the {@link FormGroup} constructor for more details.
	         */
	        FormBuilder.prototype.group = function (controlsConfig, extra) {
	            if (extra === void 0) { extra = null; }
	            var controls = this._reduceControls(controlsConfig);
	            var validator = isPresent(extra) ? extra['validator'] : null;
	            var asyncValidator = isPresent(extra) ? extra['asyncValidator'] : null;
	            return new FormGroup(controls, validator, asyncValidator);
	        };
	        /**
	         * Construct a new {@link FormControl} with the given `formState`,`validator`, and
	         * `asyncValidator`.
	         *
	         * `formState` can either be a standalone value for the form control or an object
	         * that contains both a value and a disabled status.
	         *
	         */
	        FormBuilder.prototype.control = function (formState, validator, asyncValidator) {
	            if (validator === void 0) { validator = null; }
	            if (asyncValidator === void 0) { asyncValidator = null; }
	            return new FormControl(formState, validator, asyncValidator);
	        };
	        /**
	         * Construct a {@link FormArray} from the given `controlsConfig` array of
	         * configuration, with the given optional `validator` and `asyncValidator`.
	         */
	        FormBuilder.prototype.array = function (controlsConfig, validator, asyncValidator) {
	            var _this = this;
	            if (validator === void 0) { validator = null; }
	            if (asyncValidator === void 0) { asyncValidator = null; }
	            var controls = controlsConfig.map(function (c) { return _this._createControl(c); });
	            return new FormArray(controls, validator, asyncValidator);
	        };
	        /** @internal */
	        FormBuilder.prototype._reduceControls = function (controlsConfig) {
	            var _this = this;
	            var controls = {};
	            Object.keys(controlsConfig).forEach(function (controlName) {
	                controls[controlName] = _this._createControl(controlsConfig[controlName]);
	            });
	            return controls;
	        };
	        /** @internal */
	        FormBuilder.prototype._createControl = function (controlConfig) {
	            if (controlConfig instanceof FormControl || controlConfig instanceof FormGroup ||
	                controlConfig instanceof FormArray) {
	                return controlConfig;
	            }
	            else if (Array.isArray(controlConfig)) {
	                var value = controlConfig[0];
	                var validator = controlConfig.length > 1 ? controlConfig[1] : null;
	                var asyncValidator = controlConfig.length > 2 ? controlConfig[2] : null;
	                return this.control(value, validator, asyncValidator);
	            }
	            else {
	                return this.control(controlConfig);
	            }
	        };
	        FormBuilder.decorators = [
	            { type: _angular_core.Injectable },
	        ];
	        /** @nocollapse */
	        FormBuilder.ctorParameters = [];
	        return FormBuilder;
	    }());
	
	    var SHARED_FORM_DIRECTIVES = [
	        NgSelectOption, NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor,
	        CheckboxControlValueAccessor, SelectControlValueAccessor, SelectMultipleControlValueAccessor,
	        RadioControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator,
	        MinLengthValidator, MaxLengthValidator, PatternValidator
	    ];
	    var TEMPLATE_DRIVEN_DIRECTIVES = [NgModel, NgModelGroup, NgForm];
	    var REACTIVE_DRIVEN_DIRECTIVES = [FormControlDirective, FormGroupDirective, FormControlName, FormGroupName, FormArrayName];
	    /**
	     * Internal module used for sharing directives between FormsModule and ReactiveFormsModule
	     */
	    var InternalFormsSharedModule = (function () {
	        function InternalFormsSharedModule() {
	        }
	        InternalFormsSharedModule.decorators = [
	            { type: _angular_core.NgModule, args: [{ declarations: SHARED_FORM_DIRECTIVES, exports: SHARED_FORM_DIRECTIVES },] },
	        ];
	        /** @nocollapse */
	        InternalFormsSharedModule.ctorParameters = [];
	        return InternalFormsSharedModule;
	    }());
	
	    /**
	     * The ng module for forms.
	     * @stable
	     */
	    var FormsModule = (function () {
	        function FormsModule() {
	        }
	        FormsModule.decorators = [
	            { type: _angular_core.NgModule, args: [{
	                        declarations: TEMPLATE_DRIVEN_DIRECTIVES,
	                        providers: [RadioControlRegistry],
	                        exports: [InternalFormsSharedModule, TEMPLATE_DRIVEN_DIRECTIVES]
	                    },] },
	        ];
	        /** @nocollapse */
	        FormsModule.ctorParameters = [];
	        return FormsModule;
	    }());
	    /**
	     * The ng module for reactive forms.
	     * @stable
	     */
	    var ReactiveFormsModule = (function () {
	        function ReactiveFormsModule() {
	        }
	        ReactiveFormsModule.decorators = [
	            { type: _angular_core.NgModule, args: [{
	                        declarations: [REACTIVE_DRIVEN_DIRECTIVES],
	                        providers: [FormBuilder, RadioControlRegistry],
	                        exports: [InternalFormsSharedModule, REACTIVE_DRIVEN_DIRECTIVES]
	                    },] },
	        ];
	        /** @nocollapse */
	        ReactiveFormsModule.ctorParameters = [];
	        return ReactiveFormsModule;
	    }());
	
	    exports.AbstractControlDirective = AbstractControlDirective;
	    exports.AbstractFormGroupDirective = AbstractFormGroupDirective;
	    exports.CheckboxControlValueAccessor = CheckboxControlValueAccessor;
	    exports.ControlContainer = ControlContainer;
	    exports.NG_VALUE_ACCESSOR = NG_VALUE_ACCESSOR;
	    exports.DefaultValueAccessor = DefaultValueAccessor;
	    exports.NgControl = NgControl;
	    exports.NgControlStatus = NgControlStatus;
	    exports.NgControlStatusGroup = NgControlStatusGroup;
	    exports.NgForm = NgForm;
	    exports.NgModel = NgModel;
	    exports.NgModelGroup = NgModelGroup;
	    exports.RadioControlValueAccessor = RadioControlValueAccessor;
	    exports.FormControlDirective = FormControlDirective;
	    exports.FormControlName = FormControlName;
	    exports.FormGroupDirective = FormGroupDirective;
	    exports.FormArrayName = FormArrayName;
	    exports.FormGroupName = FormGroupName;
	    exports.NgSelectOption = NgSelectOption;
	    exports.SelectControlValueAccessor = SelectControlValueAccessor;
	    exports.SelectMultipleControlValueAccessor = SelectMultipleControlValueAccessor;
	    exports.MaxLengthValidator = MaxLengthValidator;
	    exports.MinLengthValidator = MinLengthValidator;
	    exports.PatternValidator = PatternValidator;
	    exports.RequiredValidator = RequiredValidator;
	    exports.FormBuilder = FormBuilder;
	    exports.AbstractControl = AbstractControl;
	    exports.FormArray = FormArray;
	    exports.FormControl = FormControl;
	    exports.FormGroup = FormGroup;
	    exports.NG_ASYNC_VALIDATORS = NG_ASYNC_VALIDATORS;
	    exports.NG_VALIDATORS = NG_VALIDATORS;
	    exports.Validators = Validators;
	    exports.FormsModule = FormsModule;
	    exports.ReactiveFormsModule = ReactiveFormsModule;
	
	}));


/***/ },

/***/ 358:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(24));
	__export(__webpack_require__(359));
	__export(__webpack_require__(374));
	__export(__webpack_require__(379));
	__export(__webpack_require__(382));


/***/ },

/***/ 359:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(360));
	__export(__webpack_require__(368));
	__export(__webpack_require__(371));


/***/ },

/***/ 360:
/***/ function(module, exports, __webpack_require__) {

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
	var core_1 = __webpack_require__(3);
	var tenant_service_1 = __webpack_require__(354);
	var FrontPageComponent = (function () {
	    function FrontPageComponent(tenantService) {
	        var _this = this;
	        tenantService.getTenant().subscribe(function (response) { return _this.tenantSlug = response.slug; });
	    }
	    FrontPageComponent = __decorate([
	        core_1.Component({
	            selector: 'front-page',
	            template: __webpack_require__(361),
	            styles: [__webpack_require__(364)]
	        }), 
	        __metadata('design:paramtypes', [(typeof (_a = typeof tenant_service_1.TenantService !== 'undefined' && tenant_service_1.TenantService) === 'function' && _a) || Object])
	    ], FrontPageComponent);
	    return FrontPageComponent;
	    var _a;
	}());
	exports.FrontPageComponent = FrontPageComponent;


/***/ },

/***/ 361:
/***/ function(module, exports, __webpack_require__) {

	
	        var result = __webpack_require__(362);
	
	        if (typeof result === "string") {
	            module.exports = result;
	        } else {
	            module.exports = result.toString();
	        }
	    

/***/ },

/***/ 362:
/***/ function(module, exports, __webpack_require__) {

	module.exports = "<!--\r\n  ~ Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved\r\n  ~ Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.\r\n  ~ Proprietary and confidential.\r\n  -->\r\n<div class=\"texture-bg\" style=\"height: 100%\">\r\n    <div class=\"container-fluid\" style=\"min-height: 100vh; padding-left: 0; padding-right: 0;\">\r\n        <div id=\"wrapper\">\r\n            <div id=\"verticalSpacer\">\r\n                <div id=\"horizontalSpacer\">\r\n                    <div class=\"col-xs-12 col-sm-6 col-sm-offset-3 col-lg-4 col-lg-offset-4\">\r\n                        <div class=\"row\" style=\"padding-bottom:15px\">\r\n                            <div class=\"containerColumn col-xs-12 col-md-8 col-md-offset-2\" id=\"logoColumn\">\r\n                                <a href=\"#\">\r\n                                    <img src=\"" + __webpack_require__(363) + "\" style=\"width:100%;\"/>\r\n                                </a>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"row\" style=\"padding-bottom:50px;\">\r\n                            <div class=\"containerColumn col-xs-12 col-md-8 col-md-offset-2\" id=\"contentColumn\">\r\n                                <div style=\"border: 1px dotted #ddd; border-radius: 3px; text-align: center; font-size: 18px; margin-bottom: 10px;\">\r\n                                    &nbsp;{{tenantSlug}}&nbsp;\r\n                                </div>\r\n                                <router-outlet></router-outlet>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>";

/***/ },

/***/ 363:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "./packed/images/bc321eb4fb013b65357b652557b6c451.png";

/***/ },

/***/ 364:
/***/ function(module, exports, __webpack_require__) {

	
	        var result = __webpack_require__(365);
	
	        if (typeof result === "string") {
	            module.exports = result;
	        } else {
	            module.exports = result.toString();
	        }
	    

/***/ },

/***/ 365:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(366)();
	// imports
	
	
	// module
	exports.push([module.id, "/*\r\n * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved\r\n * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.\r\n * Proprietary and confidential.\r\n */\r\n\r\n.texture-bg {\r\n    background: url(" + __webpack_require__(367) + ");\r\n}\r\n\r\n#wrapper {\r\n    display: table;\r\n    position: absolute;\r\n    height: 100%;\r\n    width: 100%;\r\n}\r\n\r\n.containerColumn {\r\n    background-color: #fff;\r\n    padding: 15px 15px;\r\n    box-shadow: #aaa 0 0 10px 0;\r\n}\r\n\r\n#contentColumn {\r\n    min-height: calc(100vh - 96px - 50px);\r\n}\r\n\r\n@media (min-width: 768px) {\r\n    #verticalSpacer {\r\n        display: table-cell;\r\n        vertical-align: middle;\r\n    }\r\n\r\n    #horizontalSpacer {\r\n        margin-left: auto;\r\n        margin-right: auto;\r\n    }\r\n\r\n    .containerColumn {\r\n        padding: 15px 30px;\r\n        border-radius: 10px;\r\n    }\r\n\r\n    #contentColumn {\r\n        min-height: initial;\r\n    }\r\n}", ""]);
	
	// exports


/***/ },

/***/ 367:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "./packed/images/da510f60fcff7ce89cd25ea3511bfef4.png";

/***/ },

/***/ 368:
/***/ function(module, exports, __webpack_require__) {

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
	var core_1 = __webpack_require__(3);
	var SignInComponent = (function () {
	    function SignInComponent() {
	        this.emailAddress = "";
	        this.password = "";
	    }
	    SignInComponent.prototype.onSubmit = function () {
	        console.log("Submitted: " + this.emailAddress + " - " + this.password);
	    };
	    SignInComponent = __decorate([
	        core_1.Component({
	            selector: 'sign-in',
	            template: __webpack_require__(369)
	        }), 
	        __metadata('design:paramtypes', [])
	    ], SignInComponent);
	    return SignInComponent;
	}());
	exports.SignInComponent = SignInComponent;


/***/ },

/***/ 369:
/***/ function(module, exports, __webpack_require__) {

	
	        var result = __webpack_require__(370);
	
	        if (typeof result === "string") {
	            module.exports = result;
	        } else {
	            module.exports = result.toString();
	        }
	    

/***/ },

/***/ 370:
/***/ function(module, exports) {

	module.exports = "<!--\r\n  ~ Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved\r\n  ~ Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.\r\n  ~ Proprietary and confidential.\r\n  -->\r\n\r\n<form id=\"loginForm\" (submit)=\"loader.setDisplayed(true);onSubmit()\">\r\n    <div class=\"alert alert-danger\" #alert *ngIf=\"alertMessage\">{{alertMessage}}</div>\r\n    <div class=\"form-group\">\r\n        <label for=\"emailAddressInput\">Email Address:</label>\r\n        <input name=\"emailAddress\" id=\"emailAddressInput\" type=\"text\" class=\"form-control\" [(ngModel)]=\"emailAddress\"/>\r\n    </div>\r\n    <div class=\"form-group\">\r\n        <label for=\"passwordInput\">Password:</label>\r\n        <input name=\"password\" id=\"passwordInput\" type=\"password\" class=\"form-control\" [(ngModel)]=\"password\"/>\r\n    </div>\r\n\r\n    <button class=\"btn btn-primary btn-large btn-block\" [disabled]=\"!emailAddress || !password\">Sign In</button>\r\n\r\n    <hr/>\r\n\r\n    <button [routerLink]=\"['register']\" class=\"btn btn-default btn-block\">Register</button>\r\n\r\n    <!--\r\n        <b:commandButton look=\"default\" size=\"block\" ajax=\"true\" action=\"#{oAuthController.signInWithGoogle}\"\r\n                         update=\"@form\" rendered=\"#{oAuthController.googleSignInEnabled}\">\r\n            <b:image library=\"aptibook\" name=\"images/google-sign-in.svg\" height=\"18px\"/>\r\n        </b:commandButton>\r\n\r\n        <h:panelGroup rendered=\"#{registrationController.registrationEnabled}\">\r\n            <hr/>\r\n\r\n            <b:button value=\"Register\" outcome=\"index\" look=\"default\" size=\"block\" includeViewParams=\"true\">\r\n                <f:param name=\"action\" value=\"register\"/>\r\n            </b:button>\r\n        </h:panelGroup>\r\n    -->\r\n</form>";

/***/ },

/***/ 371:
/***/ function(module, exports, __webpack_require__) {

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
	var core_1 = __webpack_require__(3);
	var RegisterComponent = (function () {
	    function RegisterComponent() {
	    }
	    RegisterComponent.prototype.onSubmit = function () {
	        console.log("Submitted.");
	    };
	    RegisterComponent = __decorate([
	        core_1.Component({
	            selector: 'register',
	            template: __webpack_require__(372)
	        }), 
	        __metadata('design:paramtypes', [])
	    ], RegisterComponent);
	    return RegisterComponent;
	}());
	exports.RegisterComponent = RegisterComponent;


/***/ },

/***/ 372:
/***/ function(module, exports, __webpack_require__) {

	
	        var result = __webpack_require__(373);
	
	        if (typeof result === "string") {
	            module.exports = result;
	        } else {
	            module.exports = result.toString();
	        }
	    

/***/ },

/***/ 373:
/***/ function(module, exports) {

	module.exports = "<!--\r\n  ~ Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved\r\n  ~ Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.\r\n  ~ Proprietary and confidential.\r\n  -->\r\n\r\n<form id=\"registerForm\" (submit)=\"onSubmit()\">\r\n    <div class=\"alert alert-danger\" #alert *ngIf=\"alertMessage\">{{alertMessage}}</div>\r\n    <div class=\"form-group\">\r\n        <label for=\"emailAddressInput\">Email Address:</label>\r\n        <input name=\"emailAddress\" id=\"emailAddressInput\" type=\"text\" class=\"form-control\" [(ngModel)]=\"emailAddress\"\r\n               required=\"required\"/>\r\n    </div>\r\n\r\n    <div class=\"form-group\">\r\n        <label for=\"firstNameInput\">First Name:</label>\r\n        <input name=\"firstNameInput\" id=\"firstNameInput\" type=\"text\" class=\"form-control\" [(ngModel)]=\"firstName\"\r\n               required=\"required\"/>\r\n    </div>\r\n\r\n    <div class=\"form-group\">\r\n        <label for=\"lastNameInput\">Last Name:</label>\r\n        <input name=\"lastNameInput\" id=\"lastNameInput\" type=\"text\" class=\"form-control\" [(ngModel)]=\"lastName\"\r\n               required=\"required\"/>\r\n    </div>\r\n\r\n    <div class=\"form-group\">\r\n        <label for=\"passwordInput\">Password:</label>\r\n        <input name=\"password\" id=\"passwordInput\" type=\"password\" class=\"form-control\" [(ngModel)]=\"password\"/>\r\n    </div>\r\n\r\n    <div class=\"form-group\">\r\n        <label for=\"confirmPasswordInput\">Confirm Password:</label>\r\n        <input name=\"confirmPasswordInput\" id=\"confirmPasswordInput\" type=\"password\" class=\"form-control\"\r\n               [(ngModel)]=\"confirmPassword\"/>\r\n    </div>\r\n\r\n    <button class=\"btn btn-primary btn-large btn-block\" [disabled]=\"!emailAddress || !firstName || !lastName || !password || !confirmPassword\">Register</button>\r\n\r\n    <hr/>\r\n\r\n    <button [routerLink]=\"['']\" class=\"btn btn-default btn-block\">Return to Sign In</button>\r\n</form>";

/***/ },

/***/ 374:
/***/ function(module, exports, __webpack_require__) {

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
	var core_1 = __webpack_require__(3);
	var LoaderComponent = (function () {
	    function LoaderComponent() {
	        this.displayed = false;
	    }
	    LoaderComponent.prototype.setDisplayed = function (displayed) {
	        this.displayed = displayed;
	    };
	    LoaderComponent = __decorate([
	        core_1.Component({
	            selector: 'loader',
	            template: __webpack_require__(375),
	            styles: [__webpack_require__(377)]
	        }), 
	        __metadata('design:paramtypes', [])
	    ], LoaderComponent);
	    return LoaderComponent;
	}());
	exports.LoaderComponent = LoaderComponent;


/***/ },

/***/ 375:
/***/ function(module, exports, __webpack_require__) {

	
	        var result = __webpack_require__(376);
	
	        if (typeof result === "string") {
	            module.exports = result;
	        } else {
	            module.exports = result.toString();
	        }
	    

/***/ },

/***/ 376:
/***/ function(module, exports) {

	module.exports = "<!--\r\n  ~ Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved\r\n  ~ Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.\r\n  ~ Proprietary and confidential.\r\n  -->\r\n\r\n<div class=\"loader-container\" *ngIf=\"displayed\">\r\n    <div class=\"loader\"></div>\r\n</div>";

/***/ },

/***/ 377:
/***/ function(module, exports, __webpack_require__) {

	
	        var result = __webpack_require__(378);
	
	        if (typeof result === "string") {
	            module.exports = result;
	        } else {
	            module.exports = result.toString();
	        }
	    

/***/ },

/***/ 378:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(366)();
	// imports
	
	
	// module
	exports.push([module.id, "/*\r\n * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved\r\n * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.\r\n * Proprietary and confidential.\r\n */\r\n\r\n.loader,\r\n.loader:before,\r\n.loader:after {\r\n    border-radius: 50%;\r\n    width: 2.5em;\r\n    height: 2.5em;\r\n    -webkit-animation-fill-mode: both;\r\n    animation-fill-mode: both;\r\n    -webkit-animation: load7 1.8s infinite ease-in-out;\r\n    animation: load7 1.8s infinite ease-in-out;\r\n}\r\n\r\n.loader-container {\r\n    position: fixed;\r\n    width: 100%;\r\n    height: 100%;\r\n    top: 0;\r\n    padding-top:25%;\r\n    background-color: rgba(255,255,255,0.5);\r\n}\r\n\r\n.loader {\r\n    color: #4272b7;\r\n    font-size: 10px;\r\n    margin: -20px auto;\r\n    position: relative;\r\n    text-indent: -9999em;\r\n    -webkit-transform: translateZ(0);\r\n    -ms-transform: translateZ(0);\r\n    transform: translateZ(0);\r\n    -webkit-animation-delay: -0.16s;\r\n    animation-delay: -0.16s;\r\n}\r\n\r\n.loader:before,\r\n.loader:after {\r\n    content: '';\r\n    position: absolute;\r\n    top: 0;\r\n}\r\n\r\n.loader:before {\r\n    left: -3.5em;\r\n    -webkit-animation-delay: -0.32s;\r\n    animation-delay: -0.32s;\r\n}\r\n\r\n.loader:after {\r\n    left: 3.5em;\r\n}\r\n\r\n@-webkit-keyframes load7 {\r\n    0%,\r\n    80%,\r\n    100% {\r\n        box-shadow: 0 2.5em 0 -1.3em;\r\n    }\r\n    40% {\r\n        box-shadow: 0 2.5em 0 0;\r\n    }\r\n}\r\n\r\n@keyframes load7 {\r\n    0%,\r\n    80%,\r\n    100% {\r\n        box-shadow: 0 2.5em 0 -1.3em;\r\n    }\r\n    40% {\r\n        box-shadow: 0 2.5em 0 0;\r\n    }\r\n}\r\n", ""]);
	
	// exports


/***/ },

/***/ 379:
/***/ function(module, exports, __webpack_require__) {

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
	var core_1 = __webpack_require__(3);
	var ModalComponent = (function () {
	    function ModalComponent() {
	        this.closeOnEscape = true;
	        this.closeOnOutsideClick = true;
	        this.hideCloseButton = false;
	        this.onSubmit = new core_1.EventEmitter();
	        this.onDangerSubmit = new core_1.EventEmitter();
	        this._isOpen = false;
	        this.createBackdrop();
	    }
	    ModalComponent.prototype.createBackdrop = function () {
	        this.backdropElement = document.createElement("div");
	        this.backdropElement.classList.add("modal-backdrop");
	        this.backdropElement.classList.add("fade");
	        this.backdropElement.classList.add("in");
	    };
	    ModalComponent.prototype.openModal = function () {
	        var _this = this;
	        if (this._isOpen)
	            return;
	        this._isOpen = true;
	        document.body.appendChild(this.backdropElement);
	        window.setTimeout(function () { return _this.modalRoot.nativeElement.focus(); }, 0);
	        document.body.className += " modal-open";
	    };
	    ModalComponent.prototype.closeModal = function () {
	        if (!this._isOpen)
	            return;
	        this._isOpen = false;
	        document.body.removeChild(this.backdropElement);
	        document.body.className = document.body.className.replace(/modal-open\b/, "");
	    };
	    Object.defineProperty(ModalComponent.prototype, "isOpen", {
	        get: function () {
	            return this._isOpen;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    __decorate([
	        core_1.ViewChild("modalRoot"), 
	        __metadata('design:type', (typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object)
	    ], ModalComponent.prototype, "modalRoot", void 0);
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', String)
	    ], ModalComponent.prototype, "title", void 0);
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Boolean)
	    ], ModalComponent.prototype, "closeOnEscape", void 0);
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Boolean)
	    ], ModalComponent.prototype, "closeOnOutsideClick", void 0);
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Boolean)
	    ], ModalComponent.prototype, "hideCloseButton", void 0);
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', String)
	    ], ModalComponent.prototype, "cancelButtonLabel", void 0);
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', String)
	    ], ModalComponent.prototype, "submitButtonLabel", void 0);
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', String)
	    ], ModalComponent.prototype, "dangerSubmitButtonLabel", void 0);
	    __decorate([
	        core_1.Output(), 
	        __metadata('design:type', (typeof (_b = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _b) || Object)
	    ], ModalComponent.prototype, "onSubmit", void 0);
	    __decorate([
	        core_1.Output(), 
	        __metadata('design:type', (typeof (_c = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _c) || Object)
	    ], ModalComponent.prototype, "onDangerSubmit", void 0);
	    ModalComponent = __decorate([
	        core_1.Component({
	            selector: 'modal',
	            template: __webpack_require__(380)
	        }), 
	        __metadata('design:paramtypes', [])
	    ], ModalComponent);
	    return ModalComponent;
	    var _a, _b, _c;
	}());
	exports.ModalComponent = ModalComponent;
	var ModalComponentBody = (function () {
	    function ModalComponentBody() {
	    }
	    ModalComponentBody = __decorate([
	        core_1.Directive({
	            selector: 'modal-body'
	        }), 
	        __metadata('design:paramtypes', [])
	    ], ModalComponentBody);
	    return ModalComponentBody;
	}());
	exports.ModalComponentBody = ModalComponentBody;
	var ModalComponentFooter = (function () {
	    function ModalComponentFooter() {
	    }
	    ModalComponentFooter = __decorate([
	        core_1.Directive({
	            selector: 'modal-footer'
	        }), 
	        __metadata('design:paramtypes', [])
	    ], ModalComponentFooter);
	    return ModalComponentFooter;
	}());
	exports.ModalComponentFooter = ModalComponentFooter;


/***/ },

/***/ 380:
/***/ function(module, exports, __webpack_require__) {

	
	        var result = __webpack_require__(381);
	
	        if (typeof result === "string") {
	            module.exports = result;
	        } else {
	            module.exports = result.toString();
	        }
	    

/***/ },

/***/ 381:
/***/ function(module, exports) {

	module.exports = "<!--\r\n  ~ Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved\r\n  ~ Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.\r\n  ~ Proprietary and confidential.\r\n  -->\r\n\r\n<div #modalRoot\r\n     class=\"modal fade\"\r\n     tabindex=\"-1\"\r\n     role=\"dialog\"\r\n     (keydown.esc)=\"closeOnEscape ? closeModal() : 0\"\r\n     [ngClass]=\"{'fade': _isOpen, 'in': _isOpen }\"\r\n     [ngStyle]=\"{ 'display': _isOpen ? 'block' : 'none' }\"\r\n     (click)=\"closeOnOutsideClick ? closeModal() : 0\">\r\n    <div class=\"modal-dialog\"\r\n         role=\"document\"\r\n         (click)=\"$event.stopPropagation();\">\r\n        <div class=\"modal-content\">\r\n\r\n            <!-- Header -->\r\n            <div class=\"modal-header\">\r\n                <!-- X close button (top right corner) -->\r\n                <button type=\"button\"\r\n                        class=\"close\"\r\n                        aria-label=\"Close\"\r\n                        (click)=\"closeModal()\"\r\n                        *ngIf=\"!hideCloseButton\">\r\n                    <span aria-hidden=\"true\">x</span>\r\n                </button>\r\n                <h4 class=\"modal-title\">\r\n                    {{title}}\r\n                </h4>\r\n            </div>\r\n\r\n            <!-- Body -->\r\n            <div class=\"modal-body\">\r\n                <ng-content select=\"modal-body\"></ng-content>\r\n            </div>\r\n\r\n            <!-- Footer -->\r\n            <div class=\"modal-footer\">\r\n                <ng-content select=\"modal-footer\"></ng-content>\r\n                <button *ngIf=\"submitButtonLabel\" type=\"button\" class=\"btn btn-primary\"\r\n                        (click)=\"onSubmit.emit()\">{{submitButtonLabel}}\r\n                </button>\r\n                <button *ngIf=\"cancelButtonLabel\" type=\"button\" class=\"btn btn-default\" (click)=\"closeModal()\">\r\n                    {{cancelButtonLabel}}\r\n                </button>\r\n                <button *ngIf=\"dangerSubmitButtonLabel\" type=\"button\" class=\"btn btn-danger pull-left\"\r\n                        (click)=\"onDangerSubmit.emit()\">{{dangerSubmitButtonLabel}}\r\n                </button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>";

/***/ },

/***/ 382:
/***/ function(module, exports, __webpack_require__) {

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
	var core_1 = __webpack_require__(3);
	var NavBarComponent = (function () {
	    function NavBarComponent() {
	    }
	    NavBarComponent = __decorate([
	        core_1.Component({
	            selector: 'navbar',
	            template: "\n<div class=\"navbar navbar-default\">\n    <div class=\"container-fluid\">\n        <div class=\"navbar-header\">\n        </div>\n    </div>\n</div>\n"
	        }), 
	        __metadata('design:paramtypes', [])
	    ], NavBarComponent);
	    return NavBarComponent;
	}());
	exports.NavBarComponent = NavBarComponent;


/***/ },

/***/ 383:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ng2_tag_input_1 = __webpack_require__(384);
	exports.TagInputModule = ng2_tag_input_1.TagInputModule;


/***/ },

/***/ 384:
/***/ function(module, exports, __webpack_require__) {

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory(__webpack_require__(3), __webpack_require__(357), __webpack_require__(166), __webpack_require__(22));
		else if(typeof define === 'function' && define.amd)
			define(["@angular/core", "@angular/forms", "rxjs/add/operator/debounceTime", "@angular/common"], factory);
		else if(typeof exports === 'object')
			exports["ng2-tag-input"] = factory(require("@angular/core"), require("@angular/forms"), require("rxjs/add/operator/debounceTime"), require("@angular/common"));
		else
			root["ng2-tag-input"] = factory(root["@angular/core"], root["@angular/forms"], root["rxjs/add/operator/debounceTime"], root["@angular/common"]);
	})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_16__, __WEBPACK_EXTERNAL_MODULE_22__) {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	
	
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {
	
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
		var core_1 = __webpack_require__(1);
		var icon_1 = __webpack_require__(2);
		var tag_input_form_1 = __webpack_require__(5);
		var components_1 = __webpack_require__(9);
		var forms_1 = __webpack_require__(7);
		var common_1 = __webpack_require__(22);
		var highlight_pipe_1 = __webpack_require__(23);
		var ng2_material_dropdown_1 = __webpack_require__(13);
		var TagInputModule = (function () {
		    function TagInputModule() {
		    }
		    TagInputModule = __decorate([
		        core_1.NgModule({
		            imports: [
		                common_1.CommonModule,
		                forms_1.ReactiveFormsModule,
		                ng2_material_dropdown_1.Ng2DropdownModule
		            ],
		            declarations: [
		                components_1.TagInputComponent,
		                icon_1.DeleteIconComponent,
		                tag_input_form_1.TagInputForm,
		                highlight_pipe_1.HighlightPipe
		            ],
		            exports: [
		                components_1.TagInputComponent,
		                icon_1.DeleteIconComponent,
		                tag_input_form_1.TagInputForm,
		                highlight_pipe_1.HighlightPipe
		            ]
		        }), 
		        __metadata('design:paramtypes', [])
		    ], TagInputModule);
		    return TagInputModule;
		}());
		exports.TagInputModule = TagInputModule;
		
	
	/***/ },
	/* 1 */
	/***/ function(module, exports) {
	
		module.exports = __WEBPACK_EXTERNAL_MODULE_1__;
	
	/***/ },
	/* 2 */
	/***/ function(module, exports, __webpack_require__) {
	
		"use strict";
		function __export(m) {
		    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
		}
		__export(__webpack_require__(3));
		
	
	/***/ },
	/* 3 */
	/***/ function(module, exports, __webpack_require__) {
	
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
		var core_1 = __webpack_require__(1);
		var DeleteIconComponent = (function () {
		    function DeleteIconComponent() {
		    }
		    DeleteIconComponent.prototype.ngOnInit = function () { };
		    DeleteIconComponent = __decorate([
		        core_1.Component({
		            selector: 'delete-icon',
		            template: __webpack_require__(4)
		        }), 
		        __metadata('design:paramtypes', [])
		    ], DeleteIconComponent);
		    return DeleteIconComponent;
		}());
		exports.DeleteIconComponent = DeleteIconComponent;
		
	
	/***/ },
	/* 4 */
	/***/ function(module, exports) {
	
		module.exports = "<svg enable-background=\"new 0 0 32 32\" height=\"16px\" id=\"Слой_1\" version=\"1.1\" viewBox=\"0 0 32 32\" width=\"16px\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><path d=\"M17.459,16.014l8.239-8.194c0.395-0.391,0.395-1.024,0-1.414c-0.394-0.391-1.034-0.391-1.428,0  l-8.232,8.187L7.73,6.284c-0.394-0.395-1.034-0.395-1.428,0c-0.394,0.396-0.394,1.037,0,1.432l8.302,8.303l-8.332,8.286  c-0.394,0.391-0.394,1.024,0,1.414c0.394,0.391,1.034,0.391,1.428,0l8.325-8.279l8.275,8.276c0.394,0.395,1.034,0.395,1.428,0  c0.394-0.396,0.394-1.037,0-1.432L17.459,16.014z\" fill=\"#121313\" id=\"Close\"/><g/><g/><g/><g/><g/><g/></svg>\n";
	
	/***/ },
	/* 5 */
	/***/ function(module, exports, __webpack_require__) {
	
		"use strict";
		function __export(m) {
		    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
		}
		__export(__webpack_require__(6));
		
	
	/***/ },
	/* 6 */
	/***/ function(module, exports, __webpack_require__) {
	
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
		var core_1 = __webpack_require__(1);
		var forms_1 = __webpack_require__(7);
		var TagInputForm = (function () {
		    function TagInputForm(renderer) {
		        this.renderer = renderer;
		        this.onSubmit = new core_1.EventEmitter();
		        this.onBlur = new core_1.EventEmitter();
		        this.onFocus = new core_1.EventEmitter();
		        this.onKeyup = new core_1.EventEmitter();
		        this.onKeydown = new core_1.EventEmitter();
		        this.validators = [];
		    }
		    TagInputForm.prototype.ngOnInit = function () {
		        this.form = new forms_1.FormGroup({
		            item: new forms_1.FormControl('', forms_1.Validators.compose(this.validators))
		        });
		    };
		    Object.defineProperty(TagInputForm.prototype, "value", {
		        get: function () {
		            return this.form.get('item');
		        },
		        enumerable: true,
		        configurable: true
		    });
		    TagInputForm.prototype.isInputFocused = function () {
		        return document.activeElement === this.input.nativeElement;
		    };
		    TagInputForm.prototype.getErrorMessages = function (messages) {
		        var _this = this;
		        return Object.keys(messages)
		            .filter(function (err) { return _this.value.hasError(err); })
		            .map(function (err) { return messages[err]; });
		    };
		    TagInputForm.prototype.hasErrors = function () {
		        return this.form.dirty && this.form.value.item && this.form.invalid;
		    };
		    TagInputForm.prototype.focus = function () {
		        this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
		    };
		    TagInputForm.prototype.getElementPosition = function () {
		        return this.input.nativeElement.getBoundingClientRect();
		    };
		    TagInputForm.prototype.onKeyDown = function ($event) {
		        return this.onKeydown.emit($event);
		    };
		    __decorate([
		        core_1.Output(), 
		        __metadata('design:type', core_1.EventEmitter)
		    ], TagInputForm.prototype, "onSubmit", void 0);
		    __decorate([
		        core_1.Output(), 
		        __metadata('design:type', core_1.EventEmitter)
		    ], TagInputForm.prototype, "onBlur", void 0);
		    __decorate([
		        core_1.Output(), 
		        __metadata('design:type', core_1.EventEmitter)
		    ], TagInputForm.prototype, "onFocus", void 0);
		    __decorate([
		        core_1.Output(), 
		        __metadata('design:type', core_1.EventEmitter)
		    ], TagInputForm.prototype, "onKeyup", void 0);
		    __decorate([
		        core_1.Output(), 
		        __metadata('design:type', core_1.EventEmitter)
		    ], TagInputForm.prototype, "onKeydown", void 0);
		    __decorate([
		        core_1.Input(), 
		        __metadata('design:type', String)
		    ], TagInputForm.prototype, "placeholder", void 0);
		    __decorate([
		        core_1.Input(), 
		        __metadata('design:type', Array)
		    ], TagInputForm.prototype, "validators", void 0);
		    __decorate([
		        core_1.Input(), 
		        __metadata('design:type', String)
		    ], TagInputForm.prototype, "inputId", void 0);
		    __decorate([
		        core_1.Input(), 
		        __metadata('design:type', String)
		    ], TagInputForm.prototype, "inputClass", void 0);
		    __decorate([
		        core_1.ViewChild('input'), 
		        __metadata('design:type', Object)
		    ], TagInputForm.prototype, "input", void 0);
		    TagInputForm = __decorate([
		        core_1.Component({
		            selector: 'tag-input-form',
		            template: __webpack_require__(8)
		        }), 
		        __metadata('design:paramtypes', [core_1.Renderer])
		    ], TagInputForm);
		    return TagInputForm;
		}());
		exports.TagInputForm = TagInputForm;
		
	
	/***/ },
	/* 7 */
	/***/ function(module, exports) {
	
		module.exports = __WEBPACK_EXTERNAL_MODULE_7__;
	
	/***/ },
	/* 8 */
	/***/ function(module, exports) {
	
		module.exports = "<!-- form -->\n<form (submit)=\"onSubmit.emit()\" [formGroup]=\"form\">\n    <input #input\n           type=\"text\"\n           required\n           class=\"ng2-tag-input__text-input\"\n           formControlName=\"item\"\n           tabindex=\"0\"\n\n           [ngClass]=\"inputClass\"\n           [attr.id]=\"inputId\"\n           [attr.placeholder]=\"placeholder\"\n           [attr.aria-label]=\"placeholder\"\n\n           (focus)=\"onFocus.emit($event)\"\n           (blur)=\"onBlur.emit($event)\"\n           (keydown)=\"onKeyDown($event)\"\n           (keyup)=\"onKeyup.emit($event)\"\n    />\n</form>\n";
	
	/***/ },
	/* 9 */
	/***/ function(module, exports, __webpack_require__) {
	
		"use strict";
		function __export(m) {
		    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
		}
		__export(__webpack_require__(10));
		
	
	/***/ },
	/* 10 */
	/***/ function(module, exports, __webpack_require__) {
	
		"use strict";
		var __extends = (this && this.__extends) || function (d, b) {
		    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		    function __() { this.constructor = d; }
		    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
		var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
		    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
		    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
		    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		    return c > 3 && r && Object.defineProperty(target, key, r), r;
		};
		var __metadata = (this && this.__metadata) || function (k, v) {
		    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
		};
		var core_1 = __webpack_require__(1);
		var forms_1 = __webpack_require__(7);
		var constants_1 = __webpack_require__(11);
		var events_actions_1 = __webpack_require__(12);
		var ng2_material_dropdown_1 = __webpack_require__(13);
		var accessor_1 = __webpack_require__(14);
		var keypress_actions_1 = __webpack_require__(15);
		var tag_input_form_component_1 = __webpack_require__(6);
		__webpack_require__(16);
		var TagInputComponent = (function (_super) {
		    __extends(TagInputComponent, _super);
		    function TagInputComponent(element, renderer) {
		        _super.call(this);
		        this.element = element;
		        this.renderer = renderer;
		        this.separatorKeys = [];
		        this.placeholder = constants_1.PLACEHOLDER;
		        this.secondaryPlaceholder = constants_1.SECONDARY_PLACEHOLDER;
		        this.maxItems = undefined;
		        this.readonly = undefined;
		        this.transform = function (item) { return item; };
		        this.validators = [];
		        this.autocomplete = false;
		        this.autocompleteItems = undefined;
		        this.onlyFromAutocomplete = false;
		        this.errorMessages = {};
		        this.theme = 'default';
		        this.showDropdownIfEmpty = false;
		        this.onTextChangeDebounce = 250;
		        this.onAdd = new core_1.EventEmitter();
		        this.onRemove = new core_1.EventEmitter();
		        this.onSelect = new core_1.EventEmitter();
		        this.onFocus = new core_1.EventEmitter();
		        this.onBlur = new core_1.EventEmitter();
		        this.onTextChange = new core_1.EventEmitter();
		        this.itemsMatching = [];
		        this.listeners = (_a = {},
		            _a[constants_1.KEYDOWN] = [],
		            _a[constants_1.KEYUP] = [],
		            _a.change = [],
		            _a
		        );
		        var _a;
		    }
		    TagInputComponent.prototype.removeItem = function (item) {
		        this.items = this.items.filter(function (_item) { return _item !== item; });
		        if (this.selectedTag === item) {
		            this.selectedTag = undefined;
		        }
		        this.focus(true);
		        this.onRemove.emit(item);
		    };
		    TagInputComponent.prototype.addItem = function (isFromAutocomplete) {
		        if (isFromAutocomplete === void 0) { isFromAutocomplete = false; }
		        if (this.autocomplete && this.dropdown.state.selectedItem && !isFromAutocomplete) {
		            return;
		        }
		        var item = this.setInputValue(this.inputForm.value.value);
		        var isDupe = this.items.indexOf(item) !== -1;
		        var isValid = this.inputForm.form.valid &&
		            isDupe === false &&
		            !this.maxItemsReached &&
		            ((isFromAutocomplete && this.onlyFromAutocomplete === true) || this.onlyFromAutocomplete === false);
		        if (isValid) {
		            this.items = this.items.concat([item]);
		            this.onAdd.emit(item);
		        }
		        this.setInputValue('');
		        this.focus(true);
		    };
		    TagInputComponent.prototype.selectItem = function (item) {
		        if (this.readonly) {
		            var el = this.element.nativeElement;
		            this.renderer.invokeElementMethod(el, constants_1.FOCUS, []);
		            return;
		        }
		        this.selectedTag = item;
		        this.onSelect.emit(item);
		    };
		    TagInputComponent.prototype.fireEvents = function (eventName, $event) {
		        var _this = this;
		        this.listeners[eventName].forEach(function (listener) { return listener.call(_this, $event); });
		    };
		    TagInputComponent.prototype.handleKeydown = function ($event, item) {
		        var action = keypress_actions_1.getAction($event.keyCode || $event.which);
		        var itemIndex = this.items.indexOf(item);
		        action.call(this, itemIndex);
		        $event.preventDefault();
		    };
		    TagInputComponent.prototype.setInputValue = function (value) {
		        var item = value ? this.transform(value) : '';
		        var control = this.getControl();
		        control.setValue(item);
		        return item;
		    };
		    TagInputComponent.prototype.getControl = function () {
		        return this.inputForm.value;
		    };
		    TagInputComponent.prototype.focus = function (applyFocus) {
		        if (applyFocus === void 0) { applyFocus = false; }
		        if (this.readonly) {
		            return;
		        }
		        if (this.autocomplete) {
		            events_actions_1.autoCompleteListener.call(this, {});
		        }
		        this.selectItem(undefined);
		        this.onFocus.emit(this.inputForm.value.value);
		        if (applyFocus) {
		            this.inputForm.focus();
		        }
		    };
		    TagInputComponent.prototype.blur = function () {
		        this.onBlur.emit(this.inputForm.value.value);
		    };
		    TagInputComponent.prototype.hasErrors = function () {
		        return this.inputForm && this.inputForm.hasErrors() ? true : false;
		    };
		    TagInputComponent.prototype.isInputFocused = function () {
		        return this.inputForm && this.inputForm.isInputFocused() ? true : false;
		    };
		    Object.defineProperty(TagInputComponent.prototype, "maxItemsReached", {
		        get: function () {
		            return this.maxItems !== undefined && this.items.length >= this.maxItems;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    TagInputComponent.prototype.hasCustomTemplate = function () {
		        if (!this.template.nativeElement) {
		            return false;
		        }
		        return this.template.nativeElement.children.length > 0;
		    };
		    TagInputComponent.prototype.ngOnInit = function () {
		        events_actions_1.addListener.call(this, constants_1.KEYDOWN, events_actions_1.backSpaceListener);
		        events_actions_1.addListener.call(this, constants_1.KEYDOWN, events_actions_1.customSeparatorKeys, this.separatorKeys.length > 0);
		        var maxItemsReached = this.maxItems !== undefined && this.items.length > this.maxItems;
		        if (maxItemsReached) {
		            this.maxItems = this.items.length;
		            console.warn(constants_1.MAX_ITEMS_WARNING);
		        }
		    };
		    TagInputComponent.prototype.ngAfterViewChecked = function () {
		        this.tagElements = this.element.nativeElement.querySelectorAll('.ng2-tag');
		    };
		    TagInputComponent.prototype.ngAfterViewInit = function () {
		        var _this = this;
		        if (this.autocomplete) {
		            events_actions_1.addListener.call(this, constants_1.KEYUP, events_actions_1.autoCompleteListener);
		            this.dropdown.onItemClicked.subscribe(events_actions_1.onAutocompleteItemClicked.bind(this));
		            this.dropdown.onHide.subscribe(function () { return _this.itemsMatching = []; });
		        }
		        this.inputForm.onKeydown.subscribe(function (event) {
		            _this.fireEvents('keydown', event);
		        });
		        this.inputForm.form.valueChanges
		            .debounceTime(this.onTextChangeDebounce)
		            .subscribe(function () {
		            var value = _this.inputForm.value.value;
		            _this.onTextChange.emit(value);
		        });
		    };
		    __decorate([
		        core_1.Input(), 
		        __metadata('design:type', Array)
		    ], TagInputComponent.prototype, "separatorKeys", void 0);
		    __decorate([
		        core_1.Input(), 
		        __metadata('design:type', String)
		    ], TagInputComponent.prototype, "placeholder", void 0);
		    __decorate([
		        core_1.Input(), 
		        __metadata('design:type', String)
		    ], TagInputComponent.prototype, "secondaryPlaceholder", void 0);
		    __decorate([
		        core_1.Input(), 
		        __metadata('design:type', Number)
		    ], TagInputComponent.prototype, "maxItems", void 0);
		    __decorate([
		        core_1.Input(), 
		        __metadata('design:type', Boolean)
		    ], TagInputComponent.prototype, "readonly", void 0);
		    __decorate([
		        core_1.Input(), 
		        __metadata('design:type', Function)
		    ], TagInputComponent.prototype, "transform", void 0);
		    __decorate([
		        core_1.Input(), 
		        __metadata('design:type', Object)
		    ], TagInputComponent.prototype, "validators", void 0);
		    __decorate([
		        core_1.Input(), 
		        __metadata('design:type', Boolean)
		    ], TagInputComponent.prototype, "autocomplete", void 0);
		    __decorate([
		        core_1.Input(), 
		        __metadata('design:type', Array)
		    ], TagInputComponent.prototype, "autocompleteItems", void 0);
		    __decorate([
		        core_1.Input(), 
		        __metadata('design:type', Boolean)
		    ], TagInputComponent.prototype, "onlyFromAutocomplete", void 0);
		    __decorate([
		        core_1.Input(), 
		        __metadata('design:type', Object)
		    ], TagInputComponent.prototype, "errorMessages", void 0);
		    __decorate([
		        core_1.Input(), 
		        __metadata('design:type', String)
		    ], TagInputComponent.prototype, "theme", void 0);
		    __decorate([
		        core_1.Input(), 
		        __metadata('design:type', Boolean)
		    ], TagInputComponent.prototype, "showDropdownIfEmpty", void 0);
		    __decorate([
		        core_1.Input(), 
		        __metadata('design:type', Number)
		    ], TagInputComponent.prototype, "onTextChangeDebounce", void 0);
		    __decorate([
		        core_1.Input(), 
		        __metadata('design:type', String)
		    ], TagInputComponent.prototype, "inputId", void 0);
		    __decorate([
		        core_1.Input(), 
		        __metadata('design:type', String)
		    ], TagInputComponent.prototype, "inputClass", void 0);
		    __decorate([
		        core_1.Output(), 
		        __metadata('design:type', Object)
		    ], TagInputComponent.prototype, "onAdd", void 0);
		    __decorate([
		        core_1.Output(), 
		        __metadata('design:type', Object)
		    ], TagInputComponent.prototype, "onRemove", void 0);
		    __decorate([
		        core_1.Output(), 
		        __metadata('design:type', Object)
		    ], TagInputComponent.prototype, "onSelect", void 0);
		    __decorate([
		        core_1.Output(), 
		        __metadata('design:type', Object)
		    ], TagInputComponent.prototype, "onFocus", void 0);
		    __decorate([
		        core_1.Output(), 
		        __metadata('design:type', Object)
		    ], TagInputComponent.prototype, "onBlur", void 0);
		    __decorate([
		        core_1.Output(), 
		        __metadata('design:type', Object)
		    ], TagInputComponent.prototype, "onTextChange", void 0);
		    __decorate([
		        core_1.ViewChild('template'), 
		        __metadata('design:type', core_1.ElementRef)
		    ], TagInputComponent.prototype, "template", void 0);
		    __decorate([
		        core_1.ViewChild(ng2_material_dropdown_1.Ng2Dropdown), 
		        __metadata('design:type', Object)
		    ], TagInputComponent.prototype, "dropdown", void 0);
		    __decorate([
		        core_1.ViewChild(tag_input_form_component_1.TagInputForm), 
		        __metadata('design:type', tag_input_form_component_1.TagInputForm)
		    ], TagInputComponent.prototype, "inputForm", void 0);
		    TagInputComponent = __decorate([
		        core_1.Component({
		            selector: 'tag-input',
		            providers: [{
		                    provide: forms_1.NG_VALUE_ACCESSOR,
		                    useExisting: core_1.forwardRef(function () { return TagInputComponent; }),
		                    multi: true
		                }],
		            styles: [__webpack_require__(17).toString()],
		            template: __webpack_require__(21)
		        }), 
		        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
		    ], TagInputComponent);
		    return TagInputComponent;
		}(accessor_1.TagInputAccessor));
		exports.TagInputComponent = TagInputComponent;
		
	
	/***/ },
	/* 11 */
	/***/ function(module, exports) {
	
		"use strict";
		exports.PLACEHOLDER = '+ Tag';
		exports.SECONDARY_PLACEHOLDER = 'Enter a new tag';
		exports.KEYDOWN = 'keydown';
		exports.KEYUP = 'keyup';
		exports.FOCUS = 'focus';
		exports.MAX_ITEMS_WARNING = 'The number of items specified was greater than the property max-items.';
		exports.ACTIONS_KEYS = {
		    DELETE: 'DELETE',
		    SWITCH_PREV: 'SWITCH_PREV',
		    SWITCH_NEXT: 'SWITCH_NEXT',
		    TAB: 'TAB'
		};
		exports.KEY_PRESS_ACTIONS = {
		    8: exports.ACTIONS_KEYS.DELETE,
		    37: exports.ACTIONS_KEYS.SWITCH_PREV,
		    39: exports.ACTIONS_KEYS.SWITCH_NEXT,
		    9: exports.ACTIONS_KEYS.TAB
		};
		
	
	/***/ },
	/* 12 */
	/***/ function(module, exports) {
	
		"use strict";
		function customSeparatorKeys($event) {
		    if (this.separatorKeys.indexOf($event.keyCode) >= 0) {
		        $event.preventDefault();
		        this.addItem();
		    }
		}
		exports.customSeparatorKeys = customSeparatorKeys;
		function backSpaceListener($event) {
		    var itemsLength = this.items.length, inputValue = this.inputForm.value.value, isCorrectKey = $event.keyCode === 37 || $event.keyCode === 8;
		    if (isCorrectKey && !inputValue && itemsLength) {
		        this.selectItem(this.items[itemsLength - 1]);
		        this.renderer.invokeElementMethod(this.tagElements[itemsLength - 1], 'focus', []);
		    }
		}
		exports.backSpaceListener = backSpaceListener;
		function addListener(listenerType, action, condition) {
		    if (condition === void 0) { condition = true; }
		    if (!this.listeners.hasOwnProperty(listenerType)) {
		        throw new Error('The event entered may be wrong');
		    }
		    if (!condition) {
		        return;
		    }
		    this.listeners[listenerType].push(action);
		}
		exports.addListener = addListener;
		function getMatchingItems(value) {
		    var _this = this;
		    if (!value && !this.showDropdownIfEmpty) {
		        return [];
		    }
		    var itemsMatching = [];
		    var items = this.autocompleteItems;
		    var lowercaseValue = value.toLowerCase();
		    items.forEach(function (item) {
		        var condition = item.toLowerCase().indexOf(lowercaseValue) >= 0 && _this.items.indexOf(item) === -1;
		        if (condition) {
		            itemsMatching.push(item);
		        }
		    });
		    return itemsMatching;
		}
		function autoCompleteListener(ev) {
		    var value = this.inputForm.value.value;
		    var position = this.inputForm.getElementPosition();
		    var key = ev.keyCode;
		    var itemsMatching = getMatchingItems.call(this, value);
		    this.itemsMatching = itemsMatching;
		    if (itemsMatching.length || (this.showDropdownIfEmpty && !value)) {
		        var focus_1 = key === 40 ? true : false;
		        this.dropdown.show(position, focus_1);
		    }
		    if (!itemsMatching.length && this.dropdown.menu.state.isVisible) {
		        this.dropdown.hide();
		    }
		}
		exports.autoCompleteListener = autoCompleteListener;
		function onAutocompleteItemClicked(item) {
		    if (!item) {
		        return;
		    }
		    this.setInputValue(item.value);
		    this.addItem(true);
		    this.focus();
		    this.dropdown.hide();
		}
		exports.onAutocompleteItemClicked = onAutocompleteItemClicked;
		
	
	/***/ },
	/* 13 */
	/***/ function(module, exports, __webpack_require__) {
	
		(function webpackUniversalModuleDefinition(root, factory) {
			if(true)
				module.exports = factory(__webpack_require__(1));
			else if(typeof define === 'function' && define.amd)
				define(["@angular/core"], factory);
			else if(typeof exports === 'object')
				exports["ng2-dropdown"] = factory(require("@angular/core"));
			else
				root["ng2-dropdown"] = factory(root["@angular/core"]);
		})(this, function(__WEBPACK_EXTERNAL_MODULE_3__) {
		return /******/ (function(modules) { // webpackBootstrap
		/******/ 	// The module cache
		/******/ 	var installedModules = {};
	
		/******/ 	// The require function
		/******/ 	function __webpack_require__(moduleId) {
	
		/******/ 		// Check if module is in cache
		/******/ 		if(installedModules[moduleId])
		/******/ 			return installedModules[moduleId].exports;
	
		/******/ 		// Create a new module (and put it into the cache)
		/******/ 		var module = installedModules[moduleId] = {
		/******/ 			exports: {},
		/******/ 			id: moduleId,
		/******/ 			loaded: false
		/******/ 		};
	
		/******/ 		// Execute the module function
		/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	
		/******/ 		// Flag the module as loaded
		/******/ 		module.loaded = true;
	
		/******/ 		// Return the exports of the module
		/******/ 		return module.exports;
		/******/ 	}
	
	
		/******/ 	// expose the modules object (__webpack_modules__)
		/******/ 	__webpack_require__.m = modules;
	
		/******/ 	// expose the module cache
		/******/ 	__webpack_require__.c = installedModules;
	
		/******/ 	// __webpack_public_path__
		/******/ 	__webpack_require__.p = "";
	
		/******/ 	// Load entry module and return exports
		/******/ 	return __webpack_require__(0);
		/******/ })
		/************************************************************************/
		/******/ ([
		/* 0 */
		/***/ function(module, exports, __webpack_require__) {
	
			"use strict";
			function __export(m) {
			    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
			}
			__export(__webpack_require__(1));
			
	
		/***/ },
		/* 1 */
		/***/ function(module, exports, __webpack_require__) {
	
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
			function __export(m) {
			    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
			}
			var ng2_dropdown_1 = __webpack_require__(2);
			var ng2_dropdown_menu_1 = __webpack_require__(11);
			var ng2_dropdown_button_1 = __webpack_require__(4);
			var ng2_menu_item_1 = __webpack_require__(14);
			var core_1 = __webpack_require__(3);
			var Ng2DropdownModule = (function () {
			    function Ng2DropdownModule() {
			    }
			    Ng2DropdownModule = __decorate([
			        core_1.NgModule({
			            exports: [
			                ng2_menu_item_1.Ng2MenuItem,
			                ng2_dropdown_button_1.Ng2DropdownButton,
			                ng2_dropdown_menu_1.Ng2DropdownMenu,
			                ng2_dropdown_1.Ng2Dropdown
			            ],
			            declarations: [
			                ng2_dropdown_1.Ng2Dropdown,
			                ng2_menu_item_1.Ng2MenuItem,
			                ng2_dropdown_button_1.Ng2DropdownButton,
			                ng2_dropdown_menu_1.Ng2DropdownMenu
			            ],
			            imports: []
			        }), 
			        __metadata('design:paramtypes', [])
			    ], Ng2DropdownModule);
			    return Ng2DropdownModule;
			}());
			exports.Ng2DropdownModule = Ng2DropdownModule;
			__export(__webpack_require__(2));
			__export(__webpack_require__(11));
			__export(__webpack_require__(4));
			__export(__webpack_require__(14));
			
	
		/***/ },
		/* 2 */
		/***/ function(module, exports, __webpack_require__) {
	
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
			var core_1 = __webpack_require__(3);
			var ng2_dropdown_button_1 = __webpack_require__(4);
			var ng2_dropdown_menu_1 = __webpack_require__(11);
			var ng2_dropdown_state_1 = __webpack_require__(21);
			var Ng2Dropdown = (function () {
			    function Ng2Dropdown() {
			        this.onItemClicked = new core_1.EventEmitter();
			        this.onItemSelected = new core_1.EventEmitter();
			        this.onShow = new core_1.EventEmitter();
			        this.onHide = new core_1.EventEmitter();
			        this.state = new ng2_dropdown_state_1.Ng2DropdownState();
			    }
			    Ng2Dropdown.prototype.toggleMenu = function (position) {
			        if (position === void 0) { position = this.button.getPosition(); }
			        this.menu.state.isVisible ? this.hide() : this.show(position);
			    };
			    Ng2Dropdown.prototype.hide = function () {
			        this.menu.hide();
			        this.onHide.emit(this);
			    };
			    Ng2Dropdown.prototype.show = function (position) {
			        if (position === void 0) { position = this.button.getPosition(); }
			        this.menu.show();
			        this.menu.updatePosition(position);
			        this.onShow.emit(this);
			    };
			    Ng2Dropdown.prototype.ngOnInit = function () {
			        var _this = this;
			        this.state.onItemClicked.subscribe(function (item) {
			            _this.onItemClicked.emit(item);
			            if (item.preventClose) {
			                return;
			            }
			            _this.hide.call(_this);
			        });
			        if (this.button) {
			            this.button.onMenuToggled.subscribe(function () {
			                _this.toggleMenu();
			            });
			        }
			        this.state.onItemSelected.subscribe(function (item) { return _this.onItemSelected.emit(item); });
			    };
			    __decorate([
			        core_1.ContentChild(ng2_dropdown_button_1.Ng2DropdownButton), 
			        __metadata('design:type', ng2_dropdown_button_1.Ng2DropdownButton)
			    ], Ng2Dropdown.prototype, "button", void 0);
			    __decorate([
			        core_1.ContentChild(ng2_dropdown_menu_1.Ng2DropdownMenu), 
			        __metadata('design:type', ng2_dropdown_menu_1.Ng2DropdownMenu)
			    ], Ng2Dropdown.prototype, "menu", void 0);
			    __decorate([
			        core_1.Output(), 
			        __metadata('design:type', core_1.EventEmitter)
			    ], Ng2Dropdown.prototype, "onItemClicked", void 0);
			    __decorate([
			        core_1.Output(), 
			        __metadata('design:type', core_1.EventEmitter)
			    ], Ng2Dropdown.prototype, "onItemSelected", void 0);
			    __decorate([
			        core_1.Output(), 
			        __metadata('design:type', core_1.EventEmitter)
			    ], Ng2Dropdown.prototype, "onShow", void 0);
			    __decorate([
			        core_1.Output(), 
			        __metadata('design:type', core_1.EventEmitter)
			    ], Ng2Dropdown.prototype, "onHide", void 0);
			    Ng2Dropdown = __decorate([
			        core_1.Component({
			            selector: 'ng2-dropdown',
			            styles: [__webpack_require__(22).toString()],
			            template: __webpack_require__(24)
			        }), 
			        __metadata('design:paramtypes', [])
			    ], Ng2Dropdown);
			    return Ng2Dropdown;
			}());
			exports.Ng2Dropdown = Ng2Dropdown;
			
	
		/***/ },
		/* 3 */
		/***/ function(module, exports) {
	
			module.exports = __WEBPACK_EXTERNAL_MODULE_3__;
	
		/***/ },
		/* 4 */
		/***/ function(module, exports, __webpack_require__) {
	
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
			var core_1 = __webpack_require__(3);
			var Ng2DropdownButton = (function () {
			    function Ng2DropdownButton(element) {
			        this.element = element;
			        this.onMenuToggled = new core_1.EventEmitter();
			        this.showCaret = true;
			    }
			    Ng2DropdownButton.prototype.toggleMenu = function () {
			        this.onMenuToggled.emit(true);
			    };
			    Ng2DropdownButton.prototype.getPosition = function () {
			        return this.element.nativeElement.getBoundingClientRect();
			    };
			    __decorate([
			        core_1.Output(), 
			        __metadata('design:type', core_1.EventEmitter)
			    ], Ng2DropdownButton.prototype, "onMenuToggled", void 0);
			    __decorate([
			        core_1.Input(), 
			        __metadata('design:type', Boolean)
			    ], Ng2DropdownButton.prototype, "showCaret", void 0);
			    Ng2DropdownButton = __decorate([
			        core_1.Component({
			            selector: 'ng2-dropdown-button',
			            styles: [__webpack_require__(5).toString()],
			            template: __webpack_require__(10)
			        }), 
			        __metadata('design:paramtypes', [core_1.ElementRef])
			    ], Ng2DropdownButton);
			    return Ng2DropdownButton;
			}());
			exports.Ng2DropdownButton = Ng2DropdownButton;
			
	
		/***/ },
		/* 5 */
		/***/ function(module, exports, __webpack_require__) {
	
			// style-loader: Adds some css to the DOM by adding a <style> tag
	
			// load the styles
			var content = __webpack_require__(6);
			if(typeof content === 'string') content = [[module.id, content, '']];
			// add the styles to the DOM
			var update = __webpack_require__(9)(content, {});
			if(content.locals) module.exports = content.locals;
			// Hot Module Replacement
			if(false) {
				// When the styles change, update the <style> tags
				if(!content.locals) {
					module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./style.scss", function() {
						var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./style.scss");
						if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
						update(newContent);
					});
				}
				// When the module is disposed, remove the <style> tags
				module.hot.dispose(function() { update(); });
			}
	
		/***/ },
		/* 6 */
		/***/ function(module, exports, __webpack_require__) {
	
			exports = module.exports = __webpack_require__(7)();
			// imports
	
	
			// module
			exports.push([module.id, ".ng2-dropdown-button {\n  font-family: \"Helvetica Neue\", Helvetica, Arial;\n  background: #fff;\n  padding: 0.3rem 0.5rem;\n  font-size: 14px;\n  letter-spacing: 0.08rem;\n  color: #444;\n  outline: 0;\n  cursor: pointer;\n  font-weight: 400;\n  border: none;\n  border-bottom: 1px solid #efefef; }\n\n.ng2-dropdown-button:hover {\n  color: #222; }\n\n.ng2-dropdown-button:active {\n  color: #222;\n  border-bottom: 2px solid #2196F3; }\n\n.caret {\n  background: url(" + __webpack_require__(8) + ");\n  width: 16px;\n  height: 12px;\n  display: inline-block; }\n", ""]);
	
			// exports
	
	
		/***/ },
		/* 7 */
		/***/ function(module, exports) {
	
			/*
				MIT License http://www.opensource.org/licenses/mit-license.php
				Author Tobias Koppers @sokra
			*/
			// css base code, injected by the css-loader
			module.exports = function() {
				var list = [];
	
				// return the list of modules as css string
				list.toString = function toString() {
					var result = [];
					for(var i = 0; i < this.length; i++) {
						var item = this[i];
						if(item[2]) {
							result.push("@media " + item[2] + "{" + item[1] + "}");
						} else {
							result.push(item[1]);
						}
					}
					return result.join("");
				};
	
				// import a list of modules into the list
				list.i = function(modules, mediaQuery) {
					if(typeof modules === "string")
						modules = [[null, modules, ""]];
					var alreadyImportedModules = {};
					for(var i = 0; i < this.length; i++) {
						var id = this[i][0];
						if(typeof id === "number")
							alreadyImportedModules[id] = true;
					}
					for(i = 0; i < modules.length; i++) {
						var item = modules[i];
						// skip already imported module
						// this implementation is not 100% perfect for weird media query combinations
						//  when a module is imported multiple times with different media queries.
						//  I hope this will never occur (Hey this way we have smaller bundles)
						if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
							if(mediaQuery && !item[2]) {
								item[2] = mediaQuery;
							} else if(mediaQuery) {
								item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
							}
							list.push(item);
						}
					}
				};
				return list;
			};
	
	
		/***/ },
		/* 8 */
		/***/ function(module, exports) {
	
			module.exports = "\"data:image/svg+xml;charset=utf8,%3C?xml version='1.0' ?%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg enable-background='new 0 0 32 32' height='16px' id='Слой_1' version='1.1' viewBox='0 0 32 32' width='16px' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cpath d='M24.285,11.284L16,19.571l-8.285-8.288c-0.395-0.395-1.034-0.395-1.429,0 c-0.394,0.395-0.394,1.035,0,1.43l8.999,9.002l0,0l0,0c0.394,0.395,1.034,0.395,1.428,0l8.999-9.002 c0.394-0.395,0.394-1.036,0-1.431C25.319,10.889,24.679,10.889,24.285,11.284z' fill='%23121313' id='Expand_More'/%3E%3Cg/%3E%3Cg/%3E%3Cg/%3E%3Cg/%3E%3Cg/%3E%3Cg/%3E%3C/svg%3E\""
	
		/***/ },
		/* 9 */
		/***/ function(module, exports, __webpack_require__) {
	
			/*
				MIT License http://www.opensource.org/licenses/mit-license.php
				Author Tobias Koppers @sokra
			*/
			var stylesInDom = {},
				memoize = function(fn) {
					var memo;
					return function () {
						if (typeof memo === "undefined") memo = fn.apply(this, arguments);
						return memo;
					};
				},
				isOldIE = memoize(function() {
					return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
				}),
				getHeadElement = memoize(function () {
					return document.head || document.getElementsByTagName("head")[0];
				}),
				singletonElement = null,
				singletonCounter = 0,
				styleElementsInsertedAtTop = [];
	
			module.exports = function(list, options) {
				if(true) {
					if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
				}
	
				options = options || {};
				// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
				// tags it will allow on a page
				if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
				// By default, add <style> tags to the bottom of <head>.
				if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
				var styles = listToStyles(list);
				addStylesToDom(styles, options);
	
				return function update(newList) {
					var mayRemove = [];
					for(var i = 0; i < styles.length; i++) {
						var item = styles[i];
						var domStyle = stylesInDom[item.id];
						domStyle.refs--;
						mayRemove.push(domStyle);
					}
					if(newList) {
						var newStyles = listToStyles(newList);
						addStylesToDom(newStyles, options);
					}
					for(var i = 0; i < mayRemove.length; i++) {
						var domStyle = mayRemove[i];
						if(domStyle.refs === 0) {
							for(var j = 0; j < domStyle.parts.length; j++)
								domStyle.parts[j]();
							delete stylesInDom[domStyle.id];
						}
					}
				};
			}
	
			function addStylesToDom(styles, options) {
				for(var i = 0; i < styles.length; i++) {
					var item = styles[i];
					var domStyle = stylesInDom[item.id];
					if(domStyle) {
						domStyle.refs++;
						for(var j = 0; j < domStyle.parts.length; j++) {
							domStyle.parts[j](item.parts[j]);
						}
						for(; j < item.parts.length; j++) {
							domStyle.parts.push(addStyle(item.parts[j], options));
						}
					} else {
						var parts = [];
						for(var j = 0; j < item.parts.length; j++) {
							parts.push(addStyle(item.parts[j], options));
						}
						stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
					}
				}
			}
	
			function listToStyles(list) {
				var styles = [];
				var newStyles = {};
				for(var i = 0; i < list.length; i++) {
					var item = list[i];
					var id = item[0];
					var css = item[1];
					var media = item[2];
					var sourceMap = item[3];
					var part = {css: css, media: media, sourceMap: sourceMap};
					if(!newStyles[id])
						styles.push(newStyles[id] = {id: id, parts: [part]});
					else
						newStyles[id].parts.push(part);
				}
				return styles;
			}
	
			function insertStyleElement(options, styleElement) {
				var head = getHeadElement();
				var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
				if (options.insertAt === "top") {
					if(!lastStyleElementInsertedAtTop) {
						head.insertBefore(styleElement, head.firstChild);
					} else if(lastStyleElementInsertedAtTop.nextSibling) {
						head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
					} else {
						head.appendChild(styleElement);
					}
					styleElementsInsertedAtTop.push(styleElement);
				} else if (options.insertAt === "bottom") {
					head.appendChild(styleElement);
				} else {
					throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
				}
			}
	
			function removeStyleElement(styleElement) {
				styleElement.parentNode.removeChild(styleElement);
				var idx = styleElementsInsertedAtTop.indexOf(styleElement);
				if(idx >= 0) {
					styleElementsInsertedAtTop.splice(idx, 1);
				}
			}
	
			function createStyleElement(options) {
				var styleElement = document.createElement("style");
				styleElement.type = "text/css";
				insertStyleElement(options, styleElement);
				return styleElement;
			}
	
			function createLinkElement(options) {
				var linkElement = document.createElement("link");
				linkElement.rel = "stylesheet";
				insertStyleElement(options, linkElement);
				return linkElement;
			}
	
			function addStyle(obj, options) {
				var styleElement, update, remove;
	
				if (options.singleton) {
					var styleIndex = singletonCounter++;
					styleElement = singletonElement || (singletonElement = createStyleElement(options));
					update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
					remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
				} else if(obj.sourceMap &&
					typeof URL === "function" &&
					typeof URL.createObjectURL === "function" &&
					typeof URL.revokeObjectURL === "function" &&
					typeof Blob === "function" &&
					typeof btoa === "function") {
					styleElement = createLinkElement(options);
					update = updateLink.bind(null, styleElement);
					remove = function() {
						removeStyleElement(styleElement);
						if(styleElement.href)
							URL.revokeObjectURL(styleElement.href);
					};
				} else {
					styleElement = createStyleElement(options);
					update = applyToTag.bind(null, styleElement);
					remove = function() {
						removeStyleElement(styleElement);
					};
				}
	
				update(obj);
	
				return function updateStyle(newObj) {
					if(newObj) {
						if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
							return;
						update(obj = newObj);
					} else {
						remove();
					}
				};
			}
	
			var replaceText = (function () {
				var textStore = [];
	
				return function (index, replacement) {
					textStore[index] = replacement;
					return textStore.filter(Boolean).join('\n');
				};
			})();
	
			function applyToSingletonTag(styleElement, index, remove, obj) {
				var css = remove ? "" : obj.css;
	
				if (styleElement.styleSheet) {
					styleElement.styleSheet.cssText = replaceText(index, css);
				} else {
					var cssNode = document.createTextNode(css);
					var childNodes = styleElement.childNodes;
					if (childNodes[index]) styleElement.removeChild(childNodes[index]);
					if (childNodes.length) {
						styleElement.insertBefore(cssNode, childNodes[index]);
					} else {
						styleElement.appendChild(cssNode);
					}
				}
			}
	
			function applyToTag(styleElement, obj) {
				var css = obj.css;
				var media = obj.media;
	
				if(media) {
					styleElement.setAttribute("media", media)
				}
	
				if(styleElement.styleSheet) {
					styleElement.styleSheet.cssText = css;
				} else {
					while(styleElement.firstChild) {
						styleElement.removeChild(styleElement.firstChild);
					}
					styleElement.appendChild(document.createTextNode(css));
				}
			}
	
			function updateLink(linkElement, obj) {
				var css = obj.css;
				var sourceMap = obj.sourceMap;
	
				if(sourceMap) {
					// http://stackoverflow.com/a/26603875
					css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
				}
	
				var blob = new Blob([css], { type: "text/css" });
	
				var oldSrc = linkElement.href;
	
				linkElement.href = URL.createObjectURL(blob);
	
				if(oldSrc)
					URL.revokeObjectURL(oldSrc);
			}
	
	
		/***/ },
		/* 10 */
		/***/ function(module, exports) {
	
			module.exports = "<button class='ng2-dropdown-button' (click)=\"toggleMenu()\">\n    <ng-content></ng-content>\n\n    <span class=\"caret\" [hidden]=\"!showCaret\"></span>\n</button>\n";
	
		/***/ },
		/* 11 */
		/***/ function(module, exports, __webpack_require__) {
	
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
			var core_1 = __webpack_require__(3);
			var animations_1 = __webpack_require__(12);
			var actions_1 = __webpack_require__(13);
			var ng2_menu_item_1 = __webpack_require__(14);
			var ng2_dropdown_1 = __webpack_require__(2);
			var Ng2DropdownMenu = (function () {
			    function Ng2DropdownMenu(dropdown, element, renderer) {
			        var _this = this;
			        this.dropdown = dropdown;
			        this.element = element;
			        this.renderer = renderer;
			        this.width = 4;
			        this.focusFirstElement = true;
			        this.state = {
			            isVisible: false,
			            toString: function () {
			                return _this.state.isVisible ? 'visible' : 'hidden';
			            }
			        };
			    }
			    Ng2DropdownMenu.prototype.show = function () {
			        this.renderer.setElementStyle(this.getMenuElement(), 'display', 'block');
			        this.state.isVisible = true;
			        if (this.focusFirstElement) {
			            this.dropdown.state.select(this.items.first, false);
			        }
			    };
			    Ng2DropdownMenu.prototype.hide = function () {
			        this.state.isVisible = false;
			        this.renderer.setElementStyle(this.getMenuElement(), 'display', 'none');
			        this.dropdown.state.unselect();
			    };
			    Ng2DropdownMenu.prototype.updatePosition = function (position) {
			        this.position = position;
			    };
			    Ng2DropdownMenu.prototype.handleKeypress = function ($event) {
			        if (!this.state.isVisible) {
			            return;
			        }
			        var key = $event.keyCode, items = this.items.toArray(), index = items.indexOf(this.dropdown.state.selectedItem);
			        if (!actions_1.ACTIONS.hasOwnProperty(key)) {
			            return;
			        }
			        actions_1.ACTIONS[key].call(this, index, items, this.dropdown.state);
			        $event.preventDefault();
			    };
			    Ng2DropdownMenu.prototype.getMenuElement = function () {
			        return this.element.nativeElement.children[0];
			    };
			    Ng2DropdownMenu.prototype.calcPositionOffset = function (position) {
			        var _a = this.applyOffset((position.top + window.scrollY - 15) + "px", (position.left + window.scrollX - 5) + "px"), top = _a.top, left = _a.left;
			        var element = this.getMenuElement(), clientWidth = element.clientWidth, clientHeight = element.clientHeight, marginFromBottom = parseInt(top) + clientHeight, marginFromRight = parseInt(left) + clientWidth, windowScrollHeight = window.innerHeight + window.scrollY, windowScrollWidth = window.innerWidth + window.scrollX;
			        if (marginFromBottom >= windowScrollHeight) {
			            top = (parseInt(top.replace('px', '')) - clientHeight) + "px";
			        }
			        if (marginFromRight >= windowScrollWidth) {
			            var marginRight = marginFromRight - windowScrollWidth + 30;
			            left = (parseInt(left.replace('px', '')) - marginRight) + "px";
			        }
			        return { top: top, left: left };
			    };
			    Ng2DropdownMenu.prototype.applyOffset = function (top, left) {
			        if (!this.offset) {
			            return { top: top, left: left };
			        }
			        var offset = this.offset.split(' ');
			        if (!offset[1]) {
			            offset[1] = '0';
			        }
			        top = (parseInt(top.replace('px', '')) + parseInt(offset[0])) + "px";
			        left = (parseInt(left.replace('px', '')) + parseInt(offset[1])) + "px";
			        return { top: top, left: left };
			    };
			    Ng2DropdownMenu.prototype.ngOnInit = function () {
			        var body = document.querySelector('body');
			        body.appendChild(this.element.nativeElement);
			        this.renderer.listen(body, 'keyup', this.handleKeypress.bind(this));
			    };
			    Ng2DropdownMenu.prototype.ngDoCheck = function () {
			        if (this.state.isVisible) {
			            var element = this.getMenuElement();
			            var _a = this.calcPositionOffset(this.position), top_1 = _a.top, left = _a.left;
			            this.renderer.setElementStyle(element, 'top', top_1);
			            this.renderer.setElementStyle(element, 'left', left);
			        }
			    };
			    __decorate([
			        core_1.Input(), 
			        __metadata('design:type', Number)
			    ], Ng2DropdownMenu.prototype, "width", void 0);
			    __decorate([
			        core_1.Input(), 
			        __metadata('design:type', Boolean)
			    ], Ng2DropdownMenu.prototype, "focusFirstElement", void 0);
			    __decorate([
			        core_1.Input(), 
			        __metadata('design:type', String)
			    ], Ng2DropdownMenu.prototype, "offset", void 0);
			    __decorate([
			        core_1.ContentChildren(ng2_menu_item_1.Ng2MenuItem), 
			        __metadata('design:type', core_1.QueryList)
			    ], Ng2DropdownMenu.prototype, "items", void 0);
			    Ng2DropdownMenu = __decorate([
			        core_1.Component({
			            selector: 'ng2-dropdown-menu',
			            styles: [__webpack_require__(18).toString()],
			            template: __webpack_require__(20),
			            animations: animations_1.animations
			        }),
			        __param(0, core_1.Inject(core_1.forwardRef(function () { return ng2_dropdown_1.Ng2Dropdown; }))), 
			        __metadata('design:paramtypes', [ng2_dropdown_1.Ng2Dropdown, core_1.ElementRef, core_1.Renderer])
			    ], Ng2DropdownMenu);
			    return Ng2DropdownMenu;
			}());
			exports.Ng2DropdownMenu = Ng2DropdownMenu;
			
	
		/***/ },
		/* 12 */
		/***/ function(module, exports, __webpack_require__) {
	
			"use strict";
			var core_1 = __webpack_require__(3);
			exports.animations = [
			    core_1.trigger('fade', [
			        core_1.state('visible', core_1.style({
			            width: '100%',
			            maxHeight: '350px',
			            opacity: 1
			        })),
			        core_1.state('hidden', core_1.style({
			            width: '0px',
			            maxHeight: '0px',
			            opacity: 0
			        })),
			        core_1.transition('visible => hidden', [
			            core_1.animate('100ms ease-out')
			        ]),
			        core_1.transition('hidden => visible', [
			            core_1.animate('150ms cubic-bezier(0.55, 0, 0.55, 0.2)')
			        ])
			    ])
			];
			
	
		/***/ },
		/* 13 */
		/***/ function(module, exports) {
	
			"use strict";
			var KEYS = {
			    ENTER: 13,
			    BACKSPACE: 9,
			    PREV: 38,
			    NEXT: 40
			};
			var onSwitchNext = function (index, items, state) {
			    if (index < items.length - 1) {
			        state.select(items[index + 1], true);
			    }
			};
			var onSwitchPrev = function (index, items, state) {
			    if (index > 0) {
			        state.select(items[index - 1], true);
			    }
			};
			var onBackspace = function (index, items, state) {
			    if (index < items.length - 1) {
			        state.select(items[index + 1], true);
			    }
			    else {
			        state.select(items[0], true);
			    }
			};
			var onEnter = function (index, items, state) {
			    if (!state.selectedItem) {
			        return;
			    }
			    state.onItemClicked.emit(state.selectedItem);
			};
			exports.ACTIONS = (_a = {},
			    _a[KEYS.BACKSPACE] = onBackspace,
			    _a[KEYS.PREV] = onSwitchPrev,
			    _a[KEYS.NEXT] = onSwitchNext,
			    _a[KEYS.ENTER] = onEnter,
			    _a
			);
			var _a;
	
	
		/***/ },
		/* 14 */
		/***/ function(module, exports, __webpack_require__) {
	
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
			var core_1 = __webpack_require__(3);
			var ng2_dropdown_1 = __webpack_require__(2);
			var Ng2MenuItem = (function () {
			    function Ng2MenuItem(dropdown) {
			        this.dropdown = dropdown;
			        this.preventClose = false;
			    }
			    Object.defineProperty(Ng2MenuItem.prototype, "isSelected", {
			        get: function () {
			            return this === this.dropdown.state.selectedItem;
			        },
			        enumerable: true,
			        configurable: true
			    });
			    Ng2MenuItem.prototype.select = function () {
			        this.dropdown.state.select(this, true);
			    };
			    Ng2MenuItem.prototype.click = function () {
			        this.dropdown.state.onItemClicked.emit(this);
			    };
			    __decorate([
			        core_1.Input(), 
			        __metadata('design:type', Boolean)
			    ], Ng2MenuItem.prototype, "preventClose", void 0);
			    __decorate([
			        core_1.Input(), 
			        __metadata('design:type', Object)
			    ], Ng2MenuItem.prototype, "value", void 0);
			    Ng2MenuItem = __decorate([
			        core_1.Component({
			            selector: 'ng2-menu-item',
			            styles: [__webpack_require__(15).toString()],
			            template: __webpack_require__(17)
			        }),
			        __param(0, core_1.Inject(core_1.forwardRef(function () { return ng2_dropdown_1.Ng2Dropdown; }))), 
			        __metadata('design:paramtypes', [ng2_dropdown_1.Ng2Dropdown])
			    ], Ng2MenuItem);
			    return Ng2MenuItem;
			}());
			exports.Ng2MenuItem = Ng2MenuItem;
			
	
		/***/ },
		/* 15 */
		/***/ function(module, exports, __webpack_require__) {
	
			// style-loader: Adds some css to the DOM by adding a <style> tag
	
			// load the styles
			var content = __webpack_require__(16);
			if(typeof content === 'string') content = [[module.id, content, '']];
			// add the styles to the DOM
			var update = __webpack_require__(9)(content, {});
			if(content.locals) module.exports = content.locals;
			// Hot Module Replacement
			if(false) {
				// When the styles change, update the <style> tags
				if(!content.locals) {
					module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./style.scss", function() {
						var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./style.scss");
						if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
						update(newContent);
					});
				}
				// When the module is disposed, remove the <style> tags
				module.hot.dispose(function() { update(); });
			}
	
		/***/ },
		/* 16 */
		/***/ function(module, exports, __webpack_require__) {
	
			exports = module.exports = __webpack_require__(7)();
			// imports
	
	
			// module
			exports.push([module.id, ".ng2-menu-item {\n  font-family: \"Roboto\", \"Helvetica Neue\", Helvetica, Arial;\n  padding: 0 1.25rem;\n  background: #fff;\n  color: #444;\n  cursor: pointer;\n  font-size: 15px;\n  text-transform: none;\n  font-weight: 400;\n  -webkit-transition: background 0.2s;\n  transition: background 0.2s;\n  letter-spacing: 0.03em;\n  height: 48px;\n  line-height: 48px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow-x: hidden; }\n\n.ng2-menu-item--selected {\n  background: #f9f9f9;\n  outline: 0; }\n\n.ng2-menu-item:focus {\n  outline: 0; }\n\n.ng2-menu-item:active {\n  background: #eee; }\n\n.ng2-menu-item [ng2-menu-item-icon] {\n  vertical-align: bottom;\n  font-size: 28px;\n  width: 40px;\n  height: 40px;\n  color: rgba(0, 0, 0, 0.54); }\n", ""]);
	
			// exports
	
	
		/***/ },
		/* 17 */
		/***/ function(module, exports) {
	
			module.exports = "<div class='ng2-menu-item'\n     [class.ng2-menu-item--selected]=\"isSelected\"\n     [attr.role]=\"button\"\n     (click)=\"click()\"\n     (mouseover)=\"select()\">\n        <ng-content></ng-content>\n</div>\n";
	
		/***/ },
		/* 18 */
		/***/ function(module, exports, __webpack_require__) {
	
			// style-loader: Adds some css to the DOM by adding a <style> tag
	
			// load the styles
			var content = __webpack_require__(19);
			if(typeof content === 'string') content = [[module.id, content, '']];
			// add the styles to the DOM
			var update = __webpack_require__(9)(content, {});
			if(content.locals) module.exports = content.locals;
			// Hot Module Replacement
			if(false) {
				// When the styles change, update the <style> tags
				if(!content.locals) {
					module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./style.scss", function() {
						var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./style.scss");
						if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
						update(newContent);
					});
				}
				// When the module is disposed, remove the <style> tags
				module.hot.dispose(function() { update(); });
			}
	
		/***/ },
		/* 19 */
		/***/ function(module, exports, __webpack_require__) {
	
			exports = module.exports = __webpack_require__(7)();
			// imports
	
	
			// module
			exports.push([module.id, ".ng2-dropdown-menu-container {\n  position: absolute;\n  z-index: 2;\n  overflow-y: auto;\n  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);\n  padding: 0.5em 0;\n  background: #fff;\n  border-radius: 2px;\n  display: none;\n  max-height: 400px; }\n\n.ng2-dropdown-menu-container.ng2-dropdown-menu-container--open {\n  display: block; }\n\n.ng2-dropdown-menu-container--2 {\n  width: 150px; }\n\n.ng2-dropdown-menu-container--4 {\n  width: 250px; }\n\n.ng2-dropdown-menu-container--6 {\n  width: 320px; }\n\n.ng2-dropdown-menu-container:focus {\n  outline: 0;\n  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.3); }\n\n.ng2-dropdown-menu {\n  position: relative; }\n\n.ng2-dropdown-menu * {\n  opacity: 0;\n  -webkit-transition: opacity 0.5s;\n  transition: opacity 0.5s; }\n\n.ng2-dropdown-menu-container.ng2-dropdown-menu-container--open * {\n  opacity: 1; }\n\n.ng2-dropdown-backdrop {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 1; }\n\n.ng2-menu-divider {\n  height: 1px;\n  min-height: 1px;\n  max-height: 1px;\n  width: 100%;\n  display: block;\n  background: #f9f9f9; }\n", ""]);
	
			// exports
	
	
		/***/ },
		/* 20 */
		/***/ function(module, exports) {
	
			module.exports = "<!-- CONTAINER -->\n<div class=\"ng2-dropdown-menu-container ng2-dropdown-menu-container--{{ width }}\"\n     [class.ng2-dropdown-menu-container--open]=\"state.isVisible\"\n     tabindex=\"0\">\n\n    <!-- MENU -->\n    <div class='ng2-dropdown-menu' [@fade]=\"state.toString()\">\n        <ng-content></ng-content>\n    </div>\n</div>\n\n<!-- BACKDROP -->\n<div class=\"ng2-dropdown-backdrop\" [hidden]=\"!state.isVisible\" (click)=\"hide()\"></div>\n";
	
		/***/ },
		/* 21 */
		/***/ function(module, exports, __webpack_require__) {
	
			"use strict";
			var core_1 = __webpack_require__(3);
			var Ng2DropdownState = (function () {
			    function Ng2DropdownState() {
			        this.onItemSelected = new core_1.EventEmitter();
			        this.onItemClicked = new core_1.EventEmitter();
			    }
			    Object.defineProperty(Ng2DropdownState.prototype, "selectedItem", {
			        get: function () {
			            return this._selectedItem;
			        },
			        enumerable: true,
			        configurable: true
			    });
			    Ng2DropdownState.prototype.select = function (item, dispatchEvent) {
			        if (dispatchEvent === void 0) { dispatchEvent = true; }
			        this._selectedItem = item;
			        if (!dispatchEvent) {
			            return;
			        }
			        this.onItemSelected.emit(item);
			    };
			    Ng2DropdownState.prototype.unselect = function () {
			        this._selectedItem = undefined;
			    };
			    return Ng2DropdownState;
			}());
			exports.Ng2DropdownState = Ng2DropdownState;
			
	
		/***/ },
		/* 22 */
		/***/ function(module, exports, __webpack_require__) {
	
			// style-loader: Adds some css to the DOM by adding a <style> tag
	
			// load the styles
			var content = __webpack_require__(23);
			if(typeof content === 'string') content = [[module.id, content, '']];
			// add the styles to the DOM
			var update = __webpack_require__(9)(content, {});
			if(content.locals) module.exports = content.locals;
			// Hot Module Replacement
			if(false) {
				// When the styles change, update the <style> tags
				if(!content.locals) {
					module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./style.scss", function() {
						var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./../../../../node_modules/sass-loader/index.js!./style.scss");
						if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
						update(newContent);
					});
				}
				// When the module is disposed, remove the <style> tags
				module.hot.dispose(function() { update(); });
			}
	
		/***/ },
		/* 23 */
		/***/ function(module, exports, __webpack_require__) {
	
			exports = module.exports = __webpack_require__(7)();
			// imports
	
	
			// module
			exports.push([module.id, "", ""]);
	
			// exports
	
	
		/***/ },
		/* 24 */
		/***/ function(module, exports) {
	
			module.exports = "<div class=\"ng2-dropdown-container\">\n    <ng-content select=\"ng2-dropdown-button\"></ng-content>\n    <ng-content select=\"ng2-dropdown-menu\"></ng-content>\n</div>\n";
	
		/***/ }
		/******/ ])
		});
		;
	
	
	/***/ },
	/* 14 */
	/***/ function(module, exports) {
	
		"use strict";
		var TagInputAccessor = (function () {
		    function TagInputAccessor() {
		        this._items = [];
		    }
		    Object.defineProperty(TagInputAccessor.prototype, "items", {
		        get: function () {
		            return this._items;
		        },
		        set: function (items) {
		            this._items = items;
		            this._onChangeCallback(items);
		        },
		        enumerable: true,
		        configurable: true
		    });
		    ;
		    TagInputAccessor.prototype.onTouched = function (items) {
		        this._onTouchedCallback(items);
		    };
		    TagInputAccessor.prototype.writeValue = function (items) {
		        this._items = items || [];
		    };
		    TagInputAccessor.prototype.registerOnChange = function (fn) {
		        this._onChangeCallback = fn;
		    };
		    TagInputAccessor.prototype.registerOnTouched = function (fn) {
		        this._onTouchedCallback = fn;
		    };
		    return TagInputAccessor;
		}());
		exports.TagInputAccessor = TagInputAccessor;
		
	
	/***/ },
	/* 15 */
	/***/ function(module, exports, __webpack_require__) {
	
		"use strict";
		var constants_1 = __webpack_require__(11);
		function getAction(KEY) {
		    var ACTION_TYPE = constants_1.KEY_PRESS_ACTIONS[KEY];
		    var action;
		    switch (ACTION_TYPE) {
		        case constants_1.ACTIONS_KEYS.DELETE:
		            action = deleteSelectedTag;
		            break;
		        case constants_1.ACTIONS_KEYS.SWITCH_PREV:
		            action = switchPrev;
		            break;
		        case constants_1.ACTIONS_KEYS.SWITCH_NEXT:
		            action = switchNext;
		            break;
		        case constants_1.ACTIONS_KEYS.TAB:
		            action = switchNext;
		            break;
		        default:
		            return function () { };
		    }
		    return action;
		}
		exports.getAction = getAction;
		function deleteSelectedTag() {
		    if (this.selectedTag) {
		        this.removeItem(this.selectedTag);
		    }
		}
		function switchPrev(itemIndex) {
		    if (itemIndex > 0) {
		        var el = this.tagElements[itemIndex - 1];
		        this.selectItem(this.items[itemIndex - 1]);
		        this.renderer.invokeElementMethod(el, 'focus', []);
		    }
		    else {
		        this.focus(true);
		    }
		}
		function switchNext(itemIndex) {
		    if (itemIndex < this.items.length - 1) {
		        var el = this.tagElements[itemIndex + 1];
		        this.selectItem(this.items[itemIndex + 1]);
		        this.renderer.invokeElementMethod(el, 'focus', []);
		    }
		    else {
		        this.focus(true);
		    }
		}
		
	
	/***/ },
	/* 16 */
	/***/ function(module, exports) {
	
		module.exports = __WEBPACK_EXTERNAL_MODULE_16__;
	
	/***/ },
	/* 17 */
	/***/ function(module, exports, __webpack_require__) {
	
		// style-loader: Adds some css to the DOM by adding a <style> tag
	
		// load the styles
		var content = __webpack_require__(18);
		if(typeof content === 'string') content = [[module.id, content, '']];
		// add the styles to the DOM
		var update = __webpack_require__(20)(content, {});
		if(content.locals) module.exports = content.locals;
		// Hot Module Replacement
		if(false) {
			// When the styles change, update the <style> tags
			if(!content.locals) {
				module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./../../node_modules/sass-loader/index.js!./tag-input.style.scss", function() {
					var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./../../node_modules/sass-loader/index.js!./tag-input.style.scss");
					if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
					update(newContent);
				});
			}
			// When the module is disposed, remove the <style> tags
			module.hot.dispose(function() { update(); });
		}
	
	/***/ },
	/* 18 */
	/***/ function(module, exports, __webpack_require__) {
	
		exports = module.exports = __webpack_require__(19)();
		// imports
	
	
		// module
		exports.push([module.id, ".ng2-tag-input {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  -webkit-transition: all 0.15s;\n  transition: all 0.15s;\n  padding: 0.25rem 0.2rem;\n  min-height: 32px;\n  cursor: text; }\n\n.ng2-tag-input:focus {\n  outline: 0; }\n\n.ng2-tags-container {\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex; }\n\n.ng2-tag-input form {\n  margin: 0.1em 0; }\n\n.ng2-tag-input__text-input {\n  border: none;\n  display: inline;\n  padding: 0 0.5rem;\n  vertical-align: middle;\n  font-size: 15px;\n  height: 35px;\n  font-family: \"Roboto\", \"Helvetica Neue\", sans-serif; }\n\n.ng2-tag-input__text-input:focus {\n  outline: 0; }\n\n.ng2-tag--readonly {\n  cursor: default; }\n\n.ng2-tag--readonly:focus, .tag {\n  outline: 0; }\n\n.ng2-tag {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  font-family: \"Roboto\", \"Helvetica Neue\", sans-serif;\n  font-weight: 400;\n  font-size: 1em;\n  letter-spacing: 0.05rem;\n  outline: 0;\n  color: #222;\n  cursor: pointer;\n  border-radius: 16px;\n  -webkit-transition: all 0.25s;\n  transition: all 0.25s;\n  margin: 0.1rem 0.2rem;\n  padding: 0.08rem 0.45rem;\n  height: 32px;\n  line-height: 34px; }\n\n.ng2-tag__remove-button {\n  margin-left: 3px;\n  width: 16px;\n  height: 26px;\n  -ms-flex-item-align: center;\n      align-self: center;\n  -webkit-transition: all 0.15s;\n  transition: all 0.15s; }\n\n.ng2-tag__remove-button:hover {\n  -webkit-transform: scale(1.3);\n          transform: scale(1.3); }\n\n.ng2-tag-input__error-message {\n  font-size: 0.8em;\n  color: #f44336;\n  margin: 0.5em 0; }\n\n.default.ng2-tag-input--invalid, .minimal.ng2-tag-input--invalid, .dark.ng2-tag-input--invalid {\n  border-bottom: 2px solid #f44336; }\n\n.ng2-tag-input.default {\n  border-bottom: 2px solid #efefef; }\n\n.default.ng2-tag-input--focused {\n  border-bottom: 2px solid #2196F3; }\n\n.default .ng2-tag {\n  background: #efefef; }\n\n.default .ng2-tag:not(.ng2-tag--readonly):focus {\n  background: #2196F3;\n  color: #fff; }\n\n.default .ng2-tag:not(:focus):not(.ng2-tag--readonly):hover {\n  background: #e6e6e6; }\n\n.default .ng2-tag:focus path {\n  fill: #fff; }\n\n.ng2-tag-input.minimal {\n  border-bottom: 1px solid transparent; }\n\n.minimal .ng2-tag {\n  background: #f9f9f9;\n  border-radius: 0; }\n\n.minimal .ng2-tag:not(.ng2-tag--readonly):focus {\n  background: #ddd; }\n\n.minimal .ng2-tag:not(:focus):not(.ng2-tag--readonly):hover {\n  background: #f0f0f0; }\n\n.minimal .ng2-tag:not(:focus):not(.ng2-tag--readonly):hover {\n  background: #f0f0f0; }\n\n.ng2-tag-input.dark {\n  border-bottom: 2px solid #212121; }\n\n.dark .ng2-tag {\n  background: #212121;\n  color: #f9f9f9; }\n\n.dark .ng2-tag:not(.ng2-tag--readonly):focus {\n  background: #999;\n  color: #212121; }\n\n.dark path {\n  fill: #fff; }\n", ""]);
	
		// exports
	
	
	/***/ },
	/* 19 */
	/***/ function(module, exports) {
	
		/*
			MIT License http://www.opensource.org/licenses/mit-license.php
			Author Tobias Koppers @sokra
		*/
		// css base code, injected by the css-loader
		module.exports = function() {
			var list = [];
	
			// return the list of modules as css string
			list.toString = function toString() {
				var result = [];
				for(var i = 0; i < this.length; i++) {
					var item = this[i];
					if(item[2]) {
						result.push("@media " + item[2] + "{" + item[1] + "}");
					} else {
						result.push(item[1]);
					}
				}
				return result.join("");
			};
	
			// import a list of modules into the list
			list.i = function(modules, mediaQuery) {
				if(typeof modules === "string")
					modules = [[null, modules, ""]];
				var alreadyImportedModules = {};
				for(var i = 0; i < this.length; i++) {
					var id = this[i][0];
					if(typeof id === "number")
						alreadyImportedModules[id] = true;
				}
				for(i = 0; i < modules.length; i++) {
					var item = modules[i];
					// skip already imported module
					// this implementation is not 100% perfect for weird media query combinations
					//  when a module is imported multiple times with different media queries.
					//  I hope this will never occur (Hey this way we have smaller bundles)
					if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
						if(mediaQuery && !item[2]) {
							item[2] = mediaQuery;
						} else if(mediaQuery) {
							item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
						}
						list.push(item);
					}
				}
			};
			return list;
		};
	
	
	/***/ },
	/* 20 */
	/***/ function(module, exports, __webpack_require__) {
	
		/*
			MIT License http://www.opensource.org/licenses/mit-license.php
			Author Tobias Koppers @sokra
		*/
		var stylesInDom = {},
			memoize = function(fn) {
				var memo;
				return function () {
					if (typeof memo === "undefined") memo = fn.apply(this, arguments);
					return memo;
				};
			},
			isOldIE = memoize(function() {
				return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
			}),
			getHeadElement = memoize(function () {
				return document.head || document.getElementsByTagName("head")[0];
			}),
			singletonElement = null,
			singletonCounter = 0,
			styleElementsInsertedAtTop = [];
	
		module.exports = function(list, options) {
			if(true) {
				if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
			}
	
			options = options || {};
			// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
			// tags it will allow on a page
			if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
			// By default, add <style> tags to the bottom of <head>.
			if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
			var styles = listToStyles(list);
			addStylesToDom(styles, options);
	
			return function update(newList) {
				var mayRemove = [];
				for(var i = 0; i < styles.length; i++) {
					var item = styles[i];
					var domStyle = stylesInDom[item.id];
					domStyle.refs--;
					mayRemove.push(domStyle);
				}
				if(newList) {
					var newStyles = listToStyles(newList);
					addStylesToDom(newStyles, options);
				}
				for(var i = 0; i < mayRemove.length; i++) {
					var domStyle = mayRemove[i];
					if(domStyle.refs === 0) {
						for(var j = 0; j < domStyle.parts.length; j++)
							domStyle.parts[j]();
						delete stylesInDom[domStyle.id];
					}
				}
			};
		}
	
		function addStylesToDom(styles, options) {
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				if(domStyle) {
					domStyle.refs++;
					for(var j = 0; j < domStyle.parts.length; j++) {
						domStyle.parts[j](item.parts[j]);
					}
					for(; j < item.parts.length; j++) {
						domStyle.parts.push(addStyle(item.parts[j], options));
					}
				} else {
					var parts = [];
					for(var j = 0; j < item.parts.length; j++) {
						parts.push(addStyle(item.parts[j], options));
					}
					stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
				}
			}
		}
	
		function listToStyles(list) {
			var styles = [];
			var newStyles = {};
			for(var i = 0; i < list.length; i++) {
				var item = list[i];
				var id = item[0];
				var css = item[1];
				var media = item[2];
				var sourceMap = item[3];
				var part = {css: css, media: media, sourceMap: sourceMap};
				if(!newStyles[id])
					styles.push(newStyles[id] = {id: id, parts: [part]});
				else
					newStyles[id].parts.push(part);
			}
			return styles;
		}
	
		function insertStyleElement(options, styleElement) {
			var head = getHeadElement();
			var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
			if (options.insertAt === "top") {
				if(!lastStyleElementInsertedAtTop) {
					head.insertBefore(styleElement, head.firstChild);
				} else if(lastStyleElementInsertedAtTop.nextSibling) {
					head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
				} else {
					head.appendChild(styleElement);
				}
				styleElementsInsertedAtTop.push(styleElement);
			} else if (options.insertAt === "bottom") {
				head.appendChild(styleElement);
			} else {
				throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
			}
		}
	
		function removeStyleElement(styleElement) {
			styleElement.parentNode.removeChild(styleElement);
			var idx = styleElementsInsertedAtTop.indexOf(styleElement);
			if(idx >= 0) {
				styleElementsInsertedAtTop.splice(idx, 1);
			}
		}
	
		function createStyleElement(options) {
			var styleElement = document.createElement("style");
			styleElement.type = "text/css";
			insertStyleElement(options, styleElement);
			return styleElement;
		}
	
		function createLinkElement(options) {
			var linkElement = document.createElement("link");
			linkElement.rel = "stylesheet";
			insertStyleElement(options, linkElement);
			return linkElement;
		}
	
		function addStyle(obj, options) {
			var styleElement, update, remove;
	
			if (options.singleton) {
				var styleIndex = singletonCounter++;
				styleElement = singletonElement || (singletonElement = createStyleElement(options));
				update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
				remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
			} else if(obj.sourceMap &&
				typeof URL === "function" &&
				typeof URL.createObjectURL === "function" &&
				typeof URL.revokeObjectURL === "function" &&
				typeof Blob === "function" &&
				typeof btoa === "function") {
				styleElement = createLinkElement(options);
				update = updateLink.bind(null, styleElement);
				remove = function() {
					removeStyleElement(styleElement);
					if(styleElement.href)
						URL.revokeObjectURL(styleElement.href);
				};
			} else {
				styleElement = createStyleElement(options);
				update = applyToTag.bind(null, styleElement);
				remove = function() {
					removeStyleElement(styleElement);
				};
			}
	
			update(obj);
	
			return function updateStyle(newObj) {
				if(newObj) {
					if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
						return;
					update(obj = newObj);
				} else {
					remove();
				}
			};
		}
	
		var replaceText = (function () {
			var textStore = [];
	
			return function (index, replacement) {
				textStore[index] = replacement;
				return textStore.filter(Boolean).join('\n');
			};
		})();
	
		function applyToSingletonTag(styleElement, index, remove, obj) {
			var css = remove ? "" : obj.css;
	
			if (styleElement.styleSheet) {
				styleElement.styleSheet.cssText = replaceText(index, css);
			} else {
				var cssNode = document.createTextNode(css);
				var childNodes = styleElement.childNodes;
				if (childNodes[index]) styleElement.removeChild(childNodes[index]);
				if (childNodes.length) {
					styleElement.insertBefore(cssNode, childNodes[index]);
				} else {
					styleElement.appendChild(cssNode);
				}
			}
		}
	
		function applyToTag(styleElement, obj) {
			var css = obj.css;
			var media = obj.media;
	
			if(media) {
				styleElement.setAttribute("media", media)
			}
	
			if(styleElement.styleSheet) {
				styleElement.styleSheet.cssText = css;
			} else {
				while(styleElement.firstChild) {
					styleElement.removeChild(styleElement.firstChild);
				}
				styleElement.appendChild(document.createTextNode(css));
			}
		}
	
		function updateLink(linkElement, obj) {
			var css = obj.css;
			var sourceMap = obj.sourceMap;
	
			if(sourceMap) {
				// http://stackoverflow.com/a/26603875
				css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
			}
	
			var blob = new Blob([css], { type: "text/css" });
	
			var oldSrc = linkElement.href;
	
			linkElement.href = URL.createObjectURL(blob);
	
			if(oldSrc)
				URL.revokeObjectURL(oldSrc);
		}
	
	
	/***/ },
	/* 21 */
	/***/ function(module, exports) {
	
		module.exports = "\n<!-- input tag container -->\n<div ngClass=\"ng2-tag-input {{ theme }}\"\n     (click)=\"focus(true)\"\n     [attr.tabindex]=\"-1\"\n     [class.ng2-tag-input--invalid]=\"hasErrors()\"\n     [class.ng2-tag-input--focused]=\"isInputFocused()\">\n\n    <!-- tags [custom] -->\n    <div #template class=\"ng2-tags-container ng2-tags-container--custom\">\n        <ng-content></ng-content>\n\n        <tag-input-form\n            *ngIf=\"hasCustomTemplate()\"\n            (onSubmit)=\"addItem()\"\n            (onBlur)=\"blur()\"\n            (onFocus)=\"focus()\"\n            (onKeydown)=\"fireEvents('keydown', $event)\"\n            (onKeyup)=\"fireEvents('keyup', $event)\"\n            (onKeypress)=\"handleKeyPress()\"\n            [validators]=\"validators\"\n            [hidden]=\"readonly || maxItemsReached\"\n            [placeholder]=\"items.length ? placeholder : secondaryPlaceholder\"\n            [inputClass]=\"inputClass\"\n            [inputId]=\"inputId\"\n        ></tag-input-form>\n    </div>\n\n    <!-- tags [default] -->\n    <div class=\"ng2-tags-container ng2-tags-container--default\" *ngIf=\"hasCustomTemplate() === false\">\n        <div *ngFor=\"let item of items\"\n             (click)=\"selectItem(item);$event.stopPropagation();\"\n             (keydown)=\"handleKeydown($event, item)\"\n             [attr.tabindex]=\"readonly ? -1 : 0\"\n             class=\"ng2-tag\"\n             [class.ng2-tag--readonly]=\"readonly\"\n             [attr.aria-label]=\"item\">\n\n            <!-- tag name -->\n            <span class=\"ng2-tag__name\">\n                {{ item }}\n            </span>\n\n            <!-- remove 'x' button -->\n            <delete-icon class=\"ng2-tag__remove-button\"\n                  aria-label=\"Remove tag\"\n                  (click)=\"removeItem(item)\"\n                  *ngIf=\"!readonly\">\n            </delete-icon>\n        </div>\n\n        <tag-input-form\n            (onSubmit)=\"addItem()\"\n            (onBlur)=\"blur()\"\n            (onFocus)=\"focus()\"\n            (onKeydown)=\"fireEvents('keydown', $event)\"\n            (onKeyup)=\"fireEvents('keyup', $event)\"\n            [validators]=\"validators\"\n            [hidden]=\"readonly || maxItemsReached\"\n            [placeholder]=\"items.length ? placeholder : secondaryPlaceholder\"\n            [inputClass]=\"inputClass\"\n            [inputId]=\"inputId\"\n        ></tag-input-form>\n    </div>\n\n    <div *ngIf=\"autocomplete\">\n        <ng2-dropdown>\n            <ng2-dropdown-menu [focusFirstElement]=\"false\"\n                               (keydown)=\"escapeDropdown($event)\"\n                               offset=\"50 0\">\n                <ng2-menu-item *ngFor=\"let item of itemsMatching\" [value]=\"item\">\n                    <span [innerHTML]=\"item | highlight : inputForm.value.value\"></span>\n                </ng2-menu-item>\n            </ng2-dropdown-menu>\n        </ng2-dropdown>\n    </div>\n</div>\n\n<!-- ERRORS -->\n<div class=\"ng2-tag-input__errors-container\" *ngIf=\"hasErrors()\">\n    <p *ngFor=\"let error of inputForm.getErrorMessages(errorMessages)\"\n       class=\"ng2-tag-input__error-message\">\n        <span>{{ error }}</span>\n    </p>\n</div>\n";
	
	/***/ },
	/* 22 */
	/***/ function(module, exports) {
	
		module.exports = __WEBPACK_EXTERNAL_MODULE_22__;
	
	/***/ },
	/* 23 */
	/***/ function(module, exports, __webpack_require__) {
	
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
		var core_1 = __webpack_require__(1);
		var escape = function (s) { return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); };
		var HighlightPipe = (function () {
		    function HighlightPipe() {
		    }
		    HighlightPipe.prototype.transform = function (value, arg) {
		        if (!arg.trim()) {
		            return value;
		        }
		        try {
		            var regex = new RegExp("(" + escape(arg) + ")", 'i');
		            return value.replace(regex, '<b>$1</b>');
		        }
		        catch (e) {
		            return value;
		        }
		    };
		    HighlightPipe = __decorate([
		        core_1.Pipe({
		            name: 'highlight'
		        }), 
		        __metadata('design:paramtypes', [])
		    ], HighlightPipe);
		    return HighlightPipe;
		}());
		exports.HighlightPipe = HighlightPipe;
		
	
	/***/ }
	/******/ ])
	});
	;
	//# sourceMappingURL=ng2-tag-input.map

/***/ },

/***/ 385:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var router_1 = __webpack_require__(386);
	var front_page_component_1 = __webpack_require__(360);
	var sign_in_component_1 = __webpack_require__(368);
	var register_component_1 = __webpack_require__(371);
	exports.routes = router_1.RouterModule.forRoot([
	    {
	        path: '',
	        component: front_page_component_1.FrontPageComponent,
	        children: [
	            {
	                path: 'register',
	                component: register_component_1.RegisterComponent
	            },
	            {
	                path: '**',
	                component: sign_in_component_1.SignInComponent
	            }
	        ]
	    }
	]);


/***/ }

});
//# sourceMappingURL=main.map