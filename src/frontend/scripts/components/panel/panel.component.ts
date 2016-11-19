import {Component, Directive, Input, AfterViewInit, ViewChild} from "@angular/core";

@Component({
    selector: 'panel',
    templateUrl: 'panel.component.html',
    styleUrls: ['panel.component.css']
})
export class PanelComponent implements AfterViewInit {

    @ViewChild('footer')
    footer;

    @Input()
    type: string = 'default';

    @Input()
    title: string;

    ngAfterViewInit(): void {
        if(this.footer.nativeElement.children.length == 0)
            this.footer.nativeElement.classList.add('hidden');
    }

}

@Directive({
    selector: 'panel-body'
})
export class PanelComponentBody {

}

@Directive({
    selector: 'panel-footer'
})
export class PanelComponentFooter {

}