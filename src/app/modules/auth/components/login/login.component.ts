import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SessionService } from '../../services/session.service';
import {Router} from "@angular/router";
import {NgProgressService} from "ng2-progressbar";
import {ApiClientService} from "../../../data-services/services/api-client.service";
import {UtilsString} from "../../../utils/utilsStrings";

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

    model: any;

    error: string;

    loading: boolean;
    @ViewChild('loginInput') loginInput: ElementRef;

    constructor(private sessionService: SessionService,
                private router: Router) {
        this.model = {
            login: "",
            password: ""
        };
        if(this.sessionService.token) {
            this.router.navigate(["/home"]);
        }
    }

    ngOnInit() {}

    onSubmit(){
        this.error = null;
        this.loading = true;

        this.sessionService.login(this.model.login, this.model.password).subscribe(result => {
            if(result){
                this.router.navigate(['/home']);

                let params = {
                    with_notifications:1,
                    with_email:1,
                    with_online_users:1
                };
                ApiClientService.currentLoadingsCounter = 0;
            }else{
                this.error = "Неправильный логин или пароль";
                this.loading = false;
            }
        }, err => {
            this.error = UtilsString.ParseResponseErrorMessage(err);
            this.loading = false;
        });
    }

    private isPasswordVisible:boolean = false;
    getPasswordInputType(){
        return this.isPasswordVisible?'text':'password';
    }

     ngAfterViewInit(): void {
        if (this.loginInput) this.loginInput.nativeElement.focus();
    }
}
