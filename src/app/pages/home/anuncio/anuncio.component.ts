import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AnunciosService } from 'src/app/services/anuncios/anuncios.service';

@Component({
    selector: 'app-anuncio',
    templateUrl: './anuncio.component.html',
    styleUrls: ['./anuncio.component.scss'],
})
export class AnuncioComponent implements OnInit {

    constructor(
        private AnunciosService: AnunciosService,
    ) { }
    

    ngOnInit() {
        this.anuncio = this.AnunciosService.anuncio;
        console.log(this.anuncio)
        this.urls_image = this.anuncio.urls.split(",");
    }

    //!DATA=====================================================================
    //?CARGA===================================================================================
    anuncio:any;
    urls_image:any=[];

    //?GESTION===================================================================================

    //?CONTROL===================================================================================
    url = environment.server;



}
