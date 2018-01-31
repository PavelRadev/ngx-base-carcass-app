import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { SessionService } from './services/session.service';
import { AppRoutingModule } from './auth.routing';
import { AccessService } from "./services/access.service";
import { AdminGuard } from "./guards/admin.guard";
import {LocalStorageService} from "angular-2-local-storage/dist";
import {RegisterComponent} from "./components/register/register.component";
import {NotConfirmedGuard} from "./guards/not-confirmed.guard";

@NgModule({
    imports: [
        CommonModule,
        AppRoutingModule,
        FormsModule
    ],
    declarations: [
        AuthComponent,
        LoginComponent,
        RegisterComponent
    ],
    providers:[
        LocalStorageService
    ],
    exports: []
})
export class AuthModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AuthModule,
            providers: [
                AuthGuard,
                AdminGuard,
                SessionService,
                AccessService,
                NotConfirmedGuard
            ]
        };
    }
}
