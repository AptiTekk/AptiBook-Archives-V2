/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Resource} from "./resource.model";

/**
 * Represents a single Resource Category.
 */
export interface ResourceCategory {

    id?: number;

    name?: string;

    resources?: Resource[];

}