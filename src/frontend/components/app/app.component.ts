import {Component} from "@angular/core";
import {TagService} from "../../services";

@Component({
    selector: 'app',
    template: `
<div class="container">
    <div class="col-xs-12">
        <tag-input [(ngModel)]="editableTags" (onAdd)="onTagAdded($event)" (onRemove)="onTagRemoved($event)"></tag-input>
        The tags are:
        <ul>
            <li *ngFor="let tag of editableTags">
                {{tag}}
            </li>
        </ul>
    </div>
</div>
`
})
export class AppComponent {

    editableTags: string[];
    immutableTags: string[];

    tagIds: number[];

    constructor(private tagService: TagService) {
        this.loadTags();
    }

    private loadTags() {
        this.tagService.getTags().subscribe(response => {
            this.editableTags = response.map(tag => tag['value']);
            this.immutableTags = this.editableTags.map(tag => tag);
            this.tagIds = response.map(tag => tag['id']);
        });
    }

    onTagAdded(tag: string) {
        this.tagService.addTag({id: 0, value: tag}).subscribe(response => this.loadTags());
    }

    onTagRemoved(tag: string) {
        if (this.immutableTags.indexOf(tag) > -1) {
            let tagIdIndex = this.immutableTags.findIndex(item => item === tag);
            if (this.tagIds[tagIdIndex] !== undefined) {
                this.tagService.deleteTag({
                    id: this.tagIds[tagIdIndex],
                    value: tag
                }).subscribe(response => this.loadTags());
                return;
            }
        }
        this.loadTags();
    }

}