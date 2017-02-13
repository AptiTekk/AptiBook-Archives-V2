/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from "@angular/core";
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
export class TreeComponent implements OnInit, ControlValueAccessor {

    /**
     * Determines if the Tree has drag-and-drop support. Defaults to false.
     */
    @Input() dragAndDrop: boolean = false;

    /**
     * Determines if nodes on the Tree can be selected. Defaults to true.
     */
    @Input() selectable: boolean = true;

    /**
     * Fired when a node on the tree is selected.
     * {@link TreeComponent#selectable|selectable} must be enabled.
     * The event contains the UserGroup of the selected node.
     */
    @Output() selected: EventEmitter<UserGroup[]> = new EventEmitter<UserGroup[]>();

    /**
     * Determines if multiple nodes on the Tree can be selected. Defaults to false.
     * {@link TreeComponent#selectable|selectable} must be enabled.
     */
    @Input() selectMultiple: boolean = false;

    /**
     * Determines if only one node per branch can be selected at a time. Defaults to false.
     * {@link TreeComponent#selectable|selectable} must be enabled.
     */
    @Input() preventSameBranchSelection: boolean = false;

    /**
     * Determines if the root node will appear on the tree. Defaults to false.
     */
    @Input() showRoot: boolean = false;

    rootGroup: UserGroup;

    selectedUserGroups: UserGroup[] = [];

    draggingNode: TreeNodeComponent;

    constructor(private userGroupService: UserGroupService) {
    }

    ngOnInit(): void {
        this.userGroupService.getRootUserGroup().subscribe(root => this.rootGroup = root);
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

            // If the group is already selected, deselect it.
            if (this.selectedUserGroups.length > 0 && this.selectedUserGroups[0].id === treeNode.userGroup.id) {
                this.selectedUserGroups = [];
            } else {
                // Otherwise, clear the array and set the selected User Group to the one clicked.
                this.selectedUserGroups = [treeNode.userGroup];
            }
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
        this.selected.emit(this.selectedUserGroups);
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

    public moveNode(node: TreeNodeComponent, newParentNode: TreeNodeComponent) {
        if (!node)
            return;

        if (node === newParentNode)
            return;

        if (node.userGroup.root)
            return;

        this.userGroupService
            .moveUserGroup(node.userGroup, newParentNode ? newParentNode.userGroup : this.rootGroup)
            .subscribe(
                success => this.userGroupService.fetchRootUserGroup()
            );
    }

    public selectUserGroup(userGroup: UserGroup) {
        this.selectedUserGroups = [userGroup];
        this.propagateChanges(this.selectedUserGroups);
        this.selected.emit(this.selectedUserGroups);
    }

    public getSelectedUserGroups(): UserGroup[] {
        return this.selectedUserGroups;
    }

    writeValue(obj: UserGroup[] | UserGroup): void {
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