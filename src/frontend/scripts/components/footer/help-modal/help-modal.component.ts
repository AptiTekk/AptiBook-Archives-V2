import {Component, ViewChild} from "@angular/core";
import {ModalComponent} from "../../modal/modal.component";
import {HelpService} from "../../../services";

@Component({
    selector: 'help-modal',
    templateUrl: 'help-modal.component.html'
})
export class HelpModalComponent {

    @ViewChild('modal')
    modal: ModalComponent;

    helpTopics: [{title: string, slug: string}];

    constructor(helpService: HelpService) {
        helpService.getCurrentHelpTopics().subscribe(helpTopics => this.helpTopics = helpTopics);
    }

    openModal() {
        this.modal.openModal();
    }

    static onVisitKnowledgebase() {
        let win = window.open('https://support.aptitekk.com/', '_blank');
        if (win) {
            win.focus();
        } else {
            alert('The Knowledgebase could not be opened. Please allow popups for this website.');
        }
    }

}