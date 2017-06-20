import {PermissionGroup} from "./permission-group.model";
export const PERMISSION_GROUPS: PermissionGroup[] = [
    {
        name: 'General',
        key: 'GENERAL',
        permissions: [
            {
                name: 'Full Permissions',
                key: 'GENERAL_FULL_PERMISSIONS',
                description: `Users and User Groups with this permission are granted all permissions. They have un-restricted access to AptiBook.
                                <ul>
                                    <li>If a User is given this permission, the User is granted all permissions.</li>
                                    <li>If a User Group is given this permission, any Users within the User Group are granted all permissions.</li>
                                </ul>`
            }
        ]
    },
    {
        name: 'Resource Categories',
        key: 'RESOURCE_CATEGORIES',
        permissions: [
            {
                name: 'May Modify Any Resource Categories',
                key: 'RESOURCE_CATEGORIES_MODIFY_ALL',
                description: `Users and User Groups with this permission may create, edit, and delete any Resource Categories. 
                                <ul> 
                                    <li>If a User is given this permission, the User may create, edit, and delete any Resource Categories.</li> 
                                    <li>If a User Group is given this permission, any Users within the User Group may create, edit, and delete any Resource Categories.</li> 
                                </ul>`,
            }
        ]
    },
    {
        name: 'Resources',
        key: 'RESOURCES',
        permissions: [
            {
                name: 'May Modify Own Group\'s Resources',
                key: 'RESOURCES_MODIFY_OWN',
                description: `Users and User Groups with this permission may create, edit, and delete Resources for their User Group. 
                                <ul> 
                                    <li>If a User is given this permission, the User may create, edit, and delete Resources for the User Groups that the User is assigned to.</li> 
                                    <li>If a User Group is given this permission, any Users within the User Group may create, edit, and delete Resources for their User Group.</li> 
                                </ul>`,
            },
            {
                name: 'May Modify Hierarchy\'s Resources',
                key: 'RESOURCES_MODIFY_HIERARCHY',
                description: `Users and User Groups with this permission may create, edit, and delete Resources for their User Group and that User Group's children. 
                                <ul> 
                                    <li>If a User is given this permission, the User may create, edit, and delete Resources for the User Groups that the User is assigned to, and those User Groups' children.</li> 
                                    <li>If a User Group is given this permission, any Users within the User Group may create, edit, and delete Resources for their User Group and that User Group's children.</li> 
                                </ul>`,
            },
            {
                name: 'May Modify Any Resources',
                key: 'RESOURCES_MODIFY_ALL',
                description: `Users and User Groups with this permission may create, edit, and delete any Resources. 
                                <ul> 
                                    <li>If a User is given this permission, the User may create, edit, and delete any Resources.</li> 
                                    <li>If a User Group is given this permission, any Users within the User Group may create, edit, and delete any Resources.</li> 
                                </ul>`,
            }
        ]
    },
    {
        name: 'Reservations',
        key: 'RESERVATIONS',
        permissions: [
            {
                name: 'May Modify All Reservations',
                key: 'RESERVATIONS_MODIFY_ALL',
                description: `Users and User Groups with this permission may edit and cancel any Reservations. 
                                <ul> 
                                    <li>If a User is given this permission, the User may edit and cancel any Reservations.</li> 
                                    <li>If a User Group is given this permission, any Users within the User Group may edit and cancel any Reservations.</li> 
                                </ul>`,
            }
        ]
    },
    {
        name: 'Users',
        key: 'USERS',
        permissions: [
            {
                name: 'May Modify Any Users',
                key: 'USERS_MODIFY_ALL',
                description: `Users and User Groups with this permission may create, edit, and delete any Users. 
                                <ul> 
                                    <li>If a User is given this permission, the User may create, edit, and delete any Users.</li> 
                                    <li>If a User Group is given this permission, any Users within the User Group may create, edit, and delete any Users.</li> 
                                </ul>`,
            }
        ]
    },
    {
        name: 'User Groups',
        key: 'USER_GROUPS',
        permissions: [
            {
                name: 'May Modify Any User Groups',
                key: 'GROUPS_MODIFY_ALL',
                description: `Users and User Groups with this permission may create, edit, and delete any User Groups. 
                                <ul> 
                                    <li>If a User is given this permission, the User may create, edit, and delete any User Groups.</li> 
                                    <li>If a User Group is given this permission, any Users within the User Group may create, edit, and delete any User Groups.</li> 
                                </ul>`,
            }
        ]
    },
    {
        name: 'Properties',
        key: 'PROPERTIES',
        permissions: [
            {
                name: 'May Modify Any Properties',
                key: 'PROPERTIES_MODIFY_ALL',
                description: `Users and User Groups with this permission may edit any Properties. 
                                <ul> 
                                    <li>If a User is given this permission, the User may edit any Properties.</li> 
                                    <li>If a User Group is given this permission, any Users within the User Group may edit any Properties.</li> 
                                </ul>`,
            }
        ]
    }
];