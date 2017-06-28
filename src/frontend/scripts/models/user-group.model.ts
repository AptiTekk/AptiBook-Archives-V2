/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

export interface UserGroup {

    id?: number

    root?: boolean

    name?: string

}

export interface UserGroupHierarchy extends UserGroup {

    parent?: UserGroupHierarchy

    children?: UserGroupHierarchy[]

}

export interface UserGroupHierarchyUp extends UserGroup {

    parent?: UserGroupHierarchyUp

}

export interface UserGroupHierarchyDown extends UserGroup {

    children?: UserGroupHierarchyDown[]

}