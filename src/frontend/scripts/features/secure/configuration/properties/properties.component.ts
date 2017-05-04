/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {AfterViewInit, Component, forwardRef, OnInit, QueryList, ViewChild, ViewChildren} from "@angular/core";
import {PropertiesService} from "../../../../core/services/properties-service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AlertComponent} from "../../../../shared/alert/alert.component";
import {NavigationLink} from "../../../../shared/navigation/navigation-link.model";
import {ActivatedRoute, Router} from "@angular/router";
import {PropertiesSectionComponent} from "./properties-section/properties-section.component";
import {Properties} from "../../../../models/properties.model";

@Component({
    selector: 'at-configuration-properties',
    templateUrl: 'properties.component.html',
})
export class PropertiesConfigurationComponent implements OnInit, AfterViewInit {

    @ViewChild('successAlert')
    successAlert: AlertComponent;

    @ViewChild('dangerAlert')
    dangerAlert: AlertComponent;

    properties: Properties;

    CAS_CALLBACK_URL: string = window.location.protocol + '//' + window.location.host + '/api/cas/callback';

    sectionLinks: NavigationLink[] = [
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

    @ViewChildren(forwardRef(() => PropertiesSectionComponent)) propertySections: QueryList<PropertiesSectionComponent>;

    formGroup: FormGroup;

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
                if (section.getSectionPath() === sectionPath)
                    pathIsValid = true;
            });

            if (!pathIsValid) // If no section with the path name exists, redirect to root.
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
            this.properties
        );
    }

    onAuthenticationMethodChanged() {
        // To ensure that the CAS URL is sent with the patch when CAS is selected...
        if (this.formGroup.controls['AUTHENTICATION_METHOD'].value === 'CAS') {
            this.formGroup.controls['CAS_SERVER_URL'].markAsDirty();
        } else {
            this.formGroup.controls['CAS_SERVER_URL'].markAsPristine();
        }
    }

    reset() {
        //let patches: Observable<Property>[] = [];

        //TODO: make a reset properties endpoint
        /*this.properties.forEach(property => {
         property.propertyValue = property.defaultValue;
         patches.push(this.propertiesService.patchProperty(property));
         });*/

        /*// Run all the patches at the same time.
         Observable.zip(...patches, () => null).subscribe(
         response => this.propertiesService.fetchProperties()
         );*/

        this.successAlert.display("Properties have been reset!");
    }

    onSubmit() {
        let propertiesPatch: Properties = {};

        for (let controlName in this.formGroup.controls) {
            if (this.formGroup.controls[controlName].dirty)
                propertiesPatch[controlName] = this.formGroup.controls[controlName].value;
        }


        this.propertiesService.patchProperties(propertiesPatch)
            .subscribe(
                properties => {
                    this.propertiesService.fetchProperties();
                    this.successAlert.display("Changes have been saved!");
                },
                err => {
                    this.dangerAlert.display(err);
                }
            );
    }

}