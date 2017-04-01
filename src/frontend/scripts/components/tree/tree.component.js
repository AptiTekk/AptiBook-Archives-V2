/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var usergroup_service_1 = require("../../services/singleton/usergroup.service");
var Collections = require("typescript-collections");
var TreeComponent = TreeComponent_1 = (function () {
    function TreeComponent(userGroupService) {
        this.userGroupService = userGroupService;
        /**
         * Determines if the Tree has drag-and-drop support. Defaults to false.
         */
        this.dragAndDrop = false;
        /**
         * Determines if nodes on the Tree can be selected. Defaults to true.
         */
        this.selectable = true;
        /**
         * Fired when a node on the tree is selected.
         * {@link TreeComponent#selectable|selectable} must be enabled.
         * The event contains the UserGroup of the selected node.
         */
        this.selected = new core_1.EventEmitter();
        /**
         * Determines if multiple nodes on the Tree can be selected. Defaults to false.
         * {@link TreeComponent#selectable|selectable} must be enabled.
         */
        this.selectMultiple = false;
        /**
         * Determines if only one node per branch can be selected at a time. Defaults to false.
         * {@link TreeComponent#selectable|selectable} must be enabled.
         */
        this.preventSameBranchSelection = false;
        /**
         * Determines if the root node will appear on the tree. Defaults to false.
         */
        this.showRoot = false;
        this.selectedUserGroups = [];
        this.propagateChanges = function (userGroups) {
        };
    }
    TreeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userGroupService.getRootUserGroup().subscribe(function (root) { return _this.rootGroup = root; });
    };
    TreeComponent.prototype.onNodeSelected = function (treeNode, ctrlDown) {
        if (ctrlDown === void 0) { ctrlDown = false; }
        // If the ctrl key was down and we can select multiple
        if (ctrlDown && this.selectMultiple) {
            var index = -1;
            // Check if the array already contains the User Group
            for (var i = 0; i < this.selectedUserGroups.length; i++) {
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
        }
        else {
            // If the group is already selected, deselect it.
            if (this.selectedUserGroups.length > 0 && this.selectedUserGroups[0].id === treeNode.userGroup.id) {
                this.selectedUserGroups = [];
            }
            else {
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
    };
    /**
     * Climbs the tree from the origin node and deselects any selected nodes encountered on the origin node's branch.
     * @param originNode The origin node from which to start climbing.
     */
    TreeComponent.prototype.deselectAllUpperNodes = function (originNode) {
        var currentNode = originNode;
        while ((currentNode = currentNode.parent)) {
            // Filter the node's User Group from the Selected User Groups.
            this.selectedUserGroups = this.selectedUserGroups.filter(function (userGroup) { return userGroup.id !== currentNode.userGroup.id; });
        }
    };
    /**
     * Descends the tree from the origin node and deselects any selected nodes encountered on the origin node's branches.
     * @param originNode The origin node from which to start descending.
     */
    TreeComponent.prototype.deselectAllLowerNodes = function (originNode) {
        var childrenTraversalQueue = new Collections.Queue();
        // Initialize queue
        originNode.children.forEach(function (node) {
            childrenTraversalQueue.enqueue(node);
        });
        var _loop_1 = function () {
            var childNode = childrenTraversalQueue.dequeue();
            // Add the node's children to the queue
            childNode.children.forEach(function (node) {
                childrenTraversalQueue.enqueue(node);
            });
            // Filter the node's User Group from the Selected User Groups.
            this_1.selectedUserGroups = this_1.selectedUserGroups.filter(function (userGroup) { return userGroup.id !== childNode.userGroup.id; });
        };
        var this_1 = this;
        // Iterate through queue
        while (!childrenTraversalQueue.isEmpty()) {
            _loop_1();
        }
    };
    TreeComponent.prototype.moveNode = function (node, newParentNode) {
        var _this = this;
        if (!node)
            return;
        if (node === newParentNode)
            return;
        if (node.userGroup.root)
            return;
        this.userGroupService
            .moveUserGroup(node.userGroup, newParentNode ? newParentNode.userGroup : this.rootGroup)
            .subscribe(function (success) { return _this.userGroupService.fetchRootUserGroup(); });
    };
    TreeComponent.prototype.selectUserGroup = function (userGroup) {
        this.selectedUserGroups = [userGroup];
        this.propagateChanges(this.selectedUserGroups);
        this.selected.emit(this.selectedUserGroups);
    };
    TreeComponent.prototype.getSelectedUserGroups = function () {
        return this.selectedUserGroups;
    };
    TreeComponent.prototype.writeValue = function (obj) {
        this.selectedUserGroups = obj ? [].concat(obj) : [];
    };
    TreeComponent.prototype.registerOnChange = function (fn) {
        this.propagateChanges = fn;
    };
    TreeComponent.prototype.registerOnTouched = function (fn) {
    };
    return TreeComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], TreeComponent.prototype, "dragAndDrop", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], TreeComponent.prototype, "selectable", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], TreeComponent.prototype, "selected", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], TreeComponent.prototype, "selectMultiple", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], TreeComponent.prototype, "preventSameBranchSelection", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], TreeComponent.prototype, "showRoot", void 0);
TreeComponent = TreeComponent_1 = __decorate([
    core_1.Component({
        selector: 'tree',
        templateUrl: 'tree.component.html',
        styleUrls: ['tree.component.css'],
        providers: [
            {
                provide: forms_1.NG_VALUE_ACCESSOR,
                useExisting: core_1.forwardRef(function () { return TreeComponent_1; }),
                multi: true
            }
        ]
    }),
    __metadata("design:paramtypes", [usergroup_service_1.UserGroupService])
], TreeComponent);
exports.TreeComponent = TreeComponent;
var TreeComponent_1;
//# sourceMappingURL=tree.component.js.map