import {Component} from "@angular/core";
import {APIService} from "../../../../services/singleton/api.service";

@Component({
    selector: 'properties-page',
    templateUrl: 'properties-page.component.html',
})
export class PropertiesPageComponent{
    constructor(protected apiService: APIService){

    }
}