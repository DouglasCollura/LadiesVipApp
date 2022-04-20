import { Component, OnInit } from '@angular/core';
import { AnunciosService } from 'src/app/services/anuncios/anuncios.service';
import { SplashScreenStateService } from 'src/app/services/splash-screen-state.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    constructor(
        private splashScreenStateService: SplashScreenStateService,
        private AnunciosService:AnunciosService
    ) {
     }

    ngOnInit() {
        this.splashScreenStateService.stop();
        this.GetAnuncios();
    }

    //!DATA=====================================================================
    //?CARGA===================================================================================
    anuncios:any={
        data:null
    };


    //?GESTION===================================================================================



    //?CONTROL===================================================================================
    loggedIn: boolean = false;
    load: boolean=false;
    hoy = new Date();
    // * MODALES ================================
    ctrl_modal_detalles: boolean = false;
    ctrl_menu: number = 0;
    server = environment.server;
    //!FUNCIONES=============================================================
    //?CARGA=============================================================
    GetAnuncios(){

        this.AnunciosService.GetAnuncio().then(res =>{
            this.anuncios = res;
            console.log(res)
        });
    }


    //?GESTION============================================================
    showImage(urls:any){
        console.log(urls.split(","));      
        return this.server+urls.split(",")[0];
         
    }

    //?CONTROL==============================================================================

    GetEdad(fecha:any){
        var cumpleanos = new Date(fecha);
        var edad = this.hoy.getFullYear() - cumpleanos.getFullYear();
        var m = this.hoy.getMonth() - cumpleanos.getMonth();

        if (m < 0 || (m === 0 && this.hoy.getDate() < cumpleanos.getDate())) {
            edad--;
        }
        return edad;
    }

    nav(menu: number) {
        this.ctrl_menu = menu;
    }


}
