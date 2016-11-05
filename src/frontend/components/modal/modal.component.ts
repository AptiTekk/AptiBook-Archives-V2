import {Component, Input, Directive, ViewChild, ElementRef, Output, EventEmitter} from "@angular/core";

@Component({
    selector: 'modal',
    template: `
<div #modalRoot
     class="modal fade"
     tabindex="-1"
     role="dialog"
     (keydown.esc)="closeOnEscape ? closeModal() : 0"
     [ngClass]="{'fade': _isOpen, 'in': _isOpen }"
     [ngStyle]="{ 'display': _isOpen ? 'block' : 'none' }"
     (click)="closeOnOutsideClick ? closeModal() : 0">
    <div class="modal-dialog"
         role="document"
         (click)="$event.stopPropagation();">
        <div class="modal-content">

            <!-- Header -->
            <div class="modal-header">
                <!-- X close button (top right corner) -->
                <button type="button"
                        class="close"
                        aria-label="Close"
                        (click)="closeModal()"
                        *ngIf="!hideCloseButton">
                    <span aria-hidden="true">x</span>
                </button>
                <h4 class="modal-title">
                    {{title}}
                </h4>
            </div>

            <!-- Body -->
            <div class="modal-body">
                <ng-content select="modal-body"></ng-content>
            </div>

            <!-- Footer -->
            <div class="modal-footer">
                <ng-content select="modal-footer"></ng-content>
                <button *ngIf="submitButtonLabel" type="button" class="btn btn-primary"
                        (click)="onSubmit.emit()">{{submitButtonLabel}}
                </button>
                <button *ngIf="cancelButtonLabel" type="button" class="btn btn-default" (click)="closeModal()">
                    {{cancelButtonLabel}}
                </button>
                <button *ngIf="dangerSubmitButtonLabel" type="button" class="btn btn-danger pull-left"
                        (click)="onDangerSubmit.emit()">{{dangerSubmitButtonLabel}}
                </button>
            </div>
        </div>
    </div>
</div>
`
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