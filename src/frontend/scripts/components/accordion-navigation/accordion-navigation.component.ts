/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, ContentChildren, QueryList, Input, Inject, forwardRef, OnInit, AfterViewInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

@Component({
    selector: 'accordion-navigation',
    templateUrl: 'accordion-navigation.component.html',
    styleUrls: ['accordion-navigation.component.css']
})
export class AccordionNavigationComponent implements OnInit, AfterViewInit {

    @ContentChildren(AccordionNavigationComponent) private navigationQueryList: QueryList<AccordionNavigationComponent>;
    protected children: AccordionNavigationComponent[];

    protected parent: AccordionNavigationComponent;

    /**
     * The font awesome icon for the component. (E.x.: 'user')
     */
    @Input() icon: string;

    /**
     * The label for the component. (E.x.: 'My Account')
     */
    @Input() label: string;

    /**
     * The router path to navigate to on click.
     * Only applicable if this menu item is a link.
     */
    @Input() link: string[];

    @Input() exactLinkMatching: boolean = false;

    /**
     * True if this link is active (and should be highlighted).
     * Updates automatically when the route changes.
     * Only applicable if this menu item is a link.
     */
    active: boolean;

    /**
     * True if this menu item should automatically collapse when another menu item expands.
     * Only applicable if this menu item is not a link.
     */
    @Input() autoCollapse: boolean = true;

    /**
     * True if this menu item is able to be collapsed.
     * Only applicable if this menu item is not a link and has children.
     */
    @Input() canCollapse: boolean = true;

    /**
     * True if this menu item is currently expanded.
     * Only applicable if this menu item is not a link.
     */
    @Input() expanded: boolean = false;

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        if (this.link) {

            this.router.events.subscribe(
                event => {
                    if (event instanceof NavigationEnd) {
                        this.active = this.router.isActive(this.router.createUrlTree(this.link), this.exactLinkMatching);
                        if (this.active) {
                            this.expand()
                        }
                    }
                }
            );

        }
    }

    ngAfterViewInit(): void {
        // When the navigationQueryList is updated
        this.navigationQueryList.changes.subscribe(
            changes => {
                this.updateChildrenArray();
            }
        );

        this.updateChildrenArray();
    }

    private updateChildrenArray() {
        // Remove ourselves from the children list (how annoying)
        this.children = this.navigationQueryList.filter(navigation => navigation !== this);

        // Assign ourselves to the parent variable of each child.
        this.children.forEach(navigation => {
            navigation.parent = this;
        });
    }

    onClick(): void {
        if (this.canCollapse) {
            if (this.expanded)
                this.collapse();
            else
                this.expand();
        }

        if (this.link)
            this.router.navigate(this.link);
    }

    protected expand(): void {
        if (this.parent) {
            this.parent.children.forEach(navigation => {
                if (navigation !== this)
                    if (navigation.autoCollapse)
                        navigation.collapse();
            });
            this.parent.expand();
        }
        this.expanded = true;
    }

    protected collapse(): void {
        if (this.canCollapse)
            this.expanded = false;
    }

}