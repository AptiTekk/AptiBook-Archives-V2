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
var ng2_file_upload_1 = require("ng2-file-upload");
var rxjs_1 = require("rxjs");
var api_service_1 = require("../../services/singleton/api.service");
var ImageUploaderComponent = (function () {
    function ImageUploaderComponent(apiService) {
        this.apiService = apiService;
    }
    ImageUploaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.fileUploader = new ng2_file_upload_1.FileUploader({});
        this.setOptions(null);
        this.fileUploader.onAfterAddingFile = function (fileItem) {
            _this.fileUploader.clearQueue();
            _this.fileUploader.queue[0] = fileItem;
            _this.updateImagePreview(_this.fileUploader.queue[0]);
        };
    };
    ImageUploaderComponent.prototype.setOptions = function (url) {
        this.fileUploader.setOptions({
            allowedMimeType: ["image/jpeg", "image/pjpeg", "image/png"],
            url: url,
            method: 'PUT'
        });
    };
    ImageUploaderComponent.prototype.updateImagePreview = function (fileItem) {
        var _this = this;
        this.imageUploadInput.nativeElement.value = "";
        var file = fileItem.some;
        var reader = new FileReader();
        reader.onload = function (e) { return _this.imagePreviewSrc = e.target.result; };
        reader.readAsDataURL(file);
    };
    ImageUploaderComponent.prototype.openImageFileChooser = function () {
        $(this.imageUploadInput.nativeElement).trigger('click');
    };
    ImageUploaderComponent.prototype.hasImage = function () {
        if (this.currentImageUrl)
            return true;
        else if (this.fileUploader.queue.length > 0)
            return true;
        return false;
    };
    ImageUploaderComponent.prototype.uploadToUrl = function (url) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            if (_this.fileUploader.queue.length > 0) {
                //Set options with correct url
                _this.setOptions(url);
                //Set up listeners
                _this.fileUploader.onSuccessItem = function () { return listener.next(true); };
                _this.fileUploader.onErrorItem = function () { return listener.next(false); };
                //Upload the first image in the queue
                _this.fileUploader.uploadItem(_this.fileUploader.queue[0]);
                //Clear options
                _this.setOptions(null);
            }
            else
                listener.next(true);
        });
    };
    ImageUploaderComponent.prototype.clearImage = function () {
        this.fileUploader.clearQueue();
        this.currentImageUrl = null;
        this.imagePreviewSrc = null;
    };
    return ImageUploaderComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ImageUploaderComponent.prototype, "noImageUrl", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ImageUploaderComponent.prototype, "currentImageUrl", void 0);
__decorate([
    core_1.ViewChild('imageUploadInput'),
    __metadata("design:type", core_1.ElementRef)
], ImageUploaderComponent.prototype, "imageUploadInput", void 0);
ImageUploaderComponent = __decorate([
    core_1.Component({
        selector: 'image-uploader',
        templateUrl: 'image-uploader.component.html',
        styleUrls: ['image-uploader.component.css']
    }),
    __metadata("design:paramtypes", [api_service_1.APIService])
], ImageUploaderComponent);
exports.ImageUploaderComponent = ImageUploaderComponent;
//# sourceMappingURL=image-uploader.component.js.map