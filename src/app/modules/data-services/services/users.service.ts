import 'rxjs/add/operator/map';
import {Injectable} from "@angular/core";
import {User} from "../models/user.model";
import 'rxjs/add/operator/map';
import {CatUserRole} from "../Models/catUserRole.model";
import {NamedClientService} from "./namedClientService.service";

@Injectable()
export class UsersService extends NamedClientService<User> {
    public static ROLE_ORDER = {
        [CatUserRole.ROLE_ID_SUPERUSER]: 100,
        [CatUserRole.ROLE_ID_USER]: 1
    };

    getApiBasePath(): string {
        return 'users';
    }

    public getServiceName() {
        return "UsersService";
    }

    public fromJson(json: any): User {
        return User.FromJson(json);
    }

    public toJson(entity: User): any {
        return entity.toJson();
    }
}