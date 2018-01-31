import * as _ from 'lodash';
import {AccessService} from "../auth/services/access.service";
import {MenuLinkDefinition} from "./MenuLinkDefinition";
import {CatUserRole} from "../data-services/Models/catUserRole.model";



export class MenuLinksUtils {

    private filterLinks(accessService: AccessService, links: MenuLinkDefinition[], singleDimension: boolean = false): MenuLinkDefinition[] {
        let res: MenuLinkDefinition[] = [];
        for (let i in links) {
            if (links[i].accessLevel != null) {
                if (accessService.HasRole(links[i].accessLevel)) {
                    let addItem: boolean = true;
                    let item = links[i];
                    if (item.children != null && item.children.length > 0) {

                        // Механизм для преобразования многомерного массива ссылок в одномерный
                        // Пока не пригодится, т.к. версия меню финансов для преподавателей подразумевает замену именования ссылок, и иконок

                        // if(singleDimension){
                        //     item.children = this.filterLinks(accessService, item.children, singleDimension);
                        //
                        //     item.children.forEach(i=>{
                        //         if(i.children.length<1)
                        //             res.push(i)
                        //     });
                        //
                        //     addItem = false;
                        // }
                        // else{
                        //     item.children = this.filterLinks(accessService, item.children, singleDimension);
                        // }

                        item.children = this.filterLinks(accessService, item.children, singleDimension);
                    }

                    if (addItem)
                        res.push(item);
                }
            } else {
                res.push(links[i]);
            }
        }
        return res;
    }

    public GetMenuLinks(accessService: AccessService
    ): MenuLinkDefinition[] {
        let links: MenuLinkDefinition[] = [
            new MenuLinkDefinition(
                'Главная',
                'icon-calendar',
                '/home',
                CatUserRole.ROLE_ID_USER
            ),
            new MenuLinkDefinition(
                'Голосования',
                'icon-calendar',
                '/votes',
                CatUserRole.ROLE_ID_USER
            ),
            new MenuLinkDefinition(
                'Администрирование',
                'icon-user',
                '/admin',
                CatUserRole.ROLE_ID_SUPERUSER
            )
        ];

        return this.filterLinks(accessService, links);
    }

    public GetAdminModuleLinks(accessService: AccessService): MenuLinkDefinition[] {
        let links: MenuLinkDefinition[] = [
            new MenuLinkDefinition(
                'Пользователи',
                'fa fa-file-text-o',
                '/admin/users',
                CatUserRole.ROLE_ID_SUPERUSER
            )
        ];

        return this.filterLinks(accessService, links);
    }

    public static FindLastLinkWithSameUrl(links:MenuLinkDefinition[],urlToCompare:string): MenuLinkDefinition{
        let linkWithSameUrl:MenuLinkDefinition = null;
        links.forEach(l=>{
            if(l.route == urlToCompare) {
                linkWithSameUrl = l;
            }
            else if(l.children.length > 0){
                let foundInChilds = MenuLinksUtils.FindLastLinkWithSameUrl(l.children, urlToCompare);

                if(foundInChilds)
                    linkWithSameUrl = foundInChilds;
            }
        });

        return linkWithSameUrl;
    }

    public static ProcessLinksListUsingRoute(links:MenuLinkDefinition[],urlToCompare:string){
        console.log("current link",urlToCompare);
        MenuLinksUtils.CollapseAll(links);
        MenuLinksUtils.DeactivateAll(links);

        let linkWithSameUrl:MenuLinkDefinition = null;
        links.forEach(l=>{
            if(l.route == urlToCompare) {
                l.isActiveLink = true;
                linkWithSameUrl = l;
            }
            else if(l.children.length > 0){
                let foundInChilds = MenuLinksUtils.ProcessLinksListUsingRoute(l.children, urlToCompare);

                if(foundInChilds){
                    foundInChilds.isActiveLink = true;
                    linkWithSameUrl = foundInChilds;
                    l.isActiveLink = true;
                    l.isCollapsed = false;
                }
            }
        });
        console.log(links);
        return linkWithSameUrl;
    }

    public static CollapseAll(links:MenuLinkDefinition[]){
        _.forEach(links, i=>{
            i.isCollapsed = true;
            if(i.children.length>0) MenuLinksUtils.CollapseAll(i.children);
        })
    }

    public static DeactivateAll(links:MenuLinkDefinition[]){
        _.forEach(links, i=>{
            i.isActiveLink = false;
            if(i.children.length>0) MenuLinksUtils.DeactivateAll(i.children);
        })
    }
}