import {Component, ViewChild} from "@angular/core";
import {ModalComponent} from "../../modal/modal.component";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'help-modal',
    templateUrl: 'help-modal.component.html'
})
export class HelpModalComponent {

    @ViewChild('modal')
    modal: ModalComponent;

    helpTopics: Object[];

    constructor(private route: ActivatedRoute) {
        if(route.data['help'] != undefined) {
            this.helpTopics = route.data['help'];
        }

        console.log(route.snapshot.data);
    }

    openModal() {
        this.modal.openModal();
    }

    onVisitKnowledgebase() {
        let win = window.open('https://support.aptitekk.com/', '_blank');
        if (win) {
            win.focus();
        } else {
            alert('The Knowledgebase could not be opened. Please allow popups for this website.');
        }
    }

}