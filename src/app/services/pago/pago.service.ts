import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class PagoService {

    constructor(
        private http: HttpClient,
    ) { }
    @Output() change: EventEmitter<any> = new EventEmitter();

    url = environment.serverUrl;
    token=localStorage.getItem('token');
    
    tipo:number=0;

    titulo=[
        "Promoción Standard",
        "Promoción Plus",
        "Promoción Extra Plus",
        "Promoción Standard",
        "Renovación por separado"
    ];

    precio=[

    ]

    SetTitle(tipo:number){
        this.tipo = tipo;
        this.change.emit({tipo:this.tipo});
    }


}
