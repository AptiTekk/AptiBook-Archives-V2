import {Component} from "@angular/core";
import {APIService} from "../../../../services/singleton/api.service";
import {PropertiesService} from "../../../../services/singleton/properties-service";
import {Properties} from "../../../../models/properties.model";
import {ReplaySubject} from "rxjs";

@Component({
    selector: 'properties-page',
    templateUrl: 'properties-page.component.html',
})
export class PropertiesPageComponent {


    private properties: ReplaySubject<Properties[]> = new ReplaySubject(1);


    constructor(propertiesService: PropertiesService) {
        propertiesService.getAllProperties().subscribe(properties => {
                this.properties.next(properties);
            }
        );
    }

    getProperties():ReplaySubject<Properties[]>{
        return this.properties;
    }

}