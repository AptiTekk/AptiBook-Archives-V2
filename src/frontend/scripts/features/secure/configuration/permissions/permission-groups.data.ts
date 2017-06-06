import {PermissionGroup} from "./permission-group.model";
export const PERMISSION_GROUPS: PermissionGroup[] = [
    {
        name: 'General',
        slug: 'general',
        details: [
            {
                name: 'Full Permissions',
                description: `Users and User Groups with this permission are granted all permissions. They have un-restricted access to AptiBook.
                                <ul>
                                    <li>If a User is given this permission, the User is granted all permissions.</li>
                                    <li>If a User Group is given this permission, any Users within the User Group are granted all permissions.</li>
                                </ul>`,
                permission: {
                    descriptor: 'GENERAL_FULL_PERMISSIONS'
                }
            }
        ]
    },
    {
        name: 'Resource Categories',
        slug: 'resource_categories',
        details: [
            {
                name: 'May Modify Any Resource Categories',
                description: `Users and User Groups with this permission may create, edit, and delete any Resource Categories. 
                                <ul> 
                                    <li>If a User is given this permission, the User may create, edit, and delete any Resource Categories.</li> 
                                    <li>If a User Group is given this permission, any Users within the User Group may create, edit, and delete any Resource Categories.</li> 
                                </ul>`,
                permission: {
                    descriptor: 'RESOURCE_CATEGORIES_MODIFY_ALL'
                }
            }
        ]
    },
    {
        name: 'Resources',
        slug: 'resources',
        details: [
            {
                name: 'May Modify Own Group\'s Resources',
                description: `Users and User Groups with this permission may create, edit, and delete Resources for their User Group. 
                                <ul> 
                                    <li>If a User is given this permission, the User may create, edit, and delete Resources for the User Groups that the User is assigned to.</li> 
                                    <li>If a User Group is given this permission, any Users within the User Group may create, edit, and delete Resources for their User Group.</li> 
                                </ul>`,
                permission: {
                    descriptor: 'RESOURCES_MODIFY_OWN'
                }
            },
            {
                name: 'May Modify Hierarchy\'s Resources',
                description: `Users and User Groups with this permission may create, edit, and delete Resources for their User Group and that User Group's children. 
                                <ul> 
                                    <li>If a User is given this permission, the User may create, edit, and delete Resources for the User Groups that the User is assigned to, and those User Groups' children.</li> 
                                    <li>If a User Group is given this permission, any Users within the User Group may create, edit, and delete Resources for their User Group and that User Group's children.</li> 
                                </ul>`,
                permission: {
                    descriptor: 'RESOURCES_MODIFY_HIERARCHY'
                }
            },
            {
                name: 'May Modify Any Resources',
                description: `Users and User Groups with this permission may create, edit, and delete any Resources. 
                                <ul> 
                                    <li>If a User is given this permission, the User may create, edit, and delete any Resources.</li> 
                                    <li>If a User Group is given this permission, any Users within the User Group may create, edit, and delete any Resources.</li> 
                                </ul>`,
                permission: {
                    descriptor: 'RESOURCES_MODIFY_ALL'
                }
            }
        ]
    },
    {
        name: 'Reservations',
        slug: 'reservations',
        details: [
            {
                name: 'May Modify All Reservations',
                description: `Users and User Groups with this permission may edit and cancel any Reservations. 
                                <ul> 
                                    <li>If a User is given this permission, the User may edit and cancel any Reservations.</li> 
                                    <li>If a User Group is given this permission, any Users within the User Group may edit and cancel any Reservations.</li> 
                                </ul>`,
                permission: {
                    descriptor: 'RESERVATIONS_MODIFY_ALL'
                }
            }
        ]
    },
    {
        name: 'Users',
        slug: 'users',
        details: [
            {
                name: 'May Modify Any Users',
                description: `Users and User Groups with this permission may create, edit, and delete any Users. 
                                <ul> 
                                    <li>If a User is given this permission, the User may create, edit, and delete any Users.</li> 
                                    <li>If a User Group is given this permission, any Users within the User Group may create, edit, and delete any Users.</li> 
                                </ul>`,
                permission: {
                    descriptor: 'USERS_MODIFY_ALL'
                }
            }
        ]
    },
    {
        name: 'User Groups',
        slug: 'user_groups',
        details: [
            {
                name: 'May Modify Any User Groups',
                description: `Users and User Groups with this permission may create, edit, and delete any User Groups. 
                                <ul> 
                                    <li>If a User is given this permission, the User may create, edit, and delete any User Groups.</li> 
                                    <li>If a User Group is given this permission, any Users within the User Group may create, edit, and delete any User Groups.</li> 
                                </ul>`,
                permission: {
                    descriptor: 'GROUPS_MODIFY_ALL'
                }
            }
        ]
    },
    {
        name: 'Properties',
        slug: 'properties',
        details: [
            {
                name: 'May Modify Any Properties',
                description: `Users and User Groups with this permission may edit any Properties. 
                                <ul> 
                                    <li>If a User is given this permission, the User may edit any Properties.</li> 
                                    <li>If a User Group is given this permission, any Users within the User Group may edit any Properties.</li> 
                                </ul>`,
                permission: {
                    descriptor: 'PROPERTIES_MODIFY_ALL'
                }
            }
        ]
    }
];