import {Component, Input, Directive, ViewChild, ElementRef, Output, EventEmitter} from "@angular/core";

@Component({
    selector: 'modal',
    templateUrl: 'modal.component.html'
})
export class ModalComponent {
    @ViewChild("modalRoot")
    public modalRoot: ElementRef;

    @Input() title: string;
    @Input() closeOnEscape: boolean = true;
    @Input() closeOnOutsideClick: boolean = true;
    @Input() hideCloseButton: boolean = false;

    @Input() cancelButtonLabel: string;
    @Input() submitButtonLabel: string;
    @Input() dangerSubmitButtonLabel: string;

    @Output()
    public onSubmit: EventEmitter<any> = new EventEmitter();
    @Output()
    public onDangerSubmit: EventEmitter<any> = new EventEmitter();

    private _isOpen: boolean = false;
    private backdropElement: HTMLDivElement;

    constructor() {
        this.createBackdrop();
    }

    private createBackdrop() {
        this.backdropElement = document.createElement("div");
        this.backdropElement.classList.add("modal-backdrop");
        this.backdropElement.classList.add("fade");
        this.backdropElement.classList.add("in");
    }

    openModal() {
        if (this._isOpen)
            return;

        this._isOpen = true;
        document.body.appendChild(this.backdropElement);
        window.setTimeout(() => this.modalRoot.nativeElement.focus(), 0);
        document.body.className += " modal-open";
    }

    closeModal() {
        if (!this._isOpen)
            return;

        this._isOpen = false;
        document.body.removeChild(this.backdropElement);
        document.body.className = document.body.className.replace(/modal-open\b/, "");
    }

    get isOpen(): boolean {
        return this._isOpen;
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