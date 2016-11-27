import {Component, Input, ViewEncapsulation} from "@angular/core";
import {UserGroup} from "../../models/user-group.model";
import {TreeNodeComponent} from "./tree-node/tree-node.component";
declare const $: any;

@Component({
    selector: 'tree',
    templateUrl: 'tree.component.html',
    styleUrls: ['tree.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TreeComponent {

    @Input()
    dragAndDrop: boolean = true;

    @Input()
    selectable: boolean = true;

    @Input()
    showRoot: boolean = false;

    @Input()
    userGroup: UserGroup;

    @Input()
    higlightedUserGroups: UserGroup[];

    selectedNode: TreeNodeComponent;

    draggingNode: TreeNodeComponent;

    onNodeSelected(treeNode: TreeNodeComponent) {
        this.selectedNode = treeNode;
    }

}