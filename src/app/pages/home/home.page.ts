import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    constructor() { }

    ngOnInit() {
    }

    //!DATA=====================================================================
    //?CARGA===================================================================================



    //?GESTION===================================================================================



    //?CONTROL===================================================================================
    loggedIn: boolean = false;

    // * MODALES ================================
    ctrl_modal_detalles: boolean = false;
    ctrl_menu: number = 4;

    //!FUNCIONES=============================================================
    //?CARGA=============================================================



    //?GESTION============================================================


    //?CONTROL==============================================================================

    nav(menu: number) {
        this.ctrl_menu = menu;
    }


}
