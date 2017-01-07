/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component} from "@angular/core";
import {HeaderComponent} from "../../../components/header/header.component";

@Component({
    selector: 'configuration-container',
    templateUrl: 'configuration-container.component.html'
})
export class ConfigurationContainerComponent {

    //noinspection JSMethodCanBeStatic
    get configurationLinks() {
        return HeaderComponent.CONFIGURATION_LINKS;
    }

}