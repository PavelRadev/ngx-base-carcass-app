import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {NgProgressModule} from "ng2-progressbar";
import {DataServicesModule} from "./modules/data-services/data-services.module";
import {AuthModule} from "./modules/auth/auth.module";
import {RootRoutingModule} from "./app.routing";
import {LocalStorageExtendedService} from "./shared/services/localStorageExtended.service";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RootRoutingModule,
    NgProgressModule,
    AuthModule.forRoot(),
    DataServicesModule.forRoot(),
  ],
  providers: [
    LocalStorageExtendedService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
