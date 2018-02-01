import {Component, OnDestroy, OnInit} from '@angular/core';
import {SessionService} from "../../modules/auth/services/session.service";
import {User} from "../../modules/data-services/Models/user.model";
import {Router} from "@angular/router";
import {MenuLinkDefinition} from "../../modules/utils/MenuLinkDefinition";
import {AccessService} from "app/modules/auth/services/access.service";
import {MenuLinksUtils} from "../../modules/utils/menuLinksUtils";

@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent implements OnInit, OnDestroy {
    currentUser: User = null;
    isActive:boolean = true;
    isUserConfirmed: boolean = false;

    links: MenuLinkDefinition[] = [];

    constructor(private sessionService: SessionService,
                private router: Router,
                private accessService: AccessService) {
        this.currentUser = sessionService.getCurrentUser();
        this.isUserConfirmed = this.accessService.IsConfirmed();
    }

    ngOnInit() {
        let menuLinksUtils = new MenuLinksUtils();
        this.links = menuLinksUtils.GetMenuLinks(this.accessService);
    }

    logoutClicked(){
        this.sessionService.logout().takeWhile(x=>this.isActive).subscribe(()=>{
            window.location.href = "/login";
        });
    }

    ngOnDestroy(): void {
        this.isActive = false;
    }
}
