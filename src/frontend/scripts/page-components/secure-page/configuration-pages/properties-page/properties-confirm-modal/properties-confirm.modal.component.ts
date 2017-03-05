/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {ModalComponent} from "../../../../../components/modal/modal.component";
@Component({
    selector: 'properties-confirm-modal',
    templateUrl: 'properties-confirm.modal.component.html'
})
export class PropertiesConfirmModalComponent{
    @ViewChild(ModalComponent) modal: ModalComponent;

    @Input() message: string;
    @Output() confirm: EventEmitter<void> = new EventEmitter<void>();

    public open(){
        this.modal.openModal()
    }
    public close(){
        this.modal.closeModal();
    }



    onConfirm(){
       this.confirm.emit();
       this.modal.closeModal();
    }

}