import { Component, OnInit } from '@angular/core';
import { PagoService } from 'src/app/services/pago/pago.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-packs-anuncios',
    templateUrl: './packs-anuncios.component.html',
    styleUrls: ['./packs-anuncios.component.scss'],
})
export class PacksAnunciosComponent implements OnInit {

    constructor(
        private PagoService:PagoService,
        private route:Router
    ) { }

    ngOnInit() { }


    SelectPack(tipo:number){

        this.PagoService.tipo = tipo;

        this.route.navigateByUrl('home/config/pago')
    }

}
