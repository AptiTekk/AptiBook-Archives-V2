import {Injectable} from "@angular/core";
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class APIService {

    private apiUrl: string = document.getElementsByTagName('base')[0].href + "/api/";
    private headers: Headers = new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    });

    constructor(private http: Http) {
    }

    private static convertToJson(response: Response): any {
        return response.json();
    }

    private static checkForErrors(response: Response): Response {
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            let error = new Error(response.statusText);
            error['response'] = response;
            throw error;
        }
    }

    private static removeTrailingSlash(path: string): string {
        if (path !== undefined && path.startsWith("/"))
            path = path.substring(1);
        return path;
    }

    public get(path: string): Observable<any> {
        let options = new RequestOptions({headers: this.headers});
        return this.http.get(`${this.apiUrl}${APIService.removeTrailingSlash(path)}`, options)
            .map(APIService.checkForErrors)
            .catch(e => Observable.throw(e))
            .map(APIService.convertToJson);
    }

    public post(path: string, data: any): Observable<any> {
        let options = new RequestOptions({headers: this.headers});
        return this.http.post(`${this.apiUrl}${APIService.removeTrailingSlash(path)}`, data, options)
            .map(APIService.checkForErrors)
            .catch(e => Observable.throw(e))
            .map(APIService.convertToJson);
    }

    public remove(path: string): Observable<any> {
        let options = new RequestOptions({headers: this.headers});
        return this.http.delete(`${this.apiUrl}${APIService.removeTrailingSlash(path)}`, options)
            .map(APIService.checkForErrors)
            .catch(e => Observable.throw(e))
            .map(APIService.convertToJson);
    }

}