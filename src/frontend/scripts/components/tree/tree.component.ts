import {Component, Input, ViewEncapsulation, forwardRef} from "@angular/core";
import {UserGroup} from "../../models/user-group.model";
import {TreeNodeComponent} from "./tree-node/tree-node.component";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {UserGroupService} from "../../services/singleton/usergroup.service";

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

    @Input() showRoot: boolean = false;

    rootGroup: UserGroup;

    @Input() highlightedUserGroups: UserGroup[];

    selectedUserGroup: UserGroup;

    draggingNode: TreeNodeComponent;

    constructor(userGroupService: UserGroupService) {
        userGroupService.getRootUserGroup().subscribe(root => this.rootGroup = root);
    }

    onNodeSelected(treeNode: TreeNodeComponent) {
        this.selectedUserGroup = treeNode.userGroup;
        this.propagateChanges(this.selectedUserGroup);
    }

    writeValue(obj: any): void {
        this.selectedUserGroup = obj;
    }

    private propagateChanges = (group: UserGroup) => {
    };

    registerOnChange(fn: any): void {
        this.propagateChanges = fn;
    }

    registerOnTouched(fn: any): void {
    }
}