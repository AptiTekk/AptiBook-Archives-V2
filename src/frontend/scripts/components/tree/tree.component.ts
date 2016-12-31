import {Component, Input, forwardRef} from "@angular/core";
import {UserGroup} from "../../models/user-group.model";
import {TreeNodeComponent} from "./tree-node/tree-node.component";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {UserGroupService} from "../../services/singleton/usergroup.service";
import * as Collections from "typescript-collections";

@Component({
    selector: 'tree',
    templateUrl: 'tree.component.html',
    styleUrls: ['tree.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TreeComponent),
            multi: true
        }
    ]
})
export class TreeComponent implements ControlValueAccessor {

    @Input() dragAndDrop: boolean = false;

    @Input() selectable: boolean = true;

    @Input() selectMultiple: boolean = false;

    @Input() preventSameBranchSelection: boolean = false;

    @Input() showRoot: boolean = false;

    rootGroup: UserGroup;

    selectedUserGroups: UserGroup[] = [];

    draggingNode: TreeNodeComponent;

    constructor(userGroupService: UserGroupService) {
        userGroupService.getRootUserGroup().subscribe(root => this.rootGroup = root);
    }

    onNodeSelected(treeNode: TreeNodeComponent, ctrlDown: boolean = false) {
        // If the ctrl key was down and we can select multiple
        if (ctrlDown && this.selectMultiple) {
            let index: number = -1;

            // Check if the array already contains the User Group
            for (let i = 0; i < this.selectedUserGroups.length; i++) {
                if (this.selectedUserGroups[i].id === treeNode.userGroup.id) {
                    index = i;
                    break;
                }
            }

            // If the selected User Group didn't exist, add it, otherwise remove it.
            if (index === -1)
                this.selectedUserGroups.push(treeNode.userGroup);
            else
                this.selectedUserGroups.splice(index, 1);
        } else {
            // Clear the array and set the selected User Group to the one clicked.
            this.selectedUserGroups = [treeNode.userGroup];
        }

        // Check if multiple nodes are selected on the same branch,
        // and only allow the highest node to be selected.
        if (this.preventSameBranchSelection) {

            // Climb tree and deselect any nodes above the selected
            this.deselectAllUpperNodes(treeNode);

            // Descend tree and deselect any nodes below the selected
            this.deselectAllLowerNodes(treeNode);
        }

        this.propagateChanges(this.selectedUserGroups);
    }

    /**
     * Climbs the tree from the origin node and deselects any selected nodes encountered on the origin node's branch.
     * @param originNode The origin node from which to start climbing.
     */
    private deselectAllUpperNodes(originNode: TreeNodeComponent) {
        let currentNode = originNode;

        while ((currentNode = currentNode.parent)) {
            // Filter the node's User Group from the Selected User Groups.
            this.selectedUserGroups = this.selectedUserGroups.filter((userGroup: UserGroup) => userGroup.id !== currentNode.userGroup.id);
        }
    }

    /**
     * Descends the tree from the origin node and deselects any selected nodes encountered on the origin node's branches.
     * @param originNode The origin node from which to start descending.
     */
    private deselectAllLowerNodes(originNode: TreeNodeComponent) {
        let childrenTraversalQueue = new Collections.Queue<TreeNodeComponent>();

        // Initialize queue
        originNode.children.forEach((node: TreeNodeComponent) => {
            childrenTraversalQueue.enqueue(node);
        });

        // Iterate through queue
        while (!childrenTraversalQueue.isEmpty()) {
            let childNode = childrenTraversalQueue.dequeue();

            // Add the node's children to the queue
            childNode.children.forEach((node: TreeNodeComponent) => {
                childrenTraversalQueue.enqueue(node);
            });

            // Filter the node's User Group from the Selected User Groups.
            this.selectedUserGroups = this.selectedUserGroups.filter((userGroup: UserGroup) => userGroup.id !== childNode.userGroup.id);
        }
    }

    writeValue(obj: UserGroup[]|UserGroup): void {
        this.selectedUserGroups = obj ? [].concat(obj) : [];
    }

    private propagateChanges = (userGroups: UserGroup[]) => {
    };

    registerOnChange(fn: any): void {
        this.propagateChanges = fn;
    }

    registerOnTouched(fn: any): void {
    }
}