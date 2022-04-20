import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
    selector: 'app-cuenta-acceso',
    templateUrl: './cuenta-acceso.component.html',
    styleUrls: ['./cuenta-acceso.component.scss'],
})
export class CuentaAccesoComponent implements OnInit {

    constructor() { }

    ngOnInit() {

        this.usuario = JSON.parse(localStorage.getItem("usuario"))
        console.log(this.usuario)
     }
    //!DATA=====================================================================
    //?CARGA===================================================================================


    //?GESTION===================================================================================
    usuario:any;

    //?CONTROL===================================================================================
    display_main:boolean=true;
    display_info:boolean=false;
    display_clave:boolean=false;
    viewPass:boolean=false;


    //!FUNCIONES=============================================================

    //?CARGA=============================================================


    //?GESTION============================================================


    //?CONTROL==============================================================================

    tooglePass(){
        this.viewPass = !this.viewPass;
        let pass =$("#password")

        if(pass[0].type == 'text'){
            pass[0].type = 'password'
        }else{
            pass[0].type = 'text'
        }
    }
}
