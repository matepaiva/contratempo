export default class NavbarController {
    constructor() {
        this.name = 'ct-navbar';
        this.userMenu1 = this.getUserMenu1();
        this.userMenu2 = this.getUserMenu2();
    }
    openMenu($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
    }
    noop() {
        console.log('noop');
    }
    getUserMenu1() {
        return [{
            text: 'Adicionar novo',
            icon: 'alarm_add',
            functionality: this.noop,
            isDisabled: false
        },{
            text: 'Meus contratempos',
            icon: 'view_list',
            functionality: this.noop,
            isDisabled: false
        },{
            text: 'Editar perfil',
            icon: 'edit',
            functionality: this.noop,
            isDisabled: false
        }];
    }
    getUserMenu2() {
        return [{
            text: 'Sair',
            icon: 'exit_to_app',
            functionality: this.noop,
            isDisabled: false
        }];
    }
}
