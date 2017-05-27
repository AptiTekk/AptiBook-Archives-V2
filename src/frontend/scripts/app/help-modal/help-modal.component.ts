/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, ViewChild, OnInit} from "@angular/core";
import {ModalComponent} from "../../shared/modal/modal.component";
import {HelpService, HelpTopic} from "../../core/services/help.service";

@Component({
    selector: 'help-modal',
    templateUrl: './help-modal.component.html'
})
export class HelpModalComponent implements OnInit {

    @ViewChild('modal')
    modal: ModalComponent;

    helpTopics: HelpTopic[];

    constructor(private helpService: HelpService) {
    }

    ngOnInit(): void {
        this.helpService.getCurrentHelpTopics().subscribe(helpTopics => this.helpTopics = helpTopics);
    }

    openModal() {
        this.modal.openModal();
    }

    //noinspection JSMethodCanBeStatic
    onVisitKnowledgebase() {
        let win = window.open('https://support.aptitekk.com/', '_blank');
        if (win) {
            win.focus();
        } else {
            alert('The Knowledgebase could not be opened. Please allow popups for this website.');
        }
    }

}