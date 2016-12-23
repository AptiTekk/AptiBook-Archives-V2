/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, ViewChild, Output, EventEmitter, ElementRef} from "@angular/core";
import {ModalComponent} from "../../../../../components/modal/modal.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserGroupService} from "../../../../../services/singleton/usergroup.service";
import {UserGroup} from "../../../../../models/user-group.model";
import {FileUploader} from "ng2-file-upload";
import {FileItem} from "ng2-file-upload/file-upload/file-item.class";
declare const $: any;

@Component({
    selector: 'new-resource-modal',
    templateUrl: 'new-resource-modal.component.html',
    styleUrls: ['new-resource-modal.component.css']
})
export class NewResourceModalComponent {

    @ViewChild('modal')
    modal: ModalComponent;

    rootGroup: UserGroup;

    @Output() submitted: EventEmitter<{name: string}> = new EventEmitter<{name: string}>();

    formGroup: FormGroup;

    fileUploader: FileUploader;
    fileOverImage: boolean;
    imagePreviewSrc: string;

    @ViewChild('imageUploadInput')
    imageUploadInput: ElementRef;

    constructor(protected formBuilder: FormBuilder,
                protected userGroupService: UserGroupService) {

        userGroupService.getRootUserGroup().subscribe(rootGroup => {
            this.rootGroup = rootGroup;

            this.resetFormGroup();
        });

        this.fileUploader = new FileUploader({
            url: "https://localhost:8080/api/resource/setImage",
            allowedMimeType: ["image/jpeg", "image/pjpeg", "image/png"]
        });
        this.fileUploader.onAfterAddingFile = (fileItem: FileItem) => {
            this.fileUploader.clearQueue();
            this.fileUploader.queue[0] = fileItem;
            this.updateImagePreview(this.fileUploader.queue[0]);
        }
    }

    public open() {
        this.resetFormGroup();
        this.removeImage();
        this.modal.openModal();
    }

    private resetFormGroup() {
        this.formGroup = this.formBuilder.group({
            name: [null, Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
            needsApproval: true,
            owner: [this.rootGroup.children[0]]
        });
    }

    private updateImagePreview(fileItem: FileItem) {
        this.imageUploadInput.nativeElement.value = "";
        let file: File = (<any>fileItem).some;
        let reader = new FileReader();

        reader.onload = (e: any) => this.imagePreviewSrc = e.target.result;
        reader.readAsDataURL(file);
    }

    openImageFileChooser() {
        $(this.imageUploadInput.nativeElement).trigger('click');
    }

    removeImage() {
        this.fileUploader.clearQueue();
        this.imagePreviewSrc = undefined;
    }

    onSubmitted() {
        let newResource = {
            name: this.formGroup.controls['name'].value,
            needsApproval: this.formGroup.controls['needsApproval'].value,
            owner: this.formGroup.controls['owner'].value
        };

        console.log(newResource);
        this.submitted.next(newResource);
        this.modal.closeModal();
    }

}