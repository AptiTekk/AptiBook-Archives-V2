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

    protected onNodeClick(event: MouseEvent) {
        if (this.tree.selectable)
            this.tree.onNodeSelected(this, event.ctrlKey);
    }

    protected isSelected(): boolean {
        console.log("Am I selected?");

        for (let userGroup of this.tree.selectedUserGroups) {
            if (userGroup.id === this.userGroup.id)
                return true;
        }

        console.log("Nope");

        return false;
    }

    protected onDragStart(event: DragEvent) {
        event.dataTransfer.effectAllowed = "move";
        this.tree.draggingNode = this;
    }

    protected onDragEnd(event: DragEvent) {
        this.tree.draggingNode = undefined;
    }

    protected onDragEnterDropPoint(event: DragEvent) {
        if (this.tree.draggingNode && this.tree.draggingNode !== this) {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
            this.nodeOverDropPoint = true;
        }
    }

    protected onDragLeaveDropPoint(event: DragEvent) {
        event.dataTransfer.dropEffect = undefined;
        this.nodeOverDropPoint = false;
    }

    protected onDropPointDrop(event: DragEvent) {
        if (this.tree.draggingNode && this.nodeOverDropPoint) {
            console.log("Dropping " + this.tree.draggingNode.userGroup.name + " before " + this.userGroup.name);
            this.nodeOverDropPoint = false;
        }
    }

}