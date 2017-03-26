/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, Input, ViewChild} from "@angular/core";
import {Resource} from "../../models/resource.model";
import {APIService} from "../../core/services/api.service";
import {ImageUploaderComponent} from "../image-uploader/image-uploader.component";
import {Observable} from "rxjs";

@Component({
    selector: 'resource-image',
    templateUrl: 'resource-image.component.html'
})
export class ResourceImageComponent {

    noImageUrl: string = require("../../../resources/resource-no-image.svg");

    @Input() resource: Resource;

    @ViewChild(ImageUploaderComponent) imageUploader: ImageUploaderComponent;
    @Input() useUploader: boolean;

    @Input() maxWidth: string;

    @Input() width: string;

    constructor(protected apiService: APIService) {
    }

    public clearImage() {
        if (this.imageUploader)
            this.imageUploader.clearImage();
    }

    public hasImageToUpload(): boolean {
        return this.imageUploader && this.imageUploader.hasImage();
    }

    public upload(resource: Resource = this.resource): Observable<boolean> {
        if (resource && this.imageUploader)
            return this.imageUploader.uploadToUrl(this.apiService.getApiUrlFromEndpoint("/resources/" + resource.id + "/image"));

        return null;
    }

    public deleteImageFromServer(resource: Resource = this.resource): Observable<boolean> {
        return this.apiService.del("/resources/" + resource.id + "/image");
    }

}