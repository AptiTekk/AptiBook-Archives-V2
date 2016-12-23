import {Component, ViewChild, ElementRef} from "@angular/core";
import {FileItem} from "ng2-file-upload/file-upload/file-item.class";
import {FileUploader} from "ng2-file-upload";
declare const $: any;

@Component({
    selector: 'image-uploader',
    templateUrl: 'image-uploader.component.html',
    styleUrls: ['image-uploader.component.css']
})
export class ImageUploaderComponent {

    @ViewChild('imageUploadInput') protected imageUploadInput: ElementRef;
    protected imagePreviewSrc: string;

    protected fileUploader: FileUploader;

    constructor() {
        this.fileUploader = new FileUploader({
            allowedMimeType: ["image/jpeg", "image/pjpeg", "image/png"]
        });

        this.fileUploader.onAfterAddingFile = (fileItem: FileItem) => {
            this.fileUploader.clearQueue();
            this.fileUploader.queue[0] = fileItem;
            this.updateImagePreview(this.fileUploader.queue[0]);
        }
    }

    private updateImagePreview(fileItem: FileItem) {
        this.imageUploadInput.nativeElement.value = "";
        let file: File = (<any>fileItem).some;
        let reader = new FileReader();

        reader.onload = (e: any) => this.imagePreviewSrc = e.target.result;
        reader.readAsDataURL(file);
    }

    protected openImageFileChooser() {
        $(this.imageUploadInput.nativeElement).trigger('click');
    }

    public clearImage() {
        this.fileUploader.clearQueue();
        this.imagePreviewSrc = undefined;
    }

}