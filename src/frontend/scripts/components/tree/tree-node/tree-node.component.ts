import {Component, Input, ViewChildren, QueryList} from "@angular/core";
import {UserGroup} from "../../../models/user-group.model";
import {TreeComponent} from "../tree.component";

@Component({
    selector: 'tree-node',
    templateUrl: 'tree-node.component.html'
})
export class TreeNodeComponent {

    @Input() tree: TreeComponent;

    @Input() parent: TreeNodeComponent;

    @Input() userGroup: UserGroup;

    @ViewChildren(TreeNodeComponent) children: QueryList<TreeNodeComponent>;

    private nodeOverDropPoint: boolean = false;
    private nodeOverNode: boolean = false;

    protected onNodeClick(event: MouseEvent) {
        if (this.tree.selectable)
            this.tree.onNodeSelected(this, event.ctrlKey);
    }

    protected isSelected(): boolean {
        for (let userGroup of this.tree.selectedUserGroups) {
            if (userGroup.id === this.userGroup.id)
                return true;
        }

        return false;
    }

    /* Dragging of This Node */

    protected onDragStart(event: DragEvent) {
        event.dataTransfer.effectAllowed = "move";
        this.tree.draggingNode = this;
    }

    protected onDragEnd(event: DragEvent) {
        this.tree.draggingNode = undefined;
    }

    /* Dragging of Other Nodes */

    /* -- Drop Point Events */

    protected onDragEnterDropPoint(event: DragEvent) {
        if (!this.tree.draggingNode)
            return;

        if (this.tree.draggingNode === this)
            return;

        // Ensure that the node being dragged is not a parent of this node.
        let parentGroup: TreeNodeComponent = this;
        while ((parentGroup = parentGroup.parent)) {
            if (parentGroup === this.tree.draggingNode)
                return;
        }

        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        this.nodeOverDropPoint = true;
    }

    protected onDragLeaveDropPoint(event: DragEvent) {
        event.dataTransfer.dropEffect = undefined;
        this.nodeOverDropPoint = false;
    }

    protected onDropPointDrop(event: DragEvent) {
        if (this.tree.draggingNode && this.nodeOverDropPoint) {
            this.tree.moveNode(this.tree.draggingNode, this.parent);
            this.nodeOverDropPoint = false;
        }
    }

    /* -- Node Events */

    protected onDragEnterNode(event: DragEvent) {
        if (!this.tree.draggingNode)
            return;

        if (this.tree.draggingNode === this)
            return;

        // Ensure that the node being dragged is not a parent of this node, or this node's immediate child.
        let parentGroup: TreeNodeComponent = this;
        while ((parentGroup = parentGroup.parent)) {
            if (parentGroup === this.tree.draggingNode)
                return;
        }
        if (this.tree.draggingNode.parent === this)
            return;

        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        this.nodeOverNode = true;
    }

    protected onDragLeaveNode(event: DragEvent) {
        event.dataTransfer.dropEffect = undefined;
        this.nodeOverNode = false;
    }

    protected onNodeDrop(event: DragEvent) {
        if (this.tree.draggingNode && this.nodeOverNode) {
            this.tree.moveNode(this.tree.draggingNode, this);
            this.nodeOverNode = false;
        }
    }

}