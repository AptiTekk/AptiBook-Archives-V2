/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, ContentChildren, QueryList, Input, Inject, forwardRef, OnInit, AfterViewInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

@Component({
    selector: 'accordian-navigation',
    templateUrl: 'accordian-navigation.component.html',
    styleUrls: ['accordian-navigation.component.css']
})
export class AccordianNavigationComponent implements OnInit, AfterViewInit {

    @ContentChildren(AccordianNavigationComponent) private navigationQueryList: QueryList<AccordianNavigationComponent>;
    protected children: AccordianNavigationComponent[];

    protected parent: AccordianNavigationComponent;

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
                        this.active = this.router.isActive(this.router.createUrlTree(this.link), true);
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
        // This navigation is not a link.
        if (!this.link) {
            // If it's a link or it can't collapse, we don't want to do anything to it.
            if (this.canCollapse) {
                if (this.expanded)
                    this.collapse();
                else
                    this.expand();
            }
        } else {
            // This navigation is a link.
            this.router.navigate(this.link);
        }
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