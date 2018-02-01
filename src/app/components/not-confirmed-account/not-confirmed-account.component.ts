import { Component, OnInit } from '@angular/core';
import {SessionService} from "../../modules/auth/services/session.service";

@Component({
  selector: 'app-not-confirmed-account',
  templateUrl: './not-confirmed-account.component.html'
})
export class NotConfirmedAccountComponent implements OnInit {

  constructor(private sessionService: SessionService) { }

  ngOnInit() {
  }

  logoutClicked(){
    this.sessionService.logout().subscribe(()=>{
      window.location.href = "/login";
    });
  }
}
