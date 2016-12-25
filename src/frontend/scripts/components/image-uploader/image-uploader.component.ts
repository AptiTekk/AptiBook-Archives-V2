import {Component, ViewChild, ElementRef, Input} from "@angular/core";
import {FileItem} from "ng2-file-upload/file-upload/file-item.class";
import {FileUploader, FileUploaderOptions} from "ng2-file-upload";
import {Observable} from "rxjs";
declare const $: any;

@Component({
    selector: 'image-uploader',
    templateUrl: 'image-uploader.component.html',
    styleUrls: ['image-uploader.component.css']
})
export class ImageUploaderComponent {

    @Input() defaultImageUrl: string = "/static/resource-no-image.jpg";

    @ViewChild('imageUploadInput') protected imageUploadInput: ElementRef;
    protected imagePreviewSrc: string;

    protected fileUploader: FileUploader;

    constructor() {
        this.fileUploader = new FileUploader(<FileUploaderOptions>{});
        this.setOptions(null);

        this.fileUploader.onAfterAddingFile = (fileItem: FileItem) => {
            this.fileUploader.clearQueue();
            this.fileUploader.queue[0] = fileItem;
            this.updateImagePreview(this.fileUploader.queue[0]);
        }
    }

    private setOptions(url: string) {
        this.fileUploader.setOptions(<FileUploaderOptions>
            {
                allowedMimeType: ["image/jpeg", "image/pjpeg", "image/png"],
                url: url,
                method: 'PUT'
            })
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

    public upload(url: string): Observable<boolean> {
        return Observable.create(listener => {
            if (this.fileUploader.queue.length > 0) {
                //Set options with correct url
                this.setOptions(url);

                //Set up listeners
                this.fileUploader.onSuccessItem = () => listener.next(true);
                this.fileUploader.onErrorItem = () => listener.next(false);

                //Upload the first image in the queue
                this.fileUploader.uploadItem(this.fileUploader.queue[0]);

                //Clear options
                this.setOptions(null);
            } else
                listener.next(false);
        });
    }

    public clearImage() {
        this.fileUploader.clearQueue();
        this.imagePreviewSrc = undefined;
    }

}