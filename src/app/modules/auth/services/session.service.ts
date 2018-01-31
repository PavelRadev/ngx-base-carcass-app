import {KeyValuePair} from '../../../shared/classes/keyValuePair';
import {EventEmitter, Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {LocalStorageService} from "angular-2-local-storage";
import {ApiClientService} from "../../data-services/services/api-client.service";
import {Response} from "@angular/http";
import * as _ from 'lodash';
import * as moment from "moment";
import {User} from "../../data-services/models/user.model";

@Injectable()
export class SessionService {

    public token: any;

    private currentUserSubject: Subject<User>;

    private currentUser: User;

    private sessionCheckInterval: any;

    private sessionRefreshTimeout: any;

    private hasUserActivity: boolean;

    public isAutoRefreshNeeded: boolean = false;

    public tokenRefreshed$: EventEmitter<any> = new EventEmitter<any>();

    public currentUserSubjectChanged$: EventEmitter<User> = new EventEmitter<User>();

    constructor(private apiService: ApiClientService, private localStorageService: LocalStorageService) {
        this.currentUserSubject = new Subject<any>();
        this.reinitToken();
    }

    private refreshToken() {
        if (!this.hasUserActivity) return;
        return this.apiService.post('/auth/refresh', {}, false)
            .subscribe(response => {
                let data = response.json() && response.json().data;
                let token = data.token;
                if (token) {
                    this.token = token;
                    this.localStorageService.set('token', token);
                    this.tokenRefreshed$.emit(this.token);
                }
            }, this.handleError);
    }

    private reinitToken() {
        this.token = this.localStorageService.get('token');
    }

    getCurrentUser(): User {
        return this.currentUser;
    }

    getCurrentUserSubject(): Subject<User> {
        return this.currentUserSubject;
    }

    EmitCurrentUserUpdate() {
        this.apiService.get('/auth/me', null, false)
            .subscribe((response: Response) => {
                let data = response.json().data;
                this.currentUser = data.user;
                this.currentUserSubject.next(this.currentUser);
                this.currentUserSubjectChanged$.emit(this.currentUser);
            });
    }


    login(login, password): Observable<boolean> {
        return this.apiService.post('/auth/signin', {login: login, password: password}, false)
            .map((response: Response) => {
                let data = response.json() && response.json().data;
                let token = data.token;
                this.hasUserActivity = false;
                if (token) {
                    this.token = token;
                    this.localStorageService.set('token', token);
                    if (!this.sessionCheckInterval) {
                        this.sessionCheckTask();
                    }
                    return true;
                } else {
                    return false;
                }
            }).catch(this.handleError);
    }


    handleError(error) {
        return Observable.throw(error || 'Server error');
    }

    checkAccess(role): Observable<boolean> {
        this.reinitToken();
        if (!this.token) {
            return Observable.create(observer => observer.next(false));
        }

        return Observable.create((observer) => {
            this.apiService.get('/auth/me', null, false)
                .catch((error, r) => {
                    observer.next(false);
                    observer.complete();
                    return Observable.empty();
                })
                .subscribe((response: Response) => {
                    let data = response.json().data;

                    this.currentUser = User.FromJson(data.user);
                    console.log('current user:', this.currentUser);
                    this.currentUserSubject.next(this.currentUser);
                    this.currentUserSubjectChanged$.emit(this.currentUser);

                    if (!this.sessionCheckInterval) {
                        this.sessionCheckTask();
                    }

                    observer.next(true);
                    observer.complete();
                });
        });
    }

    public getTokenExpireDiff() {
        let cred = this.parseJwt(this.token);
        let exp = moment(cred['exp'] * 1000);
        let diff = exp.diff(moment());

        return diff;
    }

    public sessionCheckTask() {
        if (!this.token) return;

        let diff = this.getTokenExpireDiff();

        if (diff < 0) {
            this.logout();
            return;
        }


        if (this.sessionRefreshTimeout) {
            clearTimeout(this.sessionRefreshTimeout);
        }

        this.sessionRefreshTimeout = setTimeout(() => {
            this.refreshToken();
        }, diff / 2);
    }

    public onUserAction() {
        this.hasUserActivity = true;
        this.sessionCheckTask();
    }

    logout(): Subject<any> {
        let subject = new Subject<any>();
        this.apiService.post('/auth/signout', false)
            .catch(this.handleError)
            .subscribe(resp => {
                this.token = null;
                this.isAutoRefreshNeeded = false;
                this.localStorageService.remove('token');
                this.currentUser = null;
                this.currentUserSubject.next(null);
                subject.next(true);
            });
        return subject;
    }

    private parseJwt(token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    }
}
