import {CommonModule} from "@angular/common";
import {ModuleWithProviders, NgModule} from "@angular/core";
import {AuthModule} from "../auth/auth.module";
import {RouterModule} from "@angular/router";
import {ApiClientService} from "./services/api-client.service";
import {UsersService} from "./services/users.service";
@NgModule({
    imports: [
        CommonModule,
        AuthModule,
        RouterModule
    ],
})
export class DataServicesModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DataServicesModule,
            providers: [
                ApiClientService,
                UsersService
            ]
        };
    }
}

