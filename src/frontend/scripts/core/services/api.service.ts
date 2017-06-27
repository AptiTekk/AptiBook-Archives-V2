/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, Response} from "@angular/http";
import {APIResponse} from "../../models/api-response.model";
import {APIError} from "../../models/api-error.model";
import {Observable} from "rxjs/Observable";

declare const JSOG: any;

@Injectable()
export class APIService {

    private apiUrl: string = "/api/";
    private headers: Headers = new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    });

    constructor(private http: Http) {
    }

    public getApiUrlFromEndpoint(endpoint: string): string {
        return this.apiUrl + APIService.removeTrailingSlash(endpoint);
    }

    private static removeTrailingSlash(path: string): string {
        if (path && path.startsWith("/"))
            path = path.substring(1);
        return path;
    }

    private static checkForErrors(response: Response) {
        let body: APIResponse = JSOG.parse(response.text())
        if (body.ok === true)
            return body.content
        else
            throw <APIError>{error: body.error, message: body.message}
    }

    public get(path: string, additionalHeaders?: Headers): Promise<any> {

        // Merge additional headers with default headers.
        let options;
        if (additionalHeaders) {
            let newHeaders: Headers = new Headers(this.headers);
            additionalHeaders.forEach((values: string[], name: string) => {
                values.forEach((value: string) => newHeaders.append(name, value));
            });
            options = new RequestOptions({headers: newHeaders});
        }
        else options = new RequestOptions({headers: this.headers});

        // Make request
        return new Promise((resolve, reject) => {
            this.http.get(`${this.apiUrl}${APIService.removeTrailingSlash(path)}`, options)
                .map(response => APIService.checkForErrors(response))
                .catch(error => Observable.throw(error))
                .subscribe(content => resolve(content), err => reject(err))
        })
    }

    public post(path: string, data: any): Promise<any> {
        let options = new RequestOptions({headers: this.headers});

        return new Promise((resolve, reject) => {
            this.http.post(`${this.apiUrl}${APIService.removeTrailingSlash(path)}`, JSOG.stringify(data), options)
                .map(response => APIService.checkForErrors(response))
                .catch(error => Observable.throw(error))
                .subscribe(content => resolve(content), err => reject(err))
        });
    }

    public put(path: string, data: any): Promise<any> {
        let options = new RequestOptions({headers: this.headers});

        return new Promise((resolve, reject) => {
            this.http.put(`${this.apiUrl}${APIService.removeTrailingSlash(path)}`, JSOG.stringify(data), options)
                .map(response => APIService.checkForErrors(response))
                .catch(error => Observable.throw(error))
                .subscribe(content => resolve(content), err => reject(err))
        });
    }

    public patch(path: string, data?: any, useJsog: boolean = true): Promise<any> {
        let options = new RequestOptions({headers: this.headers});

        return new Promise((resolve, reject) => {
            this.http.patch(`${this.apiUrl}${APIService.removeTrailingSlash(path)}`, data != null ? (useJsog ? JSOG.stringify(data) : JSON.stringify(data)) : undefined, options)
                .map(response => APIService.checkForErrors(response))
                .catch(error => Observable.throw(error))
                .subscribe(content => resolve(content), err => reject(err))
        });
    }

    public del(path: string): Promise<any> {
        let options = new RequestOptions({headers: this.headers});

        return new Promise((resolve, reject) => {
            this.http.delete(`${this.apiUrl}${APIService.removeTrailingSlash(path)}`, options)
                .map(response => APIService.checkForErrors(response))
                .catch(error => Observable.throw(error))
                .subscribe(content => resolve(content), err => reject(err))
        });
    }

}