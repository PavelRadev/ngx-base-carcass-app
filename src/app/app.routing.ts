import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MainLayoutComponent} from './components/main-layout/main-layout.component';
import {HomeComponent} from './components/home/home.component';
import {AuthGuard} from "./modules/auth/guards/auth.guard";
import {AdminGuard} from "./modules/auth/guards/admin.guard";
import {NotConfirmedGuard} from "./modules/auth/guards/not-confirmed.guard";
import {NotConfirmedAccountComponent} from "./components/not-confirmed-account/not-confirmed-account.component";

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [ AuthGuard,NotConfirmedGuard ],
        children: [
            { path: '',  redirectTo: '/home', pathMatch: 'full' },
            {
                path: 'home',
                component: HomeComponent,
                data: { title: 'Главная' }
            },
            {
                path: 'admin',
                loadChildren: './modules/name.module#ModuleClassName',
                canActivate: [ AdminGuard ],
            }
        ]
    },
    {
        path: 'not-confirmed-account',
        component: NotConfirmedAccountComponent,
        data: { title: 'Аккаунт не подтвержден' }
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
        data: { title: 'Главная' }
    }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class RootRoutingModule {}
