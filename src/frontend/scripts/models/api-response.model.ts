/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

/**
 * Top level response from all API requests.
 */
export interface APIResponse {

    ok: boolean,

    error: string,

    message: string,

    content: any

}