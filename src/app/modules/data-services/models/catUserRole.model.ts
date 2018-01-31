import {BaseEntity} from './BaseEntity';
import * as _ from 'lodash';

export class CatUserRole extends BaseEntity {
    // ToDo: Place hardcoded ids of roles here if needed
    public static readonly ROLE_ID_SUPERUSER = '';
    public static readonly ROLE_ID_USER = '';

    constructor(id: string,
                public name: string) {
        super();
        this.id = id;
    }

    public static GetList(): CatUserRole[] {
        return [
            new CatUserRole(CatUserRole.ROLE_ID_SUPERUSER, "Администратор"),
            new CatUserRole(CatUserRole.ROLE_ID_USER, "Пользователь")
        ];
    }

    public static FromJson(json: any): CatUserRole {
        return new CatUserRole(
            json['id'],
            json['name'],
        );
    }

    public static GetNameById(id: string) {
        if (!id) return '';
        let item = _.find(CatUserRole.GetList(), i => i.id == id);
        return item ? item.name : '';
    }
}