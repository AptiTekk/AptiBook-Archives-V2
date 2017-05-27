/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, Input, QueryList, ViewChildren} from "@angular/core";
import {UserGroup} from "../../../models/user-group.model";
import {TreeComponent} from "../tree.component";
import {AnalyticsService} from "../../../core/services/analytics.service";

@Component({
    selector: 'tree-node',
    templateUrl: 'tree-node.component.html'
})
export class TreeNodeComponent {

    @Input() tree: TreeComponent;

    @Input() parent: TreeNodeComponent;

    @Input() userGroup: UserGroup;

    @ViewChildren(TreeNodeComponent) children: QueryList<TreeNodeComponent>;

    nodeOverDropPoint: boolean = false;
    nodeOverNode: boolean = false;

    onNodeClick(event: MouseEvent) {
        if (this.tree.selectable)
            this.tree.onNodeSelected(this, event.ctrlKey);
    }

    isSelected(): boolean {
        for (let userGroup of this.tree.selectedUserGroups) {
            if (userGroup.id === this.userGroup.id)
                return true;
        }

        return false;
    }

    /* Dragging of This Node */

    onDragStart(event: DragEvent) {
        AnalyticsService.sendEvent({category: 'User Group Tree', action: 'Drag'});
        event.dataTransfer.effectAllowed = "move";
        this.tree.draggingNode = this;
    }

    onDragEnd(event: DragEvent) {
        this.tree.draggingNode = undefined;
    }

    /* Dragging of Other Nodes */

    /* -- Drop Point Events */

    onDragEnterDropPoint(event: DragEvent) {
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

    onDragLeaveDropPoint(event: DragEvent) {
        event.dataTransfer.dropEffect = undefined;
        this.nodeOverDropPoint = false;
    }

    onDropPointDrop(event: DragEvent) {
        if (this.tree.draggingNode && this.nodeOverDropPoint) {
            AnalyticsService.sendEvent({category: 'User Group Tree', action: 'DropOnDropPoint'});
            this.tree.moveNode(this.tree.draggingNode, this.parent);
            this.nodeOverDropPoint = false;
        }
    }

    /* -- Node Events */

    onDragEnterNode(event: DragEvent) {
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

    onDragLeaveNode(event: DragEvent) {
        event.dataTransfer.dropEffect = undefined;
        this.nodeOverNode = false;
    }

    onNodeDrop(event: DragEvent) {
        if (this.tree.draggingNode && this.nodeOverNode) {
            AnalyticsService.sendEvent({category: 'User Group Tree', action: 'DropOnUserGroup'});
            this.tree.moveNode(this.tree.draggingNode, this);
            this.nodeOverNode = false;
        }
    }

}