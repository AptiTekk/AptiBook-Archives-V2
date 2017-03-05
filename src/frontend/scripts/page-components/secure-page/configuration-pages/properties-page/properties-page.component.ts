/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {
    Component, Directive, ElementRef, forwardRef, Input, OnChanges, OnInit, AfterViewInit, QueryList, SimpleChanges, ViewChild,
    ViewChildren
} from "@angular/core";
import {PropertiesService} from "../../../../services/singleton/properties-service";
import {Property} from "../../../../models/property.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AlertComponent} from "../../../../components/alert/alert.component";
import {NavigationLink} from "../../../../components/navigation/navigation-link.model";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";

@Component({
    selector: 'properties-page',
    templateUrl: 'properties-page.component.html',
})
export class PropertiesPageComponent implements OnInit, AfterViewInit {

    @ViewChild('successAlert')
    successAlert: AlertComponent;

    @ViewChild('warnAlert')
    warnAlert: AlertComponent;

    public properties: Property[];

    protected sectionLinks: NavigationLink[] = [
        {
            label: 'Personalization',
            icon: 'paint-brush',
            path: ['', 'secure', 'configuration', 'properties', 'personalization']
        },
        {
            label: 'Authentication',
            icon: 'asterisk',
            path: ['', 'secure', 'configuration', 'properties', 'authentication']
        }
    ];

    @ViewChildren(forwardRef(() => PropertySectionComponent)) propertySections: QueryList<PropertySectionComponent>;

    protected formGroup: FormGroup;

    constructor(private router: Router,
            private activatedRoute: ActivatedRoute,
                private propertiesService: PropertiesService,
                private formBuilder: FormBuilder) {
    }

    ngOnInit(): void {

        this.propertiesService.fetchProperties();

        // Gets the properties and builds a form from it.
        // This will be triggered any time fetchProperties() is called.
        this.propertiesService.getProperties().subscribe(
            properties => {
                this.properties = properties;
                this.buildForm();
            });
    }

    ngAfterViewInit(): void {
        this.activatedRoute.params.subscribe(params => {
            let sectionPath = params['section'];

            // Ensure that the path we are on is a valid path.
            // Iterate through each section to see if a section exists with this path name.
            let pathIsValid: boolean = false;
            this.propertySections.forEach(section => {
                if(section.getSectionPath() === sectionPath)
                pathIsValid = true;
            });

            if(!pathIsValid) // If no section with the path name exists, redirect to root.
                this.router.navigate(['', 'secure', 'configuration', 'properties']);
            else // Otherwise, show the section.
                this.showSection(sectionPath);

            this.propertySections.changes.subscribe(() => this.showSection(sectionPath));
        });
    }

    /**
     * Sets the specified section to visible if it is found, and the rest to invisible.
     * @param sectionPath The section to make visible.
     */
    private showSection(sectionPath: string) {
        this.propertySections.forEach(section => {
            if (section.getSectionPath() === sectionPath)
                section.setVisible(true);
            else
                section.setVisible(false);
        })
    }

    buildForm() {
        this.formGroup = this.formBuilder.group(
            // This will turn the array of properties into an object with keys named by the property key names, and values of the properties' values.
            this.properties.reduce((map, property) => {
                map[property.keyName] = property.propertyValue;
                return map;
            }, {})
        );
    }

    reset() {
        this.properties.forEach(property => {
            property.propertyValue = property.defaultValue;
            this.propertiesService.patchProperty(property).subscribe(
                response => this.propertiesService.fetchProperties()
            );
        });

        this.successAlert.display("Properties have been reset!");
    }

    onSubmit() {
        let madeChange = false;

        let patches: Observable<Property>[] = [];

        for (let controlName in this.formGroup.controls) {
            if (this.formGroup.controls[controlName].dirty) {
                madeChange = true;

                let propertyPatch: Property = {
                    propertyValue: this.formGroup.controls[controlName].value,
                    keyName: controlName
                };

                patches.push(this.propertiesService.patchProperty(propertyPatch));
            }
        }

        // Run all the patches at the same time.
        Observable.zip(...patches, () => null).subscribe(
            response => this.propertiesService.fetchProperties()
        );

        if (madeChange) {
            this.successAlert.display("Changes have been saved!");
        } else {
            this.warnAlert.display("No changes detected.");
        }
        madeChange = false;

    }

}

@Component({
    selector: 'property-section',
    template: `<ng-content *ngIf="visible"></ng-content>`
})
export class PropertySectionComponent {

    @Input() private sectionPath: string;
    protected visible: boolean = false;

    /**
     * @returns The path after the /properties/ part of the url.
     */
    public getSectionPath() {
        return this.sectionPath;
    }

    public isVisible(): boolean {
        return this.visible;
    }

    /**
     * Displays or hides the property section.
     * @param visible If the property section should be visible (defaults to true).
     */
    public setVisible(visible: boolean = true): void {
        this.visible = visible;
    }

}