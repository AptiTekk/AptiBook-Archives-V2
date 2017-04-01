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
var api_service_1 = require("../../services/singleton/api.service");
var image_uploader_component_1 = require("../image-uploader/image-uploader.component");
var ResourceImageComponent = (function () {
    function ResourceImageComponent(apiService) {
        this.apiService = apiService;
        this.noImageUrl = require("../../../resources/resource-no-image.svg");
    }
    ResourceImageComponent.prototype.clearImage = function () {
        if (this.imageUploader)
            this.imageUploader.clearImage();
    };
    ResourceImageComponent.prototype.hasImageToUpload = function () {
        return this.imageUploader && this.imageUploader.hasImage();
    };
    ResourceImageComponent.prototype.upload = function (resource) {
        if (resource === void 0) { resource = this.resource; }
        if (resource && this.imageUploader)
            return this.imageUploader.uploadToUrl(this.apiService.getApiUrlFromEndpoint("/resources/" + resource.id + "/image"));
        return null;
    };
    ResourceImageComponent.prototype.deleteImageFromServer = function (resource) {
        if (resource === void 0) { resource = this.resource; }
        return this.apiService.del("/resources/" + resource.id + "/image");
    };
    return ResourceImageComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ResourceImageComponent.prototype, "resource", void 0);
__decorate([
    core_1.ViewChild(image_uploader_component_1.ImageUploaderComponent),
    __metadata("design:type", image_uploader_component_1.ImageUploaderComponent)
], ResourceImageComponent.prototype, "imageUploader", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ResourceImageComponent.prototype, "useUploader", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ResourceImageComponent.prototype, "maxWidth", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ResourceImageComponent.prototype, "width", void 0);
ResourceImageComponent = __decorate([
    core_1.Component({
        selector: 'resource-image',
        templateUrl: 'resource-image.component.html'
    }),
    __metadata("design:paramtypes", [api_service_1.APIService])
], ResourceImageComponent);
exports.ResourceImageComponent = ResourceImageComponent;
//# sourceMappingURL=resource-image.component.js.map