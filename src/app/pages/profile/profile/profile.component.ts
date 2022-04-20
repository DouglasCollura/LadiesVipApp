import { Component, OnInit } from '@angular/core';
import { AnunciosService } from 'src/app/services/anuncios/anuncios.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

    constructor(
        private AnunciosService: AnunciosService,
    ) { }

    ngOnInit() {
        this.GetMyAdd();
        this.datos = JSON.parse(localStorage.getItem("usuario"))
    }

    //!DATA=====================================================================
    //?CARGA===================================================================================
    myadd:any;
    datos:any;
    //?GESTION===================================================================================


    //?CONTROL===================================================================================
    url = environment.server;
    hoy = new Date();
    
    GetMyAdd(){
        this.AnunciosService.GetMyAdd().then(res => {
            this.myadd = res[0];
            console.log(this.myadd)
            this.AnunciosService.anuncio = res[0];
        });
    }

    GetEdad(){
        var cumpleanos = new Date(this.datos.fecha_nac);
            var edad = this.hoy.getFullYear() - cumpleanos.getFullYear();
            var m = this.hoy.getMonth() - cumpleanos.getMonth();

            if (m < 0 || (m === 0 && this.hoy.getDate() < cumpleanos.getDate())) {
                edad--;
            }
            return edad;
    }
}
