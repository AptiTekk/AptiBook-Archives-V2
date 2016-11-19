import {Component, Directive, Input} from '@angular/core';

@Component({
    selector: 'panel',
    templateUrl: 'panel.component.html',
    styleUrls: ['panel.component.css']
})
export class PanelComponent {

    @Input()
    type: string = 'default';

    @Input()
    title: string;

}

@Directive({
    selector: 'panel-body'
})
export class PanelComponentBody {

}