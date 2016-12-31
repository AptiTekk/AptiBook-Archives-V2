import {Component, Input, forwardRef} from "@angular/core";
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

    @Input() selectMultiple: boolean = false;

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

        this.propagateChanges(this.selectedUserGroups);
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