import {Component, ViewChild} from '@angular/core';
import {ModalComponent} from "../../modal/modal.component";

@Component({
    selector: 'info-modal',
    templateUrl: 'info-modal.component.html'
})
export class InfoModal {

    @ViewChild('modal')
    modal: ModalComponent;

    aptiBookVersion: string = "Unknown";

    constructor() {
        let metaTags: NodeListOf<HTMLMetaElement> = document.getElementsByTagName('meta');
        for (let i = 0; i < metaTags.length; i++) {
            if(metaTags[i].name === "aptibook-version") {
                this.aptiBookVersion = metaTags[i].content;
                break;
            }
        }
    }

    openModal() {
        this.modal.openModal();
    }

}