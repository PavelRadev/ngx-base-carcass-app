import * as moment from 'moment';
import * as _ from 'lodash';
import {BaseEntity} from "./BaseEntity";
import {CatUserRole} from "./catUserRole.model";
import {UtilsDateTime} from "../../../utils/utilsDateTime";

export class User extends BaseEntity {
    public roleName: string = '';
    public isConfirmed: boolean = false;
    public isSuperuser: boolean = false;

    public static FromJson(json: any) {
        return new User(
            json['id'],
            json['login'],
            json['name'],
            json['password'],
            UtilsDateTime.GetMomentFromString(json['confirmed_at']),
            json['role_id'],
            json['email'],
            json['phone'],
            UtilsDateTime.GetMomentFromString(json['created_at']),
            UtilsDateTime.GetMomentFromString(json['updated_at']),
            UtilsDateTime.GetMomentFromString(json['deleted_at']),
            json['role'] ? CatUserRole.FromJson(json['role']) : null
        );
    }

    public static New() {
        return new User(null, '', '', '', null, CatUserRole.ROLE_ID_USER, '', '', moment(), null, null);
    }

    public constructor(id: string,
                       public login: string,
                       public name: string,
                       public password: string,
                       public confirmedAt: moment.Moment,
                       public roleId: string,
                       public email: string,
                       public phone: string,
                       public createdAt: moment.Moment,
                       public updatedAt: moment.Moment,
                       public deletedAt: moment.Moment,
                       public role: CatUserRole = null) {
        super();
        this.id = id;

        this.initialize();
    }

    public initialize() {
        this.roleName = CatUserRole.GetNameById(this.roleId);
        this.isConfirmed = !!this.confirmedAt;
        this.isSuperuser = this.roleId == CatUserRole.ROLE_ID_SUPERUSER;
    }

    public toJson(): any {
        let obj: any = {
            id: this.id,
            login: this.login,
            name: this.name,
            role_id: this.roleId,
            email: this.email,
            phone: this.phone,
            password: this.password
        };

        if (this.confirmedAt) obj.confirmed_at = this.confirmedAt.format(UtilsDateTime.DateRequestFormat);
        return obj;
    }


}
