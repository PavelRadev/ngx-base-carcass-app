import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs/observable';
import {SessionService} from "../services/session.service";

@Injectable()
export class AuthGuard implements CanActivate{

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
        return new Promise((resolve, reject) => {
            this.sessionService.checkAccess("admin").subscribe(success => {
                if(!success){
                    this.router.navigate(['/login']);
                }
                resolve(success);
            }, () => {
                this.router.navigate(['/login']);
                reject(false);
            });
        });
    }

    constructor(private router: Router, private sessionService: SessionService){

    }
}