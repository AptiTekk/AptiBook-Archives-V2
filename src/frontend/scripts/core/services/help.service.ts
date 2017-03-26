/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {NavigationEnd, Router} from "@angular/router";
import {Observable} from "rxjs";

@Injectable()
export class HelpService {

    //noinspection JSMismatchedCollectionQueryUpdate
    private static readonly HELP_DEFINITIONS: HelpDefinition[] = [];
        /*[
            {
                route: '/sign-in',
                topics: [
                    {title: 'How to Sign In', slug: 'ab-how-to-sign-in'}
                ]
            },
            {
                route: '/register',
                topics: [
                    {title: 'How to Register', slug: 'ab-how-to-register'}
                ]
            }
        ];*/

    private currentHelpTopicsObservable: Observable<HelpTopic[]>;

    constructor(private router: Router) {
        this.currentHelpTopicsObservable = Observable.create(listener => {

            router.events.subscribe(value => {

                //Navigation has finished
                if (value instanceof NavigationEnd) {

                    //Get current url
                    let currentRoute = (<NavigationEnd> value).urlAfterRedirects;

                    //Determine which topics to send
                    let topics: HelpTopic[];
                    for (let definition of HelpService.HELP_DEFINITIONS) {
                        if (definition.route === currentRoute)
                            topics = definition.topics;
                    }

                    //Notify listener
                    listener.next(topics);
                }
            });

        });
    }

    /**
     * Gets the help topics that are available for the current page.
     * @returns An observable that can be subscribed to and will automatically update with the current help topics.
     */
    public getCurrentHelpTopics(): Observable<HelpTopic[]> {
        return this.currentHelpTopicsObservable;
    }
}

/**
 * A set of Help Topics for a given route of the application.
 */
export interface HelpDefinition {

    /**
     * The route of the help definition refers to which page the help definition will display upon.
     */
    route?: string;

    /**
     * The array of topics defines which topics will be displayed on the route.
     */
    topics?: HelpTopic[];

}

/**
 * A help topic with a title and slug.
 */
export interface HelpTopic {

    /**
     * The title of the help topic is meant to be displayed to the user.
     */
    title?: string,

    /**
     * The slug of the help topic refers to the part that comes after "https://support.aptitekk.com/article/"
     * It is meant to be used when creating a link to the help topic.
     */
    slug?: string

}