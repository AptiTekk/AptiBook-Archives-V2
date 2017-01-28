/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {Router, NavigationEnd} from "@angular/router";
import {Observable} from "rxjs";

@Injectable()
export class HelpService {

    private static readonly HELP_DEFINITIONS: [{url: string, topics: [{title: string, slug: string}]}] = [
        {
            url: '/sign-in',
            topics: [
                {title: 'How to Sign In', slug: 'ab-how-to-sign-in'}
            ]
        },
        {
            url: '/register',
            topics: [
                {title: 'How to Register', slug: 'ab-how-to-register'}
            ]
        }
    ];

    private currentHelpTopicsObservable: Observable<[{title: string, slug: string}]>;

    constructor(private router: Router) {
        this.currentHelpTopicsObservable = Observable.create(listener => {

            router.events.subscribe(value => {

                //Navigation has finished
                if (value instanceof NavigationEnd) {

                    //Get current url
                    let currentUrl = (<NavigationEnd> value).urlAfterRedirects;

                    //Determine which topics to send
                    let topics: [{title: string, slug: string}];
                    for (let definition of HelpService.HELP_DEFINITIONS) {
                        if (definition.url === currentUrl)
                            topics = definition.topics;
                    }

                    //Notify listener
                    listener.next(topics);
                }
            });

        });
    }

    public getCurrentHelpTopics(): Observable<[{title: string, slug: string}]> {
        return this.currentHelpTopicsObservable;
    }

}