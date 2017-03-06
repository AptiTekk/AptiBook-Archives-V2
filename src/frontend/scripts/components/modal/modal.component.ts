/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, Input, Directive, ViewChild, ElementRef, Output, EventEmitter, OnInit} from "@angular/core";

@Component({
    selector: 'modal',
    templateUrl: 'modal.component.html',
    styleUrls: ['modal.component.css']
})
export class ModalComponent implements OnInit {
    @ViewChild("modalRoot")
    public modalRoot: ElementRef;

    /**
     * The title to display at the top of the modal.
     */
    @Input() title: string;

    /**
     * The size of the modal.
     * Valid options are: "sm", "md", "lg".
     * Default is "md".
     */
    @Input() protected size: string = "md";

    /**
     * Whether or not the modal should close when the user presses the ESC key.
     * Defaults to true.
     */
    @Input() closeOnEscape: boolean = true;

    /**
     * Whether or not the modal should close when the user clicks outside the modal.
     * Defaults to true.
     */
    @Input() closeOnOutsideClick: boolean = true;

    /**
     * Whether or not to hide the "X" close button in the top right corner of the modal.
     * Defaults to false;
     */
    @Input() hideCloseButton: boolean = false;

    /**
     * Providing a label for the cancel button will make it display in the footer.
     * By default there is no cancel button.
     */
    @Input() cancelButtonLabel: string;

    /**
     * Providing a label for the submit button will make it display in the footer.
     * By default there is no submit button.
     */
    @Input() submitButtonLabel: string;

    /**
     * Determines whether the submit button is greyed out (disabled), assuming that the submit button exists.
     * Defaults to false.
     */
    @Input() submitButtonDisabled: boolean = false;

    /**
     * Providing a label for the danger button will make it display in the footer.
     * By default there is no danger button.
     */
    @Input() dangerSubmitButtonLabel: string;

    /**
     * Emits when the user clicks the submit button, if it exists.
     */
    @Output() public onSubmit: EventEmitter<any> = new EventEmitter();

    /**
     * Emits when the user clicks the cancel button, if it exists.
     * Also emitted when the user closes the modal by other means (ESC, X button, click outside modal).
     */
    @Output() public onCancel: EventEmitter<any> = new EventEmitter();

    /**
     * Emits when the user clicks the danger button, if it exists.
     */
    @Output() public onDangerSubmit: EventEmitter<any> = new EventEmitter();

    /**
     * Determines if the modal should be displayed or not.
     */
    private isOpen: boolean = false;

    /**
     * The shadowy backdrop behind the modal.
     */
    private backdropElement: HTMLDivElement;

    constructor() {
    }

    ngOnInit(): void {
        this.createBackdrop();
    }

    /**
     * Creates the backdrop element that displays behind the modal.
     */
    private createBackdrop() {
        this.backdropElement = document.createElement("div");
        this.backdropElement.classList.add("modal-backdrop");
        this.backdropElement.classList.add("fade");
        this.backdropElement.classList.add("in");
    }

    /**
     * Displays the modal.
     */
    public openModal() {
        if (this.isOpen)
            return;

        this.isOpen = true;
        document.body.appendChild(this.backdropElement);
        window.setTimeout(() => this.modalRoot.nativeElement.focus(), 0);
        document.body.classList.add("modal-open");
    }

    /**
     * Closes the modal without emitting the onCancel emitter.
     */
    public closeModal() {
        if (!this.isOpen)
            return;

        this.isOpen = false;
        document.body.removeChild(this.backdropElement);
        document.body.classList.remove("modal-open");
    }

    /**
     * Closes the modal and emits the onCancel emitter.
     */
    public cancel() {
        this.closeModal();
        this.onCancel.next();
    }

    /**
     * Determines if the modal is oepn or not.
     * @returns True if the modal is open, false otherwise.
     */
    public isModalOpen(): boolean {
        return this.isOpen;
    }

}

@Directive({
    selector: 'modal-body'
})
export class ModalComponentBody {
}

@Directive({
    selector: 'modal-footer'
})
export class ModalComponentFooter {
}