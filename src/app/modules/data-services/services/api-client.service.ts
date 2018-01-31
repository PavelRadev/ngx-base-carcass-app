import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response, URLSearchParams} from '@angular/http';
import {LocalStorageService} from "angular-2-local-storage";
import {Observable} from 'rxjs';
import {AppSettings} from "../../../appSettings";
import {Router} from "@angular/router";
import {NgProgressService} from "ng2-progressbar";

@Injectable()
export class ApiClientService {

    constructor(private http: Http,
                protected localStorage: LocalStorageService,
                private router: Router,
                private progressService: NgProgressService) {
    }

    public static currentLoadingsCounter: number = 0;

    public handleLoading() {
        if (ApiClientService.currentLoadingsCounter == 0) {
            this.progressService.set(100);
            this.progressService.done();
        } else {
            this.progressService.start();
        }
    }

    createRequestOptions(getParams: any = {}): RequestOptions {
        let headers = new Headers();
        let token = this.localStorage.get('token');
        if (token) {
            headers.append('Authorization', 'Bearer ' + token);
        }
        let search = new URLSearchParams();
        _.forOwn(getParams, (value, key) => {
            search.set(key, value);
        });
        return new RequestOptions({headers: headers, search: search});
    }

    get(url, params: any = {}, isLoadingDisplayed: boolean = true): Observable<Response> {
        if (isLoadingDisplayed) {
            ApiClientService.currentLoadingsCounter += 1;
            console.log(url);
            this.handleLoading();
        }

        return this.http.get(AppSettings.getAPIUrl(url), this.createRequestOptions(params))
            .catch((err) => {
                return this.handleError(err, isLoadingDisplayed);
            });
    }

    post(url, data, isLoadingDisplayed: boolean = true): Observable<Response> {
        if (isLoadingDisplayed) {
            ApiClientService.currentLoadingsCounter += 1;
            console.log(url);
            this.handleLoading();
        }
        return this.http.post(AppSettings.getAPIUrl(url), data, this.createRequestOptions())
            .catch((err) => {
                return this.handleError(err, isLoadingDisplayed);
            });
    }

    delete(url, isLoadingDisplayed: boolean = true): Observable<Response> {
        if (isLoadingDisplayed) {
            ApiClientService.currentLoadingsCounter += 1;
            console.log(url);
            this.handleLoading();
        }
        return this.http.delete(AppSettings.getAPIUrl(url), this.createRequestOptions())
            .catch((err) => {
                return this.handleError(err, isLoadingDisplayed);
            });
    }

    protected handleError(error: Response | any, isLoadingDisplayed: boolean = true) {
        if (isLoadingDisplayed) {
            ApiClientService.currentLoadingsCounter -= 1;
            this.handleLoading();
        }
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            console.log(error.status);

            if (error.status == 401) {
                this.handleSessionExpired();
            }

            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }

        return Observable.throw(errMsg);
    }

    protected handleResponse(response: Response, isLoadingDisplayed: boolean = true) {
        if (isLoadingDisplayed) {
            ApiClientService.currentLoadingsCounter -= 1;
            this.handleLoading();
        }

        let json = response.json();
        if (json['status'] == 'error') {
            throw new Error("Server error");
        }
        return json['data'];
    }

    protected handleResponsePaginated(response: Response, isLoadingDisplayed: boolean = true) {
        if (isLoadingDisplayed) {
            ApiClientService.currentLoadingsCounter -= 1;
            this.handleLoading();
        }

        let json = response.json();
        if (json['status'] == 'error') {
            throw new Error("Server error");
        }
        return json;
    }

    public handleSessionExpired() {
        this.localStorage.remove('token');
        this.router.navigate(['/login']);
    }
}
