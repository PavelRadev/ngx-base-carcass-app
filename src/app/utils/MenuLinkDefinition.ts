/**
 * Created by Andrew on 12.11.2016.
 */


export class MenuLinkDefinition{

    public constructor(
        public title: string,
        public iconCls: string,
        public route: string,
        public accessLevel: string = null,
        public children: MenuLinkDefinition[] = [],
        public visible: () => boolean = null,
        public tagPillCount:number = 0,
        public tagPillClass:string = "",
        public dropdownComponent:any = null,
        public isCollapsed: boolean = true,
        public isActiveLink: boolean = false,
        // public routeTeacher: string = null
    ){

        if(this.visible == null){
            this.visible = () => {
                return true;
            }
        }
    }

}