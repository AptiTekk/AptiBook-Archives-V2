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
var tree_component_1 = require("../tree.component");
var TreeNodeComponent = TreeNodeComponent_1 = (function () {
    function TreeNodeComponent() {
        this.nodeOverDropPoint = false;
        this.nodeOverNode = false;
    }
    TreeNodeComponent.prototype.onNodeClick = function (event) {
        if (this.tree.selectable)
            this.tree.onNodeSelected(this, event.ctrlKey);
    };
    TreeNodeComponent.prototype.isSelected = function () {
        for (var _i = 0, _a = this.tree.selectedUserGroups; _i < _a.length; _i++) {
            var userGroup = _a[_i];
            if (userGroup.id === this.userGroup.id)
                return true;
        }
        return false;
    };
    /* Dragging of This Node */
    TreeNodeComponent.prototype.onDragStart = function (event) {
        event.dataTransfer.effectAllowed = "move";
        this.tree.draggingNode = this;
    };
    TreeNodeComponent.prototype.onDragEnd = function (event) {
        this.tree.draggingNode = undefined;
    };
    /* Dragging of Other Nodes */
    /* -- Drop Point Events */
    TreeNodeComponent.prototype.onDragEnterDropPoint = function (event) {
        if (!this.tree.draggingNode)
            return;
        if (this.tree.draggingNode === this)
            return;
        // Ensure that the node being dragged is not a parent of this node.
        var parentGroup = this;
        while ((parentGroup = parentGroup.parent)) {
            if (parentGroup === this.tree.draggingNode)
                return;
        }
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        this.nodeOverDropPoint = true;
    };
    TreeNodeComponent.prototype.onDragLeaveDropPoint = function (event) {
        event.dataTransfer.dropEffect = undefined;
        this.nodeOverDropPoint = false;
    };
    TreeNodeComponent.prototype.onDropPointDrop = function (event) {
        if (this.tree.draggingNode && this.nodeOverDropPoint) {
            this.tree.moveNode(this.tree.draggingNode, this.parent);
            this.nodeOverDropPoint = false;
        }
    };
    /* -- Node Events */
    TreeNodeComponent.prototype.onDragEnterNode = function (event) {
        if (!this.tree.draggingNode)
            return;
        if (this.tree.draggingNode === this)
            return;
        // Ensure that the node being dragged is not a parent of this node, or this node's immediate child.
        var parentGroup = this;
        while ((parentGroup = parentGroup.parent)) {
            if (parentGroup === this.tree.draggingNode)
                return;
        }
        if (this.tree.draggingNode.parent === this)
            return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        this.nodeOverNode = true;
    };
    TreeNodeComponent.prototype.onDragLeaveNode = function (event) {
        event.dataTransfer.dropEffect = undefined;
        this.nodeOverNode = false;
    };
    TreeNodeComponent.prototype.onNodeDrop = function (event) {
        if (this.tree.draggingNode && this.nodeOverNode) {
            this.tree.moveNode(this.tree.draggingNode, this);
            this.nodeOverNode = false;
        }
    };
    return TreeNodeComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", tree_component_1.TreeComponent)
], TreeNodeComponent.prototype, "tree", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", TreeNodeComponent)
], TreeNodeComponent.prototype, "parent", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TreeNodeComponent.prototype, "userGroup", void 0);
__decorate([
    core_1.ViewChildren(TreeNodeComponent_1),
    __metadata("design:type", core_1.QueryList)
], TreeNodeComponent.prototype, "children", void 0);
TreeNodeComponent = TreeNodeComponent_1 = __decorate([
    core_1.Component({
        selector: 'tree-node',
        templateUrl: 'tree-node.component.html'
    })
], TreeNodeComponent);
exports.TreeNodeComponent = TreeNodeComponent;
var TreeNodeComponent_1;
//# sourceMappingURL=tree-node.component.js.map