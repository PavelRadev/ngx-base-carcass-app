import {Injectable} from '@angular/core';
import {NgProgressService} from 'ng2-progressbar/service/progress.service';
import {LocalStorageService} from 'angular-2-local-storage/dist';
import {Router} from '@angular/router';
import {Http} from '@angular/http';
import {BaseClientService} from './base.client.service';
import {BaseEntity} from "../models/BaseEntity";


@Injectable()
export abstract class NamedClientService<T extends BaseEntity> extends BaseClientService<T> {

    public constructor(http: Http,
                       localStorage: LocalStorageService,
                       router: Router,
                       progressService: NgProgressService) {
        super(http, localStorage, router, progressService);
        this.apiBasePath = this.getApiBasePath();
    }

    abstract getServiceName(): string;

    abstract getApiBasePath(): string;

}