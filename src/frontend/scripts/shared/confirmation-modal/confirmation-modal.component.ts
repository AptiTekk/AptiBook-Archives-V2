/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ModalComponent} from "../modal/modal.component";

@Component({
    selector: 'confirmation-modal',
    templateUrl: 'confirmation-modal.component.html'
})
export class ConfirmationModalComponent {

    /**
     * Determines the title of the modal.
     * Defaults to "Confirmation".
     */
    @Input() title: string = "Confirmation";

    /**
     * The text to put inside the "Yes" button.
     * Defaults to "Yes".
     */
    @Input() yesButtonLabel: string = "Yes";

    /**
     * The color of the "Yes" button.
     * Valid choices are:
     * - primary (Blue)
     * - warning (Yellow)
     * - danger (Red)
     * - default (Grey)
     *
     * Defaults to "primary".
     */
    @Input() yesButtonColor: string = "primary";

    /**
     * The text to put inside the "No" button.
     * Defaults to "No".
     */
    @Input() noButtonLabel: string = "No";

    /**
     * The color of the "No" button.
     * Valid choices are:
     * - primary (Blue)
     * - warning (Yellow)
     * - danger (Red)
     * - default (Grey)
     *
     * Defaults to "default".
     */
    @Input() noButtonColor: string = "default";

    /**
     * Emitted when the user makes a decision.
     * The event will be a boolean; true for "Yes" and false for "No" (aka cancel).
     */
    @Output() decision = new EventEmitter<boolean>();

    /**
     * The modal within this component.
     */
    @ViewChild(ModalComponent) private modal: ModalComponent;

    /**
     * Opens the confirmation modal.
     */
    public open(): void {
        this.modal.openModal();
    }

    /**
     * Called when the user clicks yes or no, or the modal is cancelled.
     */
    protected onDecision(decisionMade: boolean) {
        this.modal.closeModal();
        this.decision.emit(decisionMade);
    }

}