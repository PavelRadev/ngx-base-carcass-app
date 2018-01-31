import {ApiClientService} from "./api-client.service";
import 'rxjs/add/operator/map';
import {LocalStorageService} from "angular-2-local-storage";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {IService} from "./IService";
import {Router} from "@angular/router";
import {NgProgressService} from "ng2-progressbar";
import {BaseEntity} from "../models/BaseEntity";

export abstract class BaseClientService<T extends BaseEntity> extends ApiClientService implements IService<T> {

    protected apiBasePath: string;

    public abstract fromJson(json: any): T;

    public abstract toJson(entity: T): any;

    public constructor(http: Http,
                       localStorage: LocalStorageService,
                       router: Router,
                       progressService: NgProgressService) {
        super(http, localStorage, router, progressService);
    }

    public getServiceName() {
        return "BaseClientService";
    }

    public getAll(params: any = {}, isLoadingDisplayed: boolean = true): Observable<T[]> {
        //noinspection TypeScriptValidateTypes
        return this.get(this.apiBasePath, params, isLoadingDisplayed)
            .map(response => this.handleResponse(response, isLoadingDisplayed).map(j => this.fromJson(j)));
    }

    public getByIds(ids: string[], isLoadingDisplayed: boolean = true): Observable<T[]> {
        //noinspection TypeScriptValidateTypes
        return this.get(`${this.apiBasePath}/by_ids`, {ids: ids}, isLoadingDisplayed).map((response: Response) => {
            return this.handleResponse(response, isLoadingDisplayed).map((x) => {
                return this.fromJson(x);
            });
        });
    }

    public getPaginated(params: any = {}): Observable<{ list: T[], count: number }> {
        //noinspection TypeScriptValidateTypes
        return this.get(this.apiBasePath, params).map((response: Response) => {
            let json = this.handleResponsePaginated(response);
            let arr = json['data'].map(x => this.fromJson(x));
            return {list: arr, count: json['count']};
        });
    }

    public getById(id, isLoadingDisplayed: boolean = true): Observable<T> {
        //noinspection TypeScriptValidateTypes
        return this.get(`${this.apiBasePath}/${id}`, {}, isLoadingDisplayed).map((response: Response) => {
            return this.fromJson(this.handleResponse(response, isLoadingDisplayed));
        });
    }

    public create(entity: T): Observable<T> {
        //noinspection TypeScriptValidateTypes
        return this.post(this.apiBasePath, this.toJson(entity)).map((response: Response) => {
            return this.fromJson(this.handleResponse(response));
        });
    }

    public update(entity: T): Observable<T> {
        //noinspection TypeScriptValidateTypes
        return this.post(`${this.apiBasePath}/${entity.id}`, this.toJson(entity)).map((response: Response) => {
            return this.fromJson(this.handleResponse(response));
        });
    }

    public deleteById(id): Observable<any> {
        //noinspection TypeScriptValidateTypes
        return this.delete(`${this.apiBasePath}/${id}`).map((response: Response) => {
            return this.handleResponse(response);
        });
    }
}