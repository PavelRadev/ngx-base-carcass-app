import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs/observable';
import {SessionService} from "../services/session.service";
import {AccessService} from "../services/access.service";

@Injectable()
export class NotConfirmedGuard implements CanActivate{

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
        return new Promise((resolve, reject) => {
            let user = this.sessionService.getCurrentUser();
            if(user){
                if(this.accessService.IsConfirmed()){
                    resolve(true);
                }else{
                    this.router.navigate(['/not-confirmed-account']);
                    resolve(false);
                }
            }else{
                this.sessionService.getCurrentUserSubject().subscribe(user => {
                    if(this.accessService.IsConfirmed()){
                        resolve(true);
                    }else{
                        this.router.navigate(['/not-confirmed-account']);
                        resolve(false);
                    }
                });
            }
        });
    }

    constructor(private router: Router, private sessionService: SessionService, private accessService: AccessService){

    }
}