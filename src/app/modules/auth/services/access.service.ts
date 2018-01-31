import {Injectable} from "@angular/core";
import {SessionService} from "./session.service";
import {LocalStorageService} from "angular-2-local-storage";
import {UsersService} from "../../data-services/services/users.service";
import * as _ from 'lodash';
import {CatUserRole} from "../../data-services/Models/catUserRole.model";

@Injectable()
export class AccessService {
    constructor(private sessionService: SessionService, private localStorageService: LocalStorageService) {
    }

    public IsAdmin(strict: boolean = false) {
        if (!strict) return this.HasRole(CatUserRole.ROLE_ID_SUPERUSER);
        return this.HasStrictRole(CatUserRole.ROLE_ID_SUPERUSER);
    }

    public IsUser(strict: boolean = false) {
        if (!strict) return this.HasRole(CatUserRole.ROLE_ID_USER);
        return this.HasStrictRole(CatUserRole.ROLE_ID_USER);
    }

    public IsConfirmed() {
        let user = this.sessionService.getCurrentUser();
        return !!user ? user.isConfirmed : null;
    }

    public HasRole(role) {
        let user = this.sessionService.getCurrentUser();
        if (!user || !user.roleId) return false;

        let roleOrder = UsersService.ROLE_ORDER;

        return roleOrder[user.roleId] >= roleOrder[role];
    }

    public HasStrictRole(role) {
        let user = this.sessionService.getCurrentUser();
        if (!user || !user.roleId) return false;
        return user.roleId == role;
    }
}