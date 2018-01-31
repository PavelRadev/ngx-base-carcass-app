import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SessionService } from '../../services/session.service';
import {Router} from "@angular/router";
import {NgProgressService} from "ng2-progressbar";
import {ApiClientService} from "../../../data-services/services/api-client.service";
import {User} from "../../../data-services/Models/user.model";
import {UsersService} from "../../../data-services/services/users.service";
import {UtilsString} from "../../../utils/utilsStrings";

@Component({
    selector: 'app-register',
    templateUrl: 'register.component.html',
    styleUrls: ['register.component.scss']
})
export class RegisterComponent implements OnInit {

    model: User;

    error: string;

    loading: boolean;

    constructor(private sessionService: SessionService,
                private usersService: UsersService,
                private router: Router) {
        this.model = User.New();
    }

    ngOnInit() {}

    onSubmit(){
        if(this.model['passwordConfirmation'] && this.model.password != this.model['passwordConfirmation'])
            this.error = "Пароль и подтверждение не совпадают";

        this.error = null;
        this.loading = true;

        this.usersService.create(this.model).subscribe(user=>{
            this.sessionService.login(this.model.login, this.model.password).subscribe(result => {
                if(result){
                    this.router.navigate(['/home']);
                }else{
                    this.error = "Неправильный логин или пароль";
                    this.loading = false;
                }
            }, err => {
                this.error = UtilsString.ParseResponseErrorMessage(err);
                this.loading = false;
            });
        },err=>{
            this.error = UtilsString.ParseResponseErrorMessage(err);
        });
    }
}
