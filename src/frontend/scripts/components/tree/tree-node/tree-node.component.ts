import {Component, Input} from "@angular/core";
import {UserGroup} from "../../../models/user-group.model";
import {TreeComponent} from "../tree.component";

@Component({
    selector: 'tree-node',
    templateUrl: 'tree-node.component.html'
})
export class TreeNodeComponent {

    @Input()
    tree: TreeComponent;

    @Input()
    userGroup: UserGroup;

    private nodeOverDropPoint: boolean = false;

    shouldHighlight(): boolean {
        if (this.tree.higlightedUserGroups == undefined)
            return false;

        return this.tree.higlightedUserGroups.map(value => value.id).includes(this.userGroup.id);
    }

    onNodeClick() {
        if (this.tree.selectable)
            this.tree.onNodeSelected(this);
    }

    onDragStart(event: DragEvent) {
        event.dataTransfer.effectAllowed = "move";
        this.tree.draggingNode = this;
    }

    onDragEnd(event: DragEvent) {
        this.tree.draggingNode = undefined;
    }

    onDragEnterDropPoint(event: DragEvent) {
        if (this.tree.draggingNode != undefined && this.tree.draggingNode != this) {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
            this.nodeOverDropPoint = true;
        }
    }

    onDragLeaveDropPoint(event: DragEvent) {
        event.dataTransfer.dropEffect = undefined;
        this.nodeOverDropPoint = false;
    }

    onDropPointDrop(event: DragEvent) {
        if (this.tree.draggingNode != undefined && this.nodeOverDropPoint) {
            console.log("Dropping " + this.tree.draggingNode.userGroup.name + " before " + this.userGroup.name);
            this.nodeOverDropPoint = false;
        }
    }

}