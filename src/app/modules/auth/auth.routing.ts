import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import {RegisterComponent} from "./components/register/register.component";


export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        data: { title: 'Вход' }
    },
    {
        path: 'register',
        component: RegisterComponent,
        data: { title: 'Регистрация' }
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
